from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'assets' / '432x514-amazfit-bip-max'
OUTPUT = ASSETS / 'phase_letters'
LABEL_OUTPUT = ASSETS / 'phase_labels'

SOURCE_FILES = {
    **{str(index): ASSETS / 'numbers' / f'{index}.png' for index in range(10)},
    **{
        letter: ASSETS / 'letters' / f'{letter}.png'
        for letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    'SLASH': ASSETS / 'letters' / 'SLASH.png',
    'PERCENT': ASSETS / 'letters' / 'PERCENT.png',
    'PLUS': ASSETS / 'letters' / 'PLUS.png',
    'MINUS': ASSETS / 'letters' / 'MINUS.png',
}

PHASE_LABELS = {
    'ES_NEW_MOON': 'NUEVA',
    'ES_WAXING_CRESCENT': 'CRECIENTE',
    'ES_FIRST_QUARTER': '1/4 CRECIENTE',
    'ES_WAXING_GIBBOUS': 'GIBOSA +',
    'ES_FULL_MOON': 'LUNA LLENA',
    'ES_WANING_GIBBOUS': 'GIBOSA -',
    'ES_LAST_QUARTER': '1/4 MENGUANTE',
    'ES_WANING_CRESCENT': 'MENGUANTE',
    'EN_NEW_MOON': 'NEW',
    'EN_WAXING_CRESCENT': 'CRESCENT',
    'EN_FIRST_QUARTER': '1/4 WAXING',
    'EN_WAXING_GIBBOUS': 'GIBBOUS +',
    'EN_FULL_MOON': 'FULL MOON',
    'EN_WANING_GIBBOUS': 'GIBBOUS -',
    'EN_LAST_QUARTER': '1/4 WANING',
    'EN_WANING_CRESCENT': 'WANING',
}

SYMBOL_FILES = {
    '/': 'SLASH',
    '%': 'PERCENT',
    '+': 'PLUS',
    '-': 'MINUS',
}


def source_for_character(character):
    name = SYMBOL_FILES.get(character, character)
    return ASSETS / 'numbers' / f'{name}.png' \
        if character.isdigit() else ASSETS / 'letters' / f'{name}.png'


def create_phase_label(text, output_path):
    characters = list(text)
    source_images = [
        Image.open(source_for_character(character)).convert('RGBA')
        for character in characters
        if character != ' '
    ]
    spacing = 1
    natural_width = sum(image.width for image in source_images)
    natural_width += spacing * max(0, len(source_images) - 1)
    scale = min(1, 205 / natural_width)
    images = [
        image.resize((round(image.width * scale), round(image.height * scale)), Image.Resampling.LANCZOS)
        for image in source_images
    ]
    width = sum(image.width for image in images)
    width += round(spacing * scale) * max(0, len(images) - 1)
    canvas = Image.new('RGBA', (205, 30), (0, 0, 0, 0))
    x = (canvas.width - width) // 2

    for image in images:
        y = (canvas.height - image.height) // 2
        canvas.alpha_composite(image, (x, y))
        x += image.width + round(spacing * scale)

    canvas.save(output_path)


def generate_assets():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    LABEL_OUTPUT.mkdir(parents=True, exist_ok=True)

    for name, source_path in SOURCE_FILES.items():
        image = Image.open(source_path).convert('RGBA')
        resized = image.resize((13, 18), Image.Resampling.LANCZOS)
        resized.save(OUTPUT / f'{name}.png')

    for name, text in PHASE_LABELS.items():
        create_phase_label(text, LABEL_OUTPUT / f'{name}.png')


if __name__ == '__main__':
    generate_assets()