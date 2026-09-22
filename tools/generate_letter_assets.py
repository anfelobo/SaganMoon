from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'assets' / '432x514-amazfit-bip-max' / 'letters'
SOURCE = ROOT / 'assets' / '432x514-amazfit-bip-max' / 'digits' / 'clock' / '8.png'

SEGMENTS = {
    'a': (8, 0, 58, 15),
    'b': (52, 8, 68, 48),
    'c': (52, 44, 68, 92),
    'd': (8, 78, 58, 92),
    'e': (0, 44, 16, 92),
    'f': (0, 8, 16, 48),
    'g': (8, 39, 58, 54),
}

LETTER_SEGMENTS = {
    'A': 'abcefg',
    'B': 'cdefg',
    'C': 'adef',
    'D': 'bcdeg',
    'E': 'adefg',
    'F': 'aefg',
    'G': 'acdef',
    'H': 'bcefg',
    'I': 'bc',
    'J': 'bcde',
    'K': 'efg',
    'L': 'def',
    'M': 'abcef',
    'N': 'bceg',
    'O': 'abcdef',
    'P': 'abefg',
    'Q': 'abcfg',
    'R': 'abefg',
    'S': 'acdfg',
    'T': 'defg',
    'U': 'bcdef',
    'V': 'cde',
    'W': 'bcdef',
    'X': 'bcefg',
    'Y': 'bcdfg',
    'Z': 'abdeg',
}


def create_assets():
    source = Image.open(SOURCE).convert('RGBA')
    segment_images = {
        name: source.crop(box)
        for name, box in SEGMENTS.items()
    }
    OUTPUT.mkdir(parents=True, exist_ok=True)

    for letter, segments in LETTER_SEGMENTS.items():
        image = Image.new('RGBA', source.size, (0, 0, 0, 0))

        for segment in segments:
            box = SEGMENTS[segment]
            image.alpha_composite(segment_images[segment], (box[0], box[1]))

        image.save(OUTPUT / (letter + '.png'))


if __name__ == '__main__':
    create_assets()