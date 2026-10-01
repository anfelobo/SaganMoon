from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'assets' / '432x514-amazfit-bip-max' / 'icons'

GOLD = (212, 175, 55, 255)

SIZE = (72, 56)
SCALE = 4


def new_canvas():
    return Image.new('RGBA', (SIZE[0] * SCALE, SIZE[1] * SCALE), (0, 0, 0, 0))


def save(image, name):
    resized = image.resize(SIZE, Image.Resampling.LANCZOS)
    resized.save(OUTPUT / name)


def draw_sun(draw, cx, cy, r, width):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=GOLD, width=width)

    ray_r1 = r + width * 2
    ray_r2 = r + width * 6

    for angle in range(0, 360, 45):
        import math
        rad = math.radians(angle)
        x1 = cx + ray_r1 * math.cos(rad)
        y1 = cy + ray_r1 * math.sin(rad)
        x2 = cx + ray_r2 * math.cos(rad)
        y2 = cy + ray_r2 * math.sin(rad)
        draw.line((x1, y1, x2, y2), fill=GOLD, width=width)


def draw_cloud(draw, cx, cy, width):
    draw.ellipse((cx - 120, cy - 40, cx + 20, cy + 80), outline=GOLD, width=width)
    draw.ellipse((cx - 40, cy - 90, cx + 110, cy + 30), outline=GOLD, width=width)
    draw.ellipse((cx + 20, cy - 20, cx + 190, cy + 100), outline=GOLD, width=width)
    draw.rectangle((cx - 90, cy + 10, cx + 150, cy + 100), fill=(0, 0, 0, 0), outline=None)
    draw.rounded_rectangle((cx - 90, cy - 10, cx + 150, cy + 90), radius=40, outline=GOLD, width=width)


def draw_drop(draw, x, y, width):
    draw.line((x, y, x - 14, y + 40), fill=GOLD, width=width)


def draw_bolt(draw, cx, cy, width):
    points = [
        (cx + 20, cy - 10),
        (cx - 20, cy + 40),
        (cx + 6, cy + 40),
        (cx - 14, cy + 90),
        (cx + 40, cy + 20),
        (cx + 10, cy + 20)
    ]
    draw.line(points, fill=GOLD, width=width, joint='curve')


def generate_sun():
    image = new_canvas()
    draw = ImageDraw.Draw(image)
    draw_sun(draw, SIZE[0] * SCALE // 2, SIZE[1] * SCALE // 2, 70, 10)
    save(image, 'weather_sun.png')


def generate_cloud():
    image = new_canvas()
    draw = ImageDraw.Draw(image)
    draw_cloud(draw, SIZE[0] * SCALE // 2 - 20, SIZE[1] * SCALE // 2 - 10, 10)
    save(image, 'weather_cloud.png')


def generate_cloud_rain():
    image = new_canvas()
    draw = ImageDraw.Draw(image)
    draw_cloud(draw, SIZE[0] * SCALE // 2 - 20, SIZE[1] * SCALE // 2 - 40, 10)
    draw_drop(draw, SIZE[0] * SCALE // 2 - 30, SIZE[1] * SCALE // 2 + 90, 10)
    draw_drop(draw, SIZE[0] * SCALE // 2 + 40, SIZE[1] * SCALE // 2 + 90, 10)
    draw_drop(draw, SIZE[0] * SCALE // 2 + 110, SIZE[1] * SCALE // 2 + 90, 10)
    save(image, 'weather_cloud_rain.png')


def generate_cloud_lightning():
    image = new_canvas()
    draw = ImageDraw.Draw(image)
    draw_cloud(draw, SIZE[0] * SCALE // 2 - 20, SIZE[1] * SCALE // 2 - 50, 10)
    draw_bolt(draw, SIZE[0] * SCALE // 2 - 30, SIZE[1] * SCALE // 2 + 30, 10)
    save(image, 'weather_cloud_lightning.png')


def generate_assets():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    generate_sun()
    generate_cloud()
    generate_cloud_rain()
    generate_cloud_lightning()


if __name__ == '__main__':
    generate_assets()
