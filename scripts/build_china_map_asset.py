#!/usr/bin/env python3
"""Build a static China map SVG-path asset from GMT CN-border data.

The generated TypeScript file is intentionally small enough for a static
GitHub Pages frontend and avoids any runtime map-data request.
"""

from __future__ import annotations

import argparse
import math
import pathlib
import urllib.request
import zipfile
from dataclasses import dataclass
from typing import Iterable


CN_BORDER_URL = (
    "https://github.com/gmt-china/china-geospatial-data/releases/download/"
    "v0.4.0/china-geospatial-data-UTF8.zip"
)
DEFAULT_ZIP = pathlib.Path("assets-source/china-geospatial-data-UTF8.zip")
DEFAULT_OUTPUT = pathlib.Path("src/generated/chinaMapPaths.ts")

MAIN_REGION = {
    "lonMin": 73.0,
    "lonMax": 136.0,
    "latMin": 18.0,
    "latMax": 54.0,
}
INSET_REGION = {
    "lonMin": 105.0,
    "lonMax": 123.0,
    "latMin": 3.0,
    "latMax": 24.0,
}
VIEWBOX = {"width": 720.0, "height": 460.0, "padding": 28.0}
INSET_BOX = {"x": 536.0, "y": 288.0, "width": 150.0, "height": 132.0}


@dataclass
class GmtRecord:
    meta: str
    points: list[tuple[float, float]]


def ensure_zip(zip_path: pathlib.Path) -> None:
    if zip_path.exists():
        return

    zip_path.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {CN_BORDER_URL}")
    urllib.request.urlretrieve(CN_BORDER_URL, zip_path)


def zip_member(zip_path: pathlib.Path, suffix: str) -> str:
    with zipfile.ZipFile(zip_path) as archive:
        matches = [name for name in archive.namelist() if name.endswith(suffix)]
    if not matches:
        raise FileNotFoundError(f"{suffix} not found in {zip_path}")
    return matches[0]


def parse_gmt(zip_path: pathlib.Path, suffix: str) -> list[GmtRecord]:
    records: list[GmtRecord] = []
    current: list[tuple[float, float]] = []
    meta = ""

    with zipfile.ZipFile(zip_path) as archive:
        text = archive.read(zip_member(zip_path, suffix)).decode("utf-8")

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        if line.startswith(">"):
            if current:
                records.append(GmtRecord(meta=meta, points=current))
            current = []
            meta = ""
            continue

        if line.startswith("# @D"):
            meta = line
            continue

        if line.startswith("#"):
            continue

        try:
            lon_text, lat_text = line.split()[:2]
            current.append((float(lon_text), float(lat_text)))
        except ValueError:
            continue

    if current:
        records.append(GmtRecord(meta=meta, points=current))

    return records


def record_bbox(points: Iterable[tuple[float, float]]) -> tuple[float, float, float, float]:
    points_list = list(points)
    lons = [point[0] for point in points_list]
    lats = [point[1] for point in points_list]
    return min(lons), max(lons), min(lats), max(lats)


def overlaps_region(
    bbox: tuple[float, float, float, float],
    region: dict[str, float],
) -> bool:
    min_lon, max_lon, min_lat, max_lat = bbox
    return (
        max_lon >= region["lonMin"]
        and min_lon <= region["lonMax"]
        and max_lat >= region["latMin"]
        and min_lat <= region["latMax"]
    )


def project_main(point: tuple[float, float]) -> tuple[float, float]:
    lon, lat = point
    usable_width = VIEWBOX["width"] - VIEWBOX["padding"] * 2
    usable_height = VIEWBOX["height"] - VIEWBOX["padding"] * 2
    x = VIEWBOX["padding"] + (lon - MAIN_REGION["lonMin"]) / (
        MAIN_REGION["lonMax"] - MAIN_REGION["lonMin"]
    ) * usable_width
    y = VIEWBOX["padding"] + (MAIN_REGION["latMax"] - lat) / (
        MAIN_REGION["latMax"] - MAIN_REGION["latMin"]
    ) * usable_height
    return x, y


def project_inset(point: tuple[float, float]) -> tuple[float, float]:
    lon, lat = point
    x = INSET_BOX["x"] + (lon - INSET_REGION["lonMin"]) / (
        INSET_REGION["lonMax"] - INSET_REGION["lonMin"]
    ) * INSET_BOX["width"]
    y = INSET_BOX["y"] + (INSET_REGION["latMax"] - lat) / (
        INSET_REGION["latMax"] - INSET_REGION["latMin"]
    ) * INSET_BOX["height"]
    return x, y


def perpendicular_distance(
    point: tuple[float, float],
    start: tuple[float, float],
    end: tuple[float, float],
) -> float:
    px, py = point
    sx, sy = start
    ex, ey = end
    dx = ex - sx
    dy = ey - sy

    if dx == 0 and dy == 0:
        return math.hypot(px - sx, py - sy)

    t = max(0.0, min(1.0, ((px - sx) * dx + (py - sy) * dy) / (dx * dx + dy * dy)))
    nearest_x = sx + t * dx
    nearest_y = sy + t * dy
    return math.hypot(px - nearest_x, py - nearest_y)


def simplify_path(points: list[tuple[float, float]], epsilon: float) -> list[tuple[float, float]]:
    if len(points) <= 2:
        return points

    keep = [False] * len(points)
    keep[0] = True
    keep[-1] = True
    stack = [(0, len(points) - 1)]

    while stack:
        start, end = stack.pop()
        max_distance = -1.0
        max_index = start
        for index in range(start + 1, end):
            distance = perpendicular_distance(points[index], points[start], points[end])
            if distance > max_distance:
                max_distance = distance
                max_index = index
        if max_distance > epsilon:
            keep[max_index] = True
            stack.append((start, max_index))
            stack.append((max_index, end))

    return [point for point, should_keep in zip(points, keep) if should_keep]


def format_number(value: float) -> str:
    text = f"{value:.1f}"
    return text[:-2] if text.endswith(".0") else text


def to_path(points: list[tuple[float, float]], close: bool) -> str:
    commands = [f"M{format_number(points[0][0])} {format_number(points[0][1])}"]
    commands.extend(f"L{format_number(x)} {format_number(y)}" for x, y in points[1:])
    if close:
        commands.append("Z")
    return " ".join(commands)


def record_name(meta: str) -> str:
    if not meta.startswith("# @D"):
        return ""
    parts = meta[4:].split("|")
    return parts[1] if len(parts) > 1 else ""


def build_paths(
    records: list[GmtRecord],
    *,
    region: dict[str, float],
    projector,
    epsilon: float,
    close: bool,
    min_points: int,
    include_low_latitude: bool,
) -> list[dict[str, str]]:
    paths: list[dict[str, str]] = []
    for index, record in enumerate(records):
        bbox = record_bbox(record.points)
        if not overlaps_region(bbox, region):
            continue
        if not include_low_latitude and bbox[3] < 17.5:
            continue

        projected = [projector(point) for point in record.points]
        simplified = simplify_path(projected, epsilon)
        if len(simplified) < min_points:
            continue

        item = {
            "id": f"path-{index}",
            "d": to_path(simplified, close=close),
        }
        name = record_name(record.meta)
        if name:
            item["name"] = name
        paths.append(item)
    return paths


def js_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def serialize_paths(name: str, paths: list[dict[str, str]]) -> str:
    lines = [f"  {name}: ["]
    for path in paths:
        name_part = f', name: "{js_string(path["name"])}"' if path.get("name") else ""
        lines.append(f'    {{ id: "{path["id"]}"{name_part}, d: "{js_string(path["d"])}" }},')
    lines.append("  ],")
    return "\n".join(lines)


def write_typescript(
    output_path: pathlib.Path,
    *,
    province_paths: list[dict[str, str]],
    outline_paths: list[dict[str, str]],
    south_sea_inset_paths: list[dict[str, str]],
    ten_dash_paths: list[dict[str, str]],
) -> None:
    content = f"""// Generated by scripts/build_china_map_asset.py from GMT China CN-border data.
// Source: {CN_BORDER_URL}

export type ChinaMapPath = {{
  id: string;
  name?: string;
  d: string;
}};

export const chinaMapPaths = {{
  viewBox: "0 0 {int(VIEWBOX["width"])} {int(VIEWBOX["height"])}",
  mainRegion: {MAIN_REGION!r},
  insetRegion: {INSET_REGION!r},
  insetBox: {INSET_BOX!r},
{serialize_paths("provincePaths", province_paths)}
{serialize_paths("outlinePaths", outline_paths)}
  islandPaths: [],
{serialize_paths("southSeaInsetPaths", south_sea_inset_paths)}
{serialize_paths("tenDashPaths", ten_dash_paths)}
}} as const;

export function projectChinaPoint(lon: number, lat: number) {{
  const padding = {VIEWBOX["padding"]};
  const width = {VIEWBOX["width"]};
  const height = {VIEWBOX["height"]};
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const x = padding + ((lon - chinaMapPaths.mainRegion.lonMin) /
    (chinaMapPaths.mainRegion.lonMax - chinaMapPaths.mainRegion.lonMin)) * usableWidth;
  const y = padding + ((chinaMapPaths.mainRegion.latMax - lat) /
    (chinaMapPaths.mainRegion.latMax - chinaMapPaths.mainRegion.latMin)) * usableHeight;

  return {{
    x: (x / width) * 100,
    y: (y / height) * 100,
  }};
}}
"""
    content = (
        content.replace("'", '"')
        .replace('"lonMin"', "lonMin")
        .replace('"lonMax"', "lonMax")
        .replace('"latMin"', "latMin")
        .replace('"latMax"', "latMax")
        .replace('"width"', "width")
        .replace('"height"', "height")
        .replace('"padding"', "padding")
        .replace('"x"', "x")
        .replace('"y"', "y")
    )
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--zip", type=pathlib.Path, default=DEFAULT_ZIP)
    parser.add_argument("--output", type=pathlib.Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()

    ensure_zip(args.zip)

    province_records = parse_gmt(args.zip, "CN-border-La.gmt")
    outline_records = parse_gmt(args.zip, "CN-border-L1.gmt")
    ten_dash_records = parse_gmt(args.zip, "ten-dash-line.gmt")

    province_paths = build_paths(
        province_records,
        region=MAIN_REGION,
        projector=project_main,
        epsilon=0.8,
        close=True,
        min_points=3,
        include_low_latitude=False,
    )
    outline_paths = build_paths(
        outline_records,
        region=MAIN_REGION,
        projector=project_main,
        epsilon=0.5,
        close=False,
        min_points=2,
        include_low_latitude=False,
    )
    south_sea_inset_paths = build_paths(
        outline_records,
        region=INSET_REGION,
        projector=project_inset,
        epsilon=0.35,
        close=False,
        min_points=2,
        include_low_latitude=True,
    )
    ten_dash_paths = build_paths(
        ten_dash_records,
        region=INSET_REGION,
        projector=project_inset,
        epsilon=0.25,
        close=False,
        min_points=2,
        include_low_latitude=True,
    )

    write_typescript(
        args.output,
        province_paths=province_paths,
        outline_paths=outline_paths,
        south_sea_inset_paths=south_sea_inset_paths,
        ten_dash_paths=ten_dash_paths,
    )
    print(
        f"Wrote {args.output} with "
        f"{len(province_paths)} province paths, "
        f"{len(outline_paths)} outline paths, "
        f"{len(south_sea_inset_paths)} inset paths, "
        f"{len(ten_dash_paths)} ten-dash paths."
    )


if __name__ == "__main__":
    main()
