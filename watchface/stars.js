import * as hmUI from '@zos/ui'

const WHITE = 0xFFFFFF

const starDefinitions = [
  { x: 24, y: 48, r: 2, alpha: 175 },
  { x: 88, y: 31, r: 1, alpha: 130 },
  { x: 151, y: 65, r: 2, alpha: 205 },
  { x: 224, y: 27, r: 1, alpha: 150 },
  { x: 382, y: 40, r: 2, alpha: 190 },
  { x: 52, y: 122, r: 1, alpha: 145 },
  { x: 137, y: 105, r: 2, alpha: 180 },
  { x: 205, y: 150, r: 1, alpha: 135 },
  { x: 365, y: 105, r: 1, alpha: 155 },
  { x: 410, y: 168, r: 2, alpha: 180 },
  { x: 20, y: 215, r: 1, alpha: 160 },
  { x: 172, y: 235, r: 2, alpha: 145 },
  { x: 405, y: 265, r: 1, alpha: 175 },
  { x: 46, y: 350, r: 2, alpha: 185 },
  { x: 185, y: 375, r: 1, alpha: 140 },
  { x: 292, y: 350, r: 2, alpha: 175 },
  { x: 392, y: 390, r: 1, alpha: 155 },
  { x: 30, y: 438, r: 1, alpha: 150 },
  { x: 218, y: 425, r: 2, alpha: 170 },
  { x: 370, y: 445, r: 1, alpha: 140 }
]

export function createStars() {
  const stars = []

  for (let i = 0; i < starDefinitions.length; i++) {
    const star = starDefinitions[i]

    const widget = hmUI.createWidget(
      hmUI.widget.CIRCLE,
      {
        center_x: star.x,
        center_y: star.y,
        radius: star.r,
        color: WHITE,
        alpha: star.alpha
      }
    )

    stars.push({
      widget: widget,
      baseAlpha: star.alpha
    })
  }

  return stars
}

export function updateStars(stars) {
  for (let i = 0; i < stars.length; i++) {
    if (Math.random() >= 0.35) {
      continue
    }

    const random = Math.random()
    let alpha

    if (random < 0.20) {
      alpha = 0
    } else if (random < 0.55) {
      alpha = Math.floor(
        stars[i].baseAlpha * 0.30
      )
    } else if (random < 0.80) {
      alpha = stars[i].baseAlpha
    } else {
      alpha = 255
    }

    stars[i].widget.setProperty(
      hmUI.prop.ALPHA,
      alpha
    )
  }
}