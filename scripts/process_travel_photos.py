#!/usr/bin/env python3
"""Create web-ready travel images without modifying the source photos."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("public/travel"),
    )
    args = parser.parse_args()

    photos = sorted(args.source.glob("*.jpg"))
    if len(photos) != 12:
        raise SystemExit(f"Expected 12 JPG photos, found {len(photos)} in {args.source}")

    args.output.mkdir(parents=True, exist_ok=True)

    for index, source in enumerate(photos, start=1):
        destination = args.output / f"travel-{index:02d}.webp"
        with Image.open(source) as raw:
            image = ImageOps.exif_transpose(raw).convert("RGB")
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            image.save(destination, "WEBP", quality=82, method=6)
        print(f"{source.name} -> {destination}")


if __name__ == "__main__":
    main()
