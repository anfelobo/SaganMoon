
// ============================================================
// SAGANMOON - Amazfit Bip Max
// Versión 1.7
// ============================================================

import * as hmUI from '@zos/ui'
import { getLanguage } from '@zos/settings'

import {
  createClock,
  startClock,
  stopClock,
  getCurrentDateInfo
} from './clock.js'

import moonData from './moon_data.js'

// ============================================================
// CONFIGURACIÓN
// ============================================================

const SCREEN_WIDTH = 432
const SCREEN_HEIGHT = 514
const MOON_IMAGE_COUNT = 22

const BLACK = 0x000000
const WHITE = 0xFFFFFF
const GOLD = 0xD4AF37
const DARK_GOLD = 0x704F08
const NEON_CYAN = 0x00E5FF
const DARK_CYAN = 0x005A6E

// ============================================================
// ESTRELLAS
// ============================================================

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

// ============================================================
// UTILIDADES
// ============================================================

function twoDigits(value) {
  if (value < 10) {
    return '0' + value
  }

  return '' + value
}

// ============================================================
// DATOS LUNARES
// ============================================================

function getMoonData(year, month, day) {
  const calendarDate =
    year +
    '-' +
    twoDigits(month) +
    '-' +
    twoDigits(day)

  for (
    let i = 0;
    i < moonData.records.length;
    i++
  ) {
    const record =
      moonData.records[i]

    if (
      record.calendar_date ===
      calendarDate
    ) {
      return record
    }
  }

  return null
}

function getFallbackMoonData(year, month, day) {
  const targetDate =
    new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0
    )

  const epochDate =
    new Date(
      2000,
      0,
      6,
      18,
      14,
      0
    )

  const millisecondsPerDay =
    24 *
    60 *
    60 *
    1000

  const synodicPeriod =
    29.530588853

  const daysSinceEpoch =
    (
      targetDate.getTime() -
      epochDate.getTime()
    ) /
    millisecondsPerDay

  let lunarAge =
    daysSinceEpoch %
    synodicPeriod

  if (lunarAge < 0) {
    lunarAge +=
      synodicPeriod
  }

  const phaseAngle =
    (
      lunarAge /
      synodicPeriod
    ) *
    360

  const illumination =
    (
      1 -
      Math.cos(
        phaseAngle *
        Math.PI /
        180
      )
    ) / 2

  let phaseName

  if (phaseAngle < 22.5) {
    phaseName = 'New Moon'
  } else if (phaseAngle < 67.5) {
    phaseName = 'Waxing Crescent'
  } else if (phaseAngle < 112.5) {
    phaseName = 'First Quarter'
  } else if (phaseAngle < 157.5) {
    phaseName = 'Waxing Gibbous'
  } else if (phaseAngle < 202.5) {
    phaseName = 'Full Moon'
  } else if (phaseAngle < 247.5) {
    phaseName = 'Waning Gibbous'
  } else if (phaseAngle < 292.5) {
    phaseName = 'Last Quarter'
  } else if (phaseAngle < 337.5) {
    phaseName = 'Waning Crescent'
  } else {
    phaseName = 'New Moon'
  }

  return {
    calendar_date:
      year +
      '-' +
      twoDigits(month) +
      '-' +
      twoDigits(day),

    phase: {
      illumination:
        illumination,

      name:
        phaseName,

      phase_angle_deg:
        phaseAngle,

      is_waxing:
        phaseAngle < 180
    }
  }
}

// ============================================================
// SELECCIÓN DE IMAGEN LUNAR
// ============================================================

function getMoonImageNumber(phaseAngle) {
  let angle =
    phaseAngle % 360

  if (angle < 0) {
    angle += 360
  }

  return Math.round(
    angle /
    (360 / MOON_IMAGE_COUNT)
  ) % MOON_IMAGE_COUNT
}

function getMoonImagePath(imageNumber) {
  return (
    'moon/moon_' +
    twoDigits(imageNumber) +
    '.png'
  )
}

// ============================================================
// NOMBRE DE FASE
// ============================================================

function getPhaseAssetName(phaseName) {
  const phaseNames = {
    'New Moon':
      'NEW_MOON',

    'Waxing Crescent':
      'WAXING_CRESCENT',

    'First Quarter':
      'FIRST_QUARTER',

    'Waxing Gibbous':
      'WAXING_GIBBOUS',

    'Full Moon':
      'FULL_MOON',

    'Waning Gibbous':
      'WANING_GIBBOUS',

    'Last Quarter':
      'LAST_QUARTER',

    'Waning Crescent':
      'WANING_CRESCENT'
  }

  return (
    phaseNames[phaseName] ||
    'NEW_MOON'
  )
}

// ============================================================
// IDIOMA
// ============================================================

function isSpanish() {
  return getLanguage() === 3
}

// ============================================================
// DÍA DE LA SEMANA
// ============================================================

function getWeekDayName(dayIndex) {
  const english = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT'
  ]

  const spanish = [
    'DOM',
    'LUN',
    'MAR',
    'MIÉ',
    'JUE',
    'VIE',
    'SÁB'
  ]

  if (isSpanish()) {
    return spanish[dayIndex]
  }

  return english[dayIndex]
}

// ============================================================
// TEXTO GRUESO
// ============================================================

function createBoldText(options) {
  const {
    x,
    y,
    w,
    h,
    text,
    textSize,
    color,
    align
  } = options

  hmUI.createWidget(
    hmUI.widget.TEXT,
    {
      x: x - 1,
      y: y,
      w: w,
      h: h,
      text: text,
      text_size: textSize,
      color: color,
      align_h: align,
      align_v:
        hmUI.align.CENTER_V
    }
  )

  hmUI.createWidget(
    hmUI.widget.TEXT,
    {
      x: x + 1,
      y: y,
      w: w,
      h: h,
      text: text,
      text_size: textSize,
      color: color,
      align_h: align,
      align_v:
        hmUI.align.CENTER_V
    }
  )

  hmUI.createWidget(
    hmUI.widget.TEXT,
    {
      x: x,
      y: y - 1,
      w: w,
      h: h,
      text: text,
      text_size: textSize,
      color: color,
      align_h: align,
      align_v:
        hmUI.align.CENTER_V
    }
  )

  return hmUI.createWidget(
    hmUI.widget.TEXT,
    {
      x: x,
      y: y,
      w: w,
      h: h,
      text: text,
      text_size: textSize,
      color: color,
      align_h: align,
      align_v:
        hmUI.align.CENTER_V
    }
  )
}

// ============================================================
// SENSOR
// ============================================================

const SENSOR_NUMBER_IMAGES = [
  'numbers/0.png',
  'numbers/1.png',
  'numbers/2.png',
  'numbers/3.png',
  'numbers/4.png',
  'numbers/5.png',
  'numbers/6.png',
  'numbers/7.png',
  'numbers/8.png',
  'numbers/9.png'
]

const SENSOR_LIMITS = {
  heart: 999,
  steps: 99999,
  battery: 100
}

function createSensorText(options) {
  return hmUI.createWidget(
    hmUI.widget.TEXT_IMG,
    {
      x: options.x,
      y: options.y,
      w: options.w,
      h: options.h,
      type: options.type,
      font_array:
        SENSOR_NUMBER_IMAGES,
      h_space: 0,
      align_h:
        hmUI.align.CENTER_H,
      invalid_image:
        'numbers/null.png',
      max_value:
        options.maxValue
    }
  )
}

function createSensorIcon(options) {
  return hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x: options.x,
      y: options.y,
      w: 36,
      h: 28,
      src:
        'icons/' +
        options.name +
        '.png'
    }
  )
}

// ============================================================
// TEXTO DE IMÁGENES
// ============================================================

function normalizeImageText(text) {
  return text
    .replace(/[ÁÀÂÄ]/g, 'A')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/[ÓÒÔÖ]/g, 'O')
    .replace(/[ÚÙÛÜ]/g, 'U')
}

function getLetterAssetName(character) {
  const symbolNames = {
    '/': 'SLASH',
    '%': 'PERCENT',
    '+': 'PLUS',
    '-': 'MINUS'
  }

  return (
    symbolNames[character] ||
    character
  )
}

function getTextAssetPath(character) {
  return (
    /[0-9]/.test(character) ||
    character === '/'
  )
    ? 'numbers/'
    : 'letters/'
}

function createDigitalDigit(options) {
  return hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x: options.x,
      y: options.y,
      w: options.w,
      h: options.h,
      src:
        options.path +
        '/' +
        options.digit +
        '.png'
    }
  )
}

function createLetterText(options) {
  const text =
    normalizeImageText(
      options.text
    ).toUpperCase()

  const assetFolder =
    options.assetFolder

  const characters =
    text.split('')

  const letterCount =
    characters.filter(
      character =>
        character !== ' '
    ).length

  const spaceCount =
    characters.length -
    letterCount

  const spacing =
    options.spacing

  const spaceWidth =
    options.spaceWidth

  const availableWidth =
    options.w -
    (
      spaceCount *
      spaceWidth
    ) -
    (
      (
        characters.length - 1
      ) *
      spacing
    )

  const letterWidth =
    Math.min(
      options.maxLetterWidth,
      Math.floor(
        availableWidth /
        letterCount
      )
    )

  const letterHeight =
    Math.floor(
      letterWidth *
      30 /
      22
    )

  let textWidth = 0

  for (
    let i = 0;
    i < characters.length;
    i++
  ) {
    textWidth +=
      characters[i] === ' '
        ? spaceWidth
        : letterWidth

    if (
      i <
      characters.length - 1
    ) {
      textWidth +=
        spacing
    }
  }

  let x =
    options.x

  const y =
    options.y +
    Math.floor(
      (
        options.h -
        letterHeight
      ) / 2
    )

  if (
    options.align ===
    hmUI.align.CENTER_H
  ) {
    x +=
      (
        options.w -
        textWidth
      ) / 2
  }

  const widgets = []

  for (
    let i = 0;
    i < characters.length;
    i++
  ) {
    const character =
      characters[i]

    if (
      character !== ' '
    ) {
      const widget =
        hmUI.createWidget(
          hmUI.widget.IMG,
          {
            x: x,
            y: y,
            w: letterWidth,
            h: letterHeight,
            src:
              (
                assetFolder
                  ? assetFolder + '/'
                  : getTextAssetPath(
                      character
                    )
              ) +
              getLetterAssetName(
                character
              ) +
              '.png'
          }
        )

      widgets.push(
        widget
      )
    }

    x +=
      character === ' '
        ? spaceWidth
        : letterWidth

    if (
      i <
      characters.length - 1
    ) {
      x +=
        spacing
    }
  }

  return widgets
}

// ============================================================
// ESTRELLAS
// ============================================================

function createStars() {
  const stars = []

  for (
    let i = 0;
    i < starDefinitions.length;
    i++
  ) {
    const star =
      starDefinitions[i]

    const widget =
      hmUI.createWidget(
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

function updateStars(stars) {
  for (
    let i = 0;
    i < stars.length;
    i++
  ) {
    if (
      Math.random() >= 0.35
    ) {
      continue
    }

    const random =
      Math.random()

    let alpha

    if (random < 0.20) {
      alpha = 0
    } else if (random < 0.55) {
      alpha =
        Math.floor(
          stars[i].baseAlpha *
          0.30
        )
    } else if (random < 0.80) {
      alpha =
        stars[i].baseAlpha
    } else {
      alpha = 255
    }

    stars[i].widget.setProperty(
      hmUI.prop.ALPHA,
      alpha
    )
  }
}

// ============================================================
// CLIMA
// ============================================================

const WEATHER_ICON_NAME =
  'weather_'

const WEATHER_ICON_BY_INDEX = {
  0: 'cloud',
  1: 'cloud_rain',
  2: 'cloud_rain',
  3: 'sun',
  4: 'cloud',
  5: 'cloud_rain',
  6: 'cloud_rain',
  7: 'cloud_rain',
  8: 'cloud_rain',
  9: 'cloud_rain',
  10: 'cloud_rain',
  11: 'cloud',
  12: 'cloud_rain',
  13: 'cloud',
  14: 'cloud',
  15: 'cloud_lightning',
  16: 'cloud_rain',
  17: 'cloud',
  18: 'cloud_rain',
  19: 'cloud_lightning',
  20: 'cloud_lightning',
  21: 'cloud_rain',
  22: 'cloud',
  23: 'cloud',
  24: 'cloud_rain',
  25: 'cloud',
  26: 'cloud',
  27: 'cloud_rain',
  28: 'sun'
}

function getWeatherIconSrc(index) {
  const name =
    WEATHER_ICON_BY_INDEX[index] ||
    'cloud'

  return (
    'icons/' +
    WEATHER_ICON_NAME +
    name +
    '.png'
  )
}

function celsiusToDisplayTemperature(
  celsius
) {
  return Math.round(celsius)
}

function getTemperatureSlots(value) {
  const text =
    '' + value

  if (text.length >= 3) {
    return [
      text[text.length - 3],
      text[text.length - 2],
      text[text.length - 1]
    ]
  }

  if (text.length === 1) {
    return [
      ' ',
      ' ',
      text
    ]
  }

  return [
    ' ',
    text[0],
    text[1]
  ]
}

function getTemperatureCharSrc(
  character
) {
  if (character === '-') {
    return 'letters/MINUS.png'
  }

  if (character === ' ') {
    return 'numbers/null.png'
  }

  return (
    'numbers/' +
    character +
    '.png'
  )
}

// ============================================================
// WATCHFACE
// ============================================================

WatchFace({

  starWidgets: [],
  starTimer: null,

  lastDateKey: '',

  weatherTimer: null,

  heartRateSensor: null,
  stepSensor: null,
  batterySensor: null,
  weatherSensor: null,

  weatherIconWidget: null,
  temperatureDigitWidgets: [],

  heartValueWidget: null,
  stepValueWidget: null,
  batteryValueWidget: null,

  dateDayWidgets: [],
  dateMonthWidgets: [],
  weekDayWidgets: [],

  moonImageWidget: null,
  illuminationDigitWidgets: [],
  phaseImageWidget: null,

  currentMoonRecord: null,

  // ==========================================================
  // INIT
  // ==========================================================

  onInit() {
    console.log(
      'SaganMoon: iniciando watchface'
    )

    if (
      typeof hmSensor !==
      'undefined'
    ) {
      try {
        this.heartRateSensor =
          hmSensor.createSensor(
            hmSensor.id.HEART
          )

        this.stepSensor =
          hmSensor.createSensor(
            hmSensor.id.STEP
          )

        this.batterySensor =
          hmSensor.createSensor(
            hmSensor.id.BATTERY
          )

        this.weatherSensor =
          hmSensor.createSensor(
            hmSensor.id.WEATHER
          )

        console.log(
          'SaganMoon: sensores creados'
        )
      } catch (error) {
        console.log(
          'SaganMoon: ERROR creando sensores = ' +
          error
        )
      }
    } else {
      console.log(
        'SaganMoon: hmSensor no disponible'
      )
    }
  },

  // ==========================================================
  // BUILD
  // ==========================================================

  build() {
    console.log(
      'SaganMoon: construyendo SaganMoon 1.7'
    )

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x: 0,
        y: 0,
        w: SCREEN_WIDTH,
        h: SCREEN_HEIGHT,
        color: BLACK
      }
    )

    // ========================================================
    // ESTRELLAS
    // ========================================================

    this.starWidgets =
      createStars()

    // ========================================================
    // RELOJ
    // ========================================================

    const dateInfo =
      createClock()

    startClock(
      dateInfo => {
        const currentDateKey =
          dateInfo.year +
          '-' +
          twoDigits(
            dateInfo.month
          ) +
          '-' +
          twoDigits(
            dateInfo.day
          )

        if (
          this.lastDateKey !==
          currentDateKey
        ) {
          this.lastDateKey =
            currentDateKey

          this.updateDate()
          this.updateMoon()
        }
      }
    )

    console.log(
      'SaganMoon: reloj modular iniciado'
    )

    // ========================================================
    // LÍNEA DORADA
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x: 15,
        y: 330,
        w: 402,
        h: 2,
        color: GOLD
      }
    )

    // ========================================================
    // FECHA
    // ========================================================

    this.createDateWidgets()

    this.lastDateKey =
      dateInfo.year +
      '-' +
      twoDigits(
        dateInfo.month
      ) +
      '-' +
      twoDigits(
        dateInfo.day
      )

    // ========================================================
    // LUNA
    // ========================================================

    this.createMoonWidgets()

    // ========================================================
    // POSICIÓN INDICADORES
    // ========================================================

    const valueY =
      355

    const labelY =
      390

    // ========================================================
    // FRECUENCIA CARDIACA
    // ========================================================

    this.heartValueWidget =
      createSensorText({
        x: 46,
        y: valueY,
        w: 90,
        h: 42,
        type:
          hmUI.data_type.HEART,
        maxValue:
          SENSOR_LIMITS.heart
      })

    createSensorIcon({
      x: 73,
      y: labelY,
      name: 'heart'
    })

    // ========================================================
    // PASOS
    // ========================================================

    this.stepValueWidget =
      createSensorText({
        x: 136,
        y: valueY,
        w: 160,
        h: 42,
        type:
          hmUI.data_type.STEP,
        maxValue:
          SENSOR_LIMITS.steps
      })

    createSensorIcon({
      x: 198,
      y: labelY,
      name: 'steps'
    })

    // ========================================================
    // BATERÍA
    // ========================================================

    this.batteryValueWidget =
      createSensorText({
        x: 296,
        y: valueY,
        w: 90,
        h: 42,
        type:
          hmUI.data_type.BATTERY,
        maxValue:
          SENSOR_LIMITS.battery
      })

    createSensorIcon({
      x: 323,
      y: labelY,
      name: 'battery'
    })

    // ========================================================
    // CLIMA
    // ========================================================

    this.weatherIconWidget =
      hmUI.createWidget(
        hmUI.widget.IMG,
        {
          x: 340,
          y: 438,
          w: 72,
          h: 56,
          src:
            getWeatherIconSrc(3)
        }
      )

    // ========================================================
    // TEMPERATURA
    // ========================================================

    const temperatureY =
      448

    this.temperatureDigitWidgets = [
      hmUI.createWidget(
        hmUI.widget.IMG,
        {
          x: 220,
          y: temperatureY,
          w: 22,
          h: 30,
          src:
            'numbers/null.png'
        }
      ),

      hmUI.createWidget(
        hmUI.widget.IMG,
        {
          x: 244,
          y: temperatureY,
          w: 22,
          h: 30,
          src:
            'numbers/null.png'
        }
      ),

      hmUI.createWidget(
        hmUI.widget.IMG,
        {
          x: 268,
          y: temperatureY,
          w: 22,
          h: 30,
          src:
            'numbers/null.png'
        }
      )
    ]

    // ========================================================
    // GRADOS
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x: 292,
        y: temperatureY,
        w: 22,
        h: 30,
        src:
          'numbers/degree.png'
      }
    )

    // ========================================================
    // ACTUALIZACIONES INICIALES
    // ========================================================

    this.updateWeather()
    this.updateSensorValues()

    // ========================================================
    // ESTRELLAS DINÁMICAS
    // ========================================================

    this.starTimer =
      setInterval(
        () => {
          updateStars(
            this.starWidgets
          )
        },
        2500
      )

    // ========================================================
    // IDIOMA
    // ========================================================

    console.log(
      'SaganMoon: idioma = ' +
      (
        isSpanish()
          ? 'ES'
          : 'EN'
      )
    )

    // ========================================================
    // ACTUALIZACIÓN DEL CLIMA
    // ========================================================

    this.weatherTimer =
      setInterval(
        () =>
          this.updateWeather(),
        5 * 60 * 1000
      )
  },

  // ==========================================================
  // FECHA
  // ==========================================================

  createDateWidgets() {
    const dateInfo =
      getCurrentDateInfo()

    const dateDay =
      twoDigits(
        dateInfo.day
      )

    const dateMonth =
      twoDigits(
        dateInfo.month
      )

    const weekDay =
      getWeekDayName(
        dateInfo.weekDay
      )

    this.dateDayWidgets = [
      createDigitalDigit({
        x: 28,
        y: 448,
        w: 22,
        h: 30,
        path: 'numbers',
        digit:
          dateDay[0]
      }),

      createDigitalDigit({
        x: 52,
        y: 448,
        w: 22,
        h: 30,
        path: 'numbers',
        digit:
          dateDay[1]
      })
    ]

    createDigitalDigit({
      x: 76,
      y: 448,
      w: 12,
      h: 30,
      path: 'numbers',
      digit: 'null'
    })

    this.dateMonthWidgets = [
      createDigitalDigit({
        x: 90,
        y: 448,
        w: 22,
        h: 30,
        path: 'numbers',
        digit:
          dateMonth[0]
      }),

      createDigitalDigit({
        x: 114,
        y: 448,
        w: 22,
        h: 30,
        path: 'numbers',
        digit:
          dateMonth[1]
      })
    ]

    this.weekDayWidgets =
      createLetterText({
        x: 142,
        y: 448,
        w: 62,
        h: 30,
        text: weekDay,
        maxLetterWidth: 20,
        spacing: 1,
        spaceWidth: 6,
        align:
          hmUI.align.LEFT
      })
  },

  updateDate() {
    const dateInfo =
      getCurrentDateInfo()

    const dateDay =
      twoDigits(
        dateInfo.day
      )

    const dateMonth =
      twoDigits(
        dateInfo.month
      )

    const weekDay =
      getWeekDayName(
        dateInfo.weekDay
      )

    if (
      this.dateDayWidgets.length >= 2
    ) {
      this.dateDayWidgets[0].setProperty(
        hmUI.prop.SRC,
        'numbers/' +
        dateDay[0] +
        '.png'
      )

      this.dateDayWidgets[1].setProperty(
        hmUI.prop.SRC,
        'numbers/' +
        dateDay[1] +
        '.png'
      )
    }

    if (
      this.dateMonthWidgets.length >= 2
    ) {
      this.dateMonthWidgets[0].setProperty(
        hmUI.prop.SRC,
        'numbers/' +
        dateMonth[0] +
        '.png'
      )

      this.dateMonthWidgets[1].setProperty(
        hmUI.prop.SRC,
        'numbers/' +
        dateMonth[1] +
        '.png'
      )
    }

    const normalizedWeekDay =
      normalizeImageText(
        weekDay
      ).toUpperCase()

    const characters =
      normalizedWeekDay.split('')

    for (
      let i = 0;
      i < this.weekDayWidgets.length;
      i++
    ) {
      if (
        i >= characters.length
      ) {
        continue
      }

      const character =
        characters[i]

      this.weekDayWidgets[i].setProperty(
        hmUI.prop.SRC,
        'letters/' +
        getLetterAssetName(
          character
        ) +
        '.png'
      )
    }

    console.log(
      'SaganMoon: fecha actualizada -> ' +
      dateDay +
      '/' +
      dateMonth +
      ' ' +
      weekDay
    )
  },

  // ==========================================================
  // LUNA
  // ==========================================================

  createMoonWidgets() {
    const dateInfo =
      getCurrentDateInfo()

    let record =
      getMoonData(
        dateInfo.year,
        dateInfo.month,
        dateInfo.day
      )

    if (record === null) {
      record =
        getFallbackMoonData(
          dateInfo.year,
          dateInfo.month,
          dateInfo.day
        )

      console.log(
        'SaganMoon: usando cálculo lunar de respaldo'
      )
    }

    this.currentMoonRecord =
      record

    const illumination =
      record.phase.illumination

    const phaseName =
      record.phase.name

    const phaseAngle =
      record.phase.phase_angle_deg

    const phasePercent =
      Math.round(
        illumination * 100
      )

    const moonImageNumber =
      getMoonImageNumber(
        phaseAngle
      )

    console.log(
      'SaganMoon: fecha lunar = ' +
      record.calendar_date
    )

    console.log(
      'SaganMoon: fase = ' +
      phaseName
    )

    console.log(
      'SaganMoon: iluminación = ' +
      phasePercent +
      '%'
    )

    console.log(
      'SaganMoon: ángulo = ' +
      phaseAngle +
      '°'
    )

    console.log(
      'SaganMoon: imagen lunar = moon_' +
      twoDigits(
        moonImageNumber
      ) +
      '.png'
    )

    const moonX =
      265

    const moonY =
      120

    const moonSize =
      345

    this.moonImageWidget =
      hmUI.createWidget(
        hmUI.widget.IMG,
        {
          x:
            moonX -
            moonSize / 2,
          y:
            moonY -
            moonSize / 2,
          w:
            moonSize,
          h:
            moonSize,
          src:
            getMoonImagePath(
              moonImageNumber
            )
        }
      )

    const illuminationText =
      '' +
      phasePercent

    const illuminationX =
      299

    const illuminationY =
      280

    this.illuminationDigitWidgets =
      []

    for (
      let i = 0;
      i < illuminationText.length;
      i++
    ) {
      const widget =
        createDigitalDigit({
          x:
            illuminationX +
            (i * 24),
          y:
            illuminationY,
          w: 22,
          h: 30,
          path: 'numbers',
          digit:
            illuminationText[i]
        })

      this.illuminationDigitWidgets.push(
        widget
      )
    }

    const percentWidget =
      createDigitalDigit({
        x:
          illuminationX +
          (
            illuminationText.length *
            24
          ),
        y:
          illuminationY,
        w: 22,
        h: 30,
        path: 'letters',
        digit: 'PERCENT'
      })

    this.illuminationDigitWidgets.push(
      percentWidget
    )

    this.phaseImageWidget =
      hmUI.createWidget(
        hmUI.widget.IMG,
        {
          x: 84,
          y: 281,
          w: 195,
          h: 32,
          src:
            'phase_labels/' +
            (
              isSpanish()
                ? 'ES_'
                : 'EN_'
            ) +
            getPhaseAssetName(
              phaseName
            ) +
            '.png'
        }
      )
  },

  updateMoon() {
    if (
      this.moonImageWidget === null
    ) {
      return
    }

    const dateInfo =
      getCurrentDateInfo()

    let moonRecord =
      getMoonData(
        dateInfo.year,
        dateInfo.month,
        dateInfo.day
      )

    if (moonRecord === null) {
      moonRecord =
        getFallbackMoonData(
          dateInfo.year,
          dateInfo.month,
          dateInfo.day
        )
    }

    this.currentMoonRecord =
      moonRecord

    const illumination =
      moonRecord.phase.illumination

    const phaseName =
      moonRecord.phase.name

    const phaseAngle =
      moonRecord.phase.phase_angle_deg

    const phasePercent =
      Math.round(
        illumination * 100
      )

    const moonImageNumber =
      getMoonImageNumber(
        phaseAngle
      )

    this.moonImageWidget.setProperty(
      hmUI.prop.SRC,
      getMoonImagePath(
        moonImageNumber
      )
    )

    const illuminationText =
      '' +
      phasePercent

    for (
      let i = 0;
      i <
      this.illuminationDigitWidgets.length;
      i++
    ) {
      let src

      if (
        i < illuminationText.length
      ) {
        src =
          'numbers/' +
          illuminationText[i] +
          '.png'
      } else if (
        i === illuminationText.length
      ) {
        src =
          'letters/PERCENT.png'
      } else {
        src =
          'numbers/null.png'
      }

      this.illuminationDigitWidgets[i]
        .setProperty(
          hmUI.prop.SRC,
          src
        )
    }

    if (
      this.phaseImageWidget !== null
    ) {
      this.phaseImageWidget.setProperty(
        hmUI.prop.SRC,
        'phase_labels/' +
        (
          isSpanish()
            ? 'ES_'
            : 'EN_'
        ) +
        getPhaseAssetName(
          phaseName
        ) +
        '.png'
      )
    }

    console.log(
      'SaganMoon: luna actualizada -> ' +
      phaseName +
      ' ' +
      phasePercent +
      '% ' +
      phaseAngle +
      '° moon_' +
      twoDigits(
        moonImageNumber
      )
    )
  },

  // ==========================================================
  // SENSORES
  // ==========================================================

  readHeartRate() {
    if (
      this.heartRateSensor ===
      null
    ) {
      return '--'
    }

    try {
      const value =
        this.heartRateSensor.last

      return (
        value &&
        value > 0
      )
        ? value
        : '--'
    } catch (error) {
      console.log(
        'SaganMoon: ERROR FRECUENCIA = ' +
        error
      )

      return '--'
    }
  },

  readSteps() {
    if (
      this.stepSensor ===
      null
    ) {
      return '--'
    }

    try {
      const value =
        this.stepSensor.current

      return (
        value !== undefined &&
        value >= 0
      )
        ? value
        : '--'
    } catch (error) {
      console.log(
        'SaganMoon: ERROR PASOS = ' +
        error
      )

      return '--'
    }
  },

  readBattery() {
    if (
      this.batterySensor ===
      null
    ) {
      return '--'
    }

    try {
      const value =
        this.batterySensor.current

      return (
        value !== undefined &&
        value >= 0
      )
        ? value
        : '--'
    } catch (error) {
      console.log(
        'SaganMoon: ERROR BATERIA = ' +
        error
      )

      return '--'
    }
  },

  updateSensorValues() {
    const heartValue =
      this.readHeartRate()

    const stepValue =
      this.readSteps()

    const batteryValue =
      this.readBattery()

    if (
      this.heartValueWidget !==
      null
    ) {
      this.heartValueWidget.setProperty(
        hmUI.prop.TEXT,
        '' +
        heartValue
      )
    }

    if (
      this.stepValueWidget !==
      null
    ) {
      this.stepValueWidget.setProperty(
        hmUI.prop.TEXT,
        '' +
        stepValue
      )
    }

    if (
      this.batteryValueWidget !==
      null
    ) {
      this.batteryValueWidget.setProperty(
        hmUI.prop.TEXT,
        '' +
        batteryValue +
        '%'
      )
    }

    console.log(
      'SaganMoon: sensores -> HR=' +
      heartValue +
      ' STEP=' +
      stepValue +
      ' BAT=' +
      batteryValue
    )
  },

  // ==========================================================
  // CLIMA
  // ==========================================================

updateWeather() {
  console.log(
    'SaganMoon: UPDATE WEATHER EJECUTADO'
  )

  console.log(
    'SaganMoon: weatherSensor=' +
    (this.weatherSensor === null ? 'NULL' : 'OK')
  )

  console.log(
    'SaganMoon: weatherIconWidget=' +
    (this.weatherIconWidget === null ? 'NULL' : 'OK')
  )

  if (
    this.weatherSensor === null ||
    this.weatherIconWidget === null
  ) {
    console.log(
      'SaganMoon: clima detenido por widget/sensor NULL'
    )
    return
  }

  try {
      const forecast =
        this.weatherSensor
          .getForecastWeather()

      console.log(
        'SaganMoon: forecast=' +
        JSON.stringify(
          forecast
        )
      )

      if (
        !forecast ||
        !forecast.forecastData ||
        !forecast.forecastData.data ||
        !forecast.forecastData.data[0]
      ) {
        console.log(
          'SaganMoon: sin datos de clima'
        )

        return
      }

      const today =
        forecast
          .forecastData
          .data[0]

      console.log(
        'SaganMoon: clima raw index=' +
        today.index +
        ' high=' +
        today.high +
        ' low=' +
        today.low
      )

      this.weatherIconWidget.setProperty(
        hmUI.prop.SRC,
        getWeatherIconSrc(
          today.index
        )
      )

      const displayTemperature =
        celsiusToDisplayTemperature(
          today.high
        )

      const slots =
        getTemperatureSlots(
          displayTemperature
        )

      for (
        let i = 0;
        i <
        this.temperatureDigitWidgets.length;
        i++
      ) {
        const character =
          slots[i] || ' '

        this.temperatureDigitWidgets[i]
          .setProperty(
            hmUI.prop.SRC,
            getTemperatureCharSrc(
              character
            )
          )
      }

      console.log(
        'SaganMoon: clima -> index=' +
        today.index +
        ' temp=' +
        displayTemperature
      )
    } catch (error) {
      console.log(
        'SaganMoon: ERROR CLIMA = ' +
        error
      )
    }
  },

  // ==========================================================
  // DESTRUCCIÓN
  // ==========================================================

  onDestroy() {
    stopClock()

    if (
      this.starTimer !==
      null
    ) {
      clearInterval(
        this.starTimer
      )

      this.starTimer =
        null
    }

    if (
      this.weatherTimer !==
      null
    ) {
      clearInterval(
        this.weatherTimer
      )

      this.weatherTimer =
        null
    }

    console.log(
      'SaganMoon: cerrando watchface y liberando timers'
    )
  }
})


