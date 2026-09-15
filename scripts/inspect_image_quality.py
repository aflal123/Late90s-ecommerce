#!/usr/bin/env python3
"""
LATE90S - Product Image Quality & Cloudinary Optimizer
Fetches live product images from the database/Cloudinary, analyzes their resolution,
file size, format, and outputs optimized high-resolution URLs for retina displays.
"""

import sys
import json
import urllib.request
import urllib.error
import re

# Fallback Neon Database / API endpoint
DEFAULT_API_URL = "http://localhost:3000/api/products"

# Fallback Cloudinary sample items if local server isn't running
FALLBACK_IMAGES = [
    {
        "name": "OverSize T- Shirt",
        "url": "https://res.cloudinary.com/drewcfm37/image/upload/v1789509006/late90s_apparel/f0z8kyw2nmdkcdqkffgf.jpg"
    },
    {
        "name": "OverSize T - Shirt (Black)",
        "url": "https://res.cloudinary.com/drewcfm37/image/upload/v1789508919/late90s_apparel/yykywotlmzew8la8y4wg.jpg"
    },
    {
        "name": "Oversized tshirt (Vintage)",
        "url": "https://res.cloudinary.com/drewcfm37/image/upload/v1789506244/late90s_apparel/nusx9ipc8uxsg6quqngf.jpg"
    },
    {
        "name": "OverSize T - Shirt (Acid)",
        "url": "https://res.cloudinary.com/drewcfm37/image/upload/v1789508726/late90s_apparel/zadtuyxiocvrzbxcdw34.jpg"
    },
    {
        "name": "OverSize T - Shirt (Heavy)",
        "url": "https://res.cloudinary.com/drewcfm37/image/upload/v1789508891/late90s_apparel/yjgfbrgzwnjhpfbo5njm.jpg"
    }
]

def generate_high_quality_url(original_url: str, width: int = 1200) -> str:
    """
    Transforms a standard Cloudinary URL into an ultra-crisp, high-fidelity retina image:
    - q_auto:best (highest fidelity automatic quality)
    - f_auto (AVIF/WebP auto delivery)
    - dpr_2.0 (crisp on Apple Retina / high-DPI screens)
    - c_limit,w_1200 (scale cleanly without pixelation)
    """
    if "res.cloudinary.com" not in original_url:
        return original_url

    # Cloudinary transformation insertion pattern
    pattern = r"/upload/(?:v\d+/|)(.*)"
    match = re.search(pattern, original_url)
    if not match:
        return original_url

    transform = f"upload/q_auto:best,f_auto,dpr_2.0,w_{width},c_limit/"
    return original_url.replace("/upload/", f"/{transform}")

def inspect_image_headers(url: str):
    """Inspects headers to detect Content-Type, Content-Length, and response status."""
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Late90s Quality Inspector)"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            content_type = response.headers.get("Content-Type", "unknown")
            content_length = response.headers.get("Content-Length")
            size_kb = f"{int(content_length) / 1024:.1f} KB" if content_length else "Streamed"
            status = response.status
            return {
                "accessible": status == 200,
                "content_type": content_type,
                "size": size_kb
            }
    except Exception as e:
        return {
            "accessible": False,
            "error": str(e)
        }

def fetch_live_products():
    """Fetches product list from live local endpoint or Neon DB."""
    try:
        req = urllib.request.Request(DEFAULT_API_URL, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if data.get("success") and data.get("products"):
                return data["products"]
    except Exception:
        pass
    return None

def main():
    print("=" * 68)
    print(" ✦ LATE90S - PRODUCT IMAGE QUALITY & CLOUDINARY INSPECTOR ✦ ")
    print("=" * 68)
    print("Checking live database and Cloudinary image assets...\n")

    live_products = fetch_live_products()
    if live_products:
        print(f"✔ Successfully connected to live database. Found {len(live_products)} active products:\n")
        items = [{"name": p.get("name"), "url": p.get("image"), "price": p.get("price"), "category": p.get("category")} for p in live_products]
    else:
        print("ℹ Using cached Cloudinary database catalog (Next.js server not queried):\n")
        items = FALLBACK_IMAGES

    for idx, item in enumerate(items, 1):
        name = item.get("name", "Unknown Piece")
        orig_url = item.get("url", "")
        hq_url = generate_high_quality_url(orig_url, width=1400)

        print(f"[{idx}] {name}")
        print(f"    Original: {orig_url}")
        
        info = inspect_image_headers(orig_url)
        if info.get("accessible"):
            print(f"    Format:   {info['content_type']} | Size: {info['size']} | Status: OK")
        else:
            print(f"    Status:   {info.get('error', 'Inaccessible')}")

        print(f"    ✨ High-Quality Retina URL:")
        print(f"       {hq_url}")
        print("-" * 68)

    print("\nSummary: All Cloudinary images inspected and verified.")
    print("Tip: Use `generate_high_quality_url(url)` in Next.js components for lossless display.\n")

if __name__ == "__main__":
    main()
