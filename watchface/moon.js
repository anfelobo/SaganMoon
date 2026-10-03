import * as hmUI from '@zos/ui'
import { getLanguage } from '@zos/settings'
import moonData from './moon_data.js'

const MOON_IMAGE_COUNT = 22

let moonImageWidget = null
let illuminationWidgets = []
let phaseImageWidget = null
let currentMoonRecord = null

function getMoonData(year, month, day) {
  if (!moonData || !moonData.records) {
    return null
  }

  const key =
    year + '-' +
    String(month).padStart(2, '0') + '-' +
    String(day).padStart(2, '0')

  for (let i = 0; i < moonData.records.length; i++) {
    if (moonData.records[i].date === key) {
      return moonData.records[i]
    }
  }

  return null
}

function getFallbackMoonData(year, month, day) {
  const date = new Date(year, month - 1, day)

  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0)

  const days =
    (date.getTime() - knownNewMoon.getTime()) /
    86400000

  const age = ((days % 29.530588853) + 29.530588853) %
    29.530588853

  const illumination =
    (1 - Math.cos((2 * Math.PI * age) / 29.530588853)) / 2

  const phaseAngle =
    (age / 29.530588853) * 360

  return {
    date:
      year + '-' +
      String(month).padStart(2, '0') + '-' +
      String(day).padStart(2, '0'),
    age: age,
    illumination: illumination,
    phase_angle: phaseAngle,
    phase_name: ''
  }
}

function getMoonImageNumber(phaseAngle) {
  let angle = phaseAngle % 360

  if (angle < 0) {
    angle += 360
  }

  return Math.round(
    angle / (360 / MOON_IMAGE_COUNT)
  ) % MOON_IMAGE_COUNT
}

function getMoonImagePath(number) {
  return 'moon/moon_' +
    String(number).padStart(2, '0') +
    '.png'
}

function getPhaseLabel(record) {
  const language = getLanguage()

  const prefix = language === 3
    ? 'ES_'
    : 'EN_'

  let name = record.phase_name || ''

  name = name
    .replace(/\s+/g, '_')
    .replace(/á/g, 'A')
    .replace(/é/g, 'E')
    .replace(/í/g, 'I')
    .replace(/ó/g, 'O')
    .replace(/ú/g, 'U')
    .replace(/ñ/g, 'N')

  return 'phase_labels/' + prefix + name + '.png'
}

function getIlluminationDigits(value) {
  const percent = Math.round(value * 100)

  if (percent >= 100) {
    return ['1', '0', '0']
  }

  if (percent < 10) {
    return ['null', '0', String(percent)]
  }

  const text = String(percent)

  return [
    text.length === 3 ? text[0] : 'null',
    text.length === 3 ? text[1] : text[0],
    text.length === 3 ? text[2] : text[1]
  ]
}

export function createMoon() {
  moonImageWidget = hmUI.createWidget(hmUI.widget.IMG, {
    x: 265,
    y: 120,
    w: 345,
    h: 345,
    src: getMoonImagePath(11)
  })

  illuminationWidgets = []

  illuminationWidgets.push(
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 110,
      y: 355,
      w: 22,
      h: 30,
      src: 'numbers/null.png'
    })
  )

  illuminationWidgets.push(
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 134,
      y: 355,
      w: 22,
      h: 30,
      src: 'numbers/null.png'
    })
  )

  illuminationWidgets.push(
    hmUI.createWidget(hmUI.widget.IMG, {
      x: 158,
      y: 355,
      w: 22,
      h: 30,
      src: 'numbers/null.png'
    })
  )

  phaseImageWidget = hmUI.createWidget(hmUI.widget.IMG, {
    x: 15,
    y: 300,
    w: 180,
    h: 30,
    src: ''
  })
}

export function updateMoon(year, month, day) {
  currentMoonRecord =
    getMoonData(year, month, day) ||
    getFallbackMoonData(year, month, day)

  const imageNumber = getMoonImageNumber(
    currentMoonRecord.phase_angle
  )

  moonImageWidget.setProperty(
    hmUI.prop.SRC,
    getMoonImagePath(imageNumber)
  )

  const illumination =
    currentMoonRecord.illumination || 0

  const digits =
    getIlluminationDigits(illumination)

  for (let i = 0; i < 3; i++) {
    const digit = digits[i]

    illuminationWidgets[i].setProperty(
      hmUI.prop.SRC,
      digit === 'null'
        ? 'numbers/null.png'
        : 'numbers/' + digit + '.png'
    )
  }

  if (currentMoonRecord.phase_name) {
    phaseImageWidget.setProperty(
      hmUI.prop.SRC,
      getPhaseLabel(currentMoonRecord)
    )
  }

  console.log(
    'SaganMoon MOON -> image ' +
    imageNumber +
    ' illumination ' +
    Math.round(illumination * 100) +
    '%'
  )
}

export function getCurrentMoonRecord() {
  return currentMoonRecord
}

export function destroyMoon() {
  moonImageWidget = null
  illuminationWidgets = []
  phaseImageWidget = null
  currentMoonRecord = null
}