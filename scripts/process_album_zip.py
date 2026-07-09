#!/usr/bin/env python3
"""Build static, web-ready travel album assets from a private zip archive."""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path, PurePosixPath
from typing import Any
from zipfile import ZipFile, ZipInfo

from PIL import Image, ImageOps


IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".bmp"}
DERIVATIVES = {
    "thumb": (480, 78),
    "preview": (960, 82),
    "large": (1800, 84),
}


DESTINATION_META: dict[str, dict[str, Any]] = {
    "codex，云南": {
        "id": "yunnan",
        "nameZh": "云南",
        "nameEn": "Yunnan",
        "descriptionZh": "雪山、湖泊、古城和高原风，把一次远行折成明亮的纸页。",
        "placePrefix": "云南",
        "mapLabel": {"x": 37, "y": 77},
        "accent": "#0b6ffb",
        "mood": "开阔 / 清醒",
        "note": "山风和云影把远方拉近，也把出发的理由变得具体。",
    },
    "codex 香港": {
        "id": "hongkong",
        "nameZh": "香港",
        "nameEn": "Hong Kong",
        "descriptionZh": "海港、街道、夜色和同行者，把城市旅行压缩成明亮的胶片。",
        "placePrefix": "香港",
        "mapLabel": {"x": 55, "y": 77},
        "accent": "#0f7cff",
        "mood": "明亮 / 兴奋",
        "note": "灯光从海湾一路铺开，像一张可以被点亮的地图。",
    },
    "日本": {
        "id": "japan",
        "nameZh": "日本",
        "nameEn": "Japan",
        "descriptionZh": "寺庙、街景、海岸和独自规划的路线，记录一次真正意义上的远行。",
        "placePrefix": "日本",
        "mapLabel": {"x": 79, "y": 57},
        "accent": "#d4485a",
        "mood": "独立 / 好奇",
        "note": "把路线、预算和突发状况都交给自己，旅行也变成一次训练。",
    },
    "济州岛旅游": {
        "id": "jeju",
        "nameZh": "济州岛",
        "nameEn": "Jeju Island",
        "descriptionZh": "海岸、礁石和窗边光线，是另一种更松弛的岛屿记忆。",
        "placePrefix": "济州岛",
        "mapLabel": {"x": 70, "y": 49},
        "accent": "#00a7c7",
        "mood": "松弛 / 开阔",
        "note": "站在海边岩石上，才更容易意识到自己正在出发。",
    },
    "武汉游记": {
        "id": "wuhan",
        "nameZh": "武汉",
        "nameEn": "Wuhan",
        "descriptionZh": "江城的桥、湖和街巷，把城市记忆展开成连续的日常切片。",
        "placePrefix": "武汉",
        "mapLabel": {"x": 54, "y": 59},
        "accent": "#2478ff",
        "mood": "流动 / 真实",
        "note": "城市不是一个点，而是很多个被走过的瞬间。",
    },
    "日照": {
        "id": "rizhao",
        "nameZh": "日照",
        "nameEn": "Rizhao",
        "descriptionZh": "海岸线、阳光和风，把短途旅行留下清爽的蓝色边缘。",
        "placePrefix": "日照",
        "mapLabel": {"x": 64, "y": 48},
        "accent": "#138de8",
        "mood": "清爽 / 轻盈",
        "note": "海边的风会把许多复杂的念头暂时吹散。",
    },
    "黄山": {
        "id": "huangshan",
        "nameZh": "黄山",
        "nameEn": "Huangshan",
        "descriptionZh": "山脊、云雾和石阶，让风景像一页页被翻开的山水画。",
        "placePrefix": "黄山",
        "mapLabel": {"x": 62, "y": 64},
        "accent": "#376fec",
        "mood": "沉静 / 震撼",
        "note": "上山的过程会拉长时间，也会放大抵达时的光。",
    },
    "宁波": {
        "id": "ningbo",
        "nameZh": "宁波",
        "nameEn": "Ningbo",
        "descriptionZh": "港口城市的街道、海风和建筑，构成更克制的东海记忆。",
        "placePrefix": "宁波",
        "mapLabel": {"x": 69, "y": 59},
        "accent": "#0a8fd7",
        "mood": "安静 / 整洁",
        "note": "有些旅程并不宏大，却很适合保存成清晰的片段。",
    },
    "武功山": {
        "id": "wugongshan",
        "nameZh": "武功山",
        "nameEn": "Wugong Mountain",
        "descriptionZh": "草甸、山路和云层，记录重装徒步里对体力和意志的校准。",
        "placePrefix": "武功山",
        "mapLabel": {"x": 49, "y": 72},
        "accent": "#1c8f74",
        "mood": "坚持 / 开阔",
        "note": "长坡会把想法过滤一遍，只留下继续向前的节奏。",
    },
    "codex 老君山": {
        "id": "laojunshan",
        "nameZh": "老君山",
        "nameEn": "Laojun Mountain",
        "descriptionZh": "山顶建筑、冬季雪线和云海，让近处的山也有辽阔感。",
        "placePrefix": "老君山",
        "mapLabel": {"x": 45, "y": 52},
        "accent": "#6d6ee8",
        "mood": "冷冽 / 明亮",
        "note": "冬天的山有一种很直接的秩序感。",
    },
    "库拉岗日": {
        "id": "kulagangri",
        "nameZh": "库拉岗日",
        "nameEn": "Kulagangri",
        "descriptionZh": "雪山、徒步和高海拔，是第一次真正被远方击中的地方。",
        "placePrefix": "库拉岗日",
        "mapLabel": {"x": 27, "y": 66},
        "accent": "#0b6ffb",
        "mood": "震撼 / 自由",
        "note": "站在雪山脚下时，很多关于人生半径的想象被重新打开。",
    },
    "长白山": {
        "id": "changbaishan",
        "nameZh": "长白山",
        "nameEn": "Changbai Mountain",
        "descriptionZh": "北方山地的冷光和天池意象，像地图尽头的一枚蓝色标记。",
        "placePrefix": "长白山",
        "mapLabel": {"x": 72, "y": 32},
        "accent": "#4f8cff",
        "mood": "冷静 / 辽阔",
        "note": "越靠北，光线越像被雪重新擦亮。",
    },
}


@dataclass(frozen=True)
class AlbumEntry:
    info: ZipInfo
    decoded_name: str
    album_folder: str
    destination_folder: str
    filename: str


def decode_zip_name(info: ZipInfo) -> str:
    if info.flag_bits & 0x800:
        return info.filename

    raw_name = info.filename.encode("cp437", errors="replace")
    for encoding in ("gb18030", "utf-8", "cp437"):
        try:
            return raw_name.decode(encoding)
        except UnicodeDecodeError:
            continue
    return info.filename


def slugify(value: str) -> str:
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = value.strip("-")
    return value or "photo"


def parse_capture_date(name: str, exif: Any | None) -> str:
    date_value = None
    if exif:
        for tag in (36867, 306):
            if tag in exif:
                date_value = exif.get(tag)
                break

    if isinstance(date_value, bytes):
        date_value = date_value.decode("utf-8", errors="ignore")
    if isinstance(date_value, str):
        for fmt in ("%Y:%m:%d %H:%M:%S", "%Y-%m-%d %H:%M:%S"):
            try:
                return datetime.strptime(date_value, fmt).strftime("%Y.%m.%d")
            except ValueError:
                pass

    match = re.search(r"(20\d{2})(\d{2})(\d{2})", name)
    if match:
        return ".".join(match.groups())
    return "待标注"


def normalize_image(raw: Image.Image) -> Image.Image:
    image = ImageOps.exif_transpose(raw)
    if image.mode in ("RGBA", "LA"):
        background = Image.new("RGB", image.size, (255, 255, 255))
        background.paste(image, mask=image.getchannel("A"))
        return background
    return image.convert("RGB")


def save_derivative(image: Image.Image, destination: Path, max_size: int, quality: int) -> tuple[int, int]:
    output = image.copy()
    output.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    destination.parent.mkdir(parents=True, exist_ok=True)
    output.save(destination, "WEBP", quality=quality, method=6)
    return output.size


def collect_entries(zip_file: ZipFile) -> list[AlbumEntry]:
    entries: list[AlbumEntry] = []
    for info in zip_file.infolist():
        if info.is_dir():
            continue
        decoded = decode_zip_name(info).replace("\\", "/")
        path = PurePosixPath(decoded)
        if path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        parts = path.parts
        if len(parts) >= 3:
            album_folder, destination_folder = parts[0], parts[1]
        elif len(parts) == 2:
            album_folder, destination_folder = "相册", parts[0]
        else:
            album_folder, destination_folder = "相册", "待标注"
        entries.append(
            AlbumEntry(
                info=info,
                decoded_name=decoded,
                album_folder=album_folder,
                destination_folder=destination_folder,
                filename=path.name,
            )
        )
    return sorted(entries, key=lambda item: (item.destination_folder, item.decoded_name.lower()))


def build_destination_meta(folder_name: str) -> dict[str, Any]:
    if folder_name in DESTINATION_META:
        return dict(DESTINATION_META[folder_name])

    destination_id = slugify(folder_name)
    return {
        "id": destination_id,
        "nameZh": folder_name,
        "nameEn": destination_id.replace("-", " ").title(),
        "descriptionZh": "这组照片暂时按原始文件夹整理，后续可以继续补充地点、时间和故事。",
        "placePrefix": folder_name,
        "mapLabel": {"x": 48, "y": 58},
        "accent": "#0b6ffb",
        "mood": "待标注",
        "note": "先保存真实照片，再慢慢补齐这段旅程的文字。",
    }


def process_album(args: argparse.Namespace) -> dict[str, Any]:
    output_root = args.output / "generated"
    grouped: dict[str, list[AlbumEntry]] = defaultdict(list)

    with ZipFile(args.zip_path) as zip_file:
        bad_member = zip_file.testzip()
        if bad_member:
            raise SystemExit(f"Zip integrity check failed at {bad_member}")

        entries = collect_entries(zip_file)
        for entry in entries:
            grouped[entry.destination_folder].append(entry)

        destinations: list[dict[str, Any]] = []
        for folder_name, folder_entries in grouped.items():
            meta = build_destination_meta(folder_name)
            destination_id = meta["id"]
            photos: list[dict[str, Any]] = []

            for photo_index, entry in enumerate(folder_entries, start=1):
                photo_slug = f"{destination_id}-{photo_index:03d}"
                with zip_file.open(entry.info) as photo_file:
                    with Image.open(BytesIO(photo_file.read())) as raw:
                        exif = raw.getexif()
                        image = normalize_image(raw)
                        original_width, original_height = image.size
                        sizes: dict[str, dict[str, Any]] = {}
                        for size_name, (max_size, quality) in DERIVATIVES.items():
                            relative = Path("generated") / destination_id / size_name / f"{photo_slug}.webp"
                            width, height = save_derivative(
                                image,
                                args.output / relative,
                                max_size,
                                quality,
                            )
                            sizes[size_name] = {
                                "path": relative.as_posix(),
                                "width": width,
                                "height": height,
                            }

                capture_time = parse_capture_date(entry.filename, exif)
                photos.append(
                    {
                        "id": photo_slug,
                        "file": sizes["preview"]["path"],
                        "thumb": sizes["thumb"]["path"],
                        "preview": sizes["preview"]["path"],
                        "large": sizes["large"]["path"],
                        "width": original_width,
                        "height": original_height,
                        "titleZh": f"{meta['nameZh']}片段 {photo_index:02d}",
                        "titleEn": f"{meta['nameEn']} Frame {photo_index:02d}",
                        "meta": meta["placePrefix"],
                        "place": meta["placePrefix"],
                        "time": capture_time,
                        "mood": meta["mood"],
                        "note": meta["note"],
                        "sourceFolder": entry.destination_folder,
                        "sourceName": entry.decoded_name,
                        "featured": photo_index <= args.featured_count,
                    }
                )

            destinations.append(
                {
                    "id": destination_id,
                    "nameZh": meta["nameZh"],
                    "nameEn": meta["nameEn"],
                    "status": "已整理",
                    "descriptionZh": meta["descriptionZh"],
                    "stats": {
                        "places": 1,
                        "photos": len(photos),
                        "videos": 0,
                    },
                    "mapLabel": meta["mapLabel"],
                    "cover": photos[0]["preview"] if photos else "",
                    "accent": meta["accent"],
                    "photos": photos,
                    "sourceFolder": folder_name,
                }
            )

    destinations.sort(key=lambda item: (-item["stats"]["photos"], item["nameZh"]))
    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sourceZip": str(args.zip_path),
        "totals": {
            "destinations": len(destinations),
            "photos": sum(item["stats"]["photos"] for item in destinations),
            "videos": 0,
        },
        "destinations": destinations,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("zip_path", type=Path)
    parser.add_argument("--output", type=Path, default=Path("public/travel"))
    parser.add_argument("--manifest", type=Path, default=Path("src/generated/travelManifest.json"))
    parser.add_argument("--featured-count", type=int, default=8)
    args = parser.parse_args()

    if not args.zip_path.exists():
        raise SystemExit(f"Zip not found: {args.zip_path}")

    manifest = process_album(args)
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Generated {manifest['totals']['photos']} photos across "
        f"{manifest['totals']['destinations']} destinations."
    )
    print(f"Manifest: {args.manifest}")


if __name__ == "__main__":
    main()
