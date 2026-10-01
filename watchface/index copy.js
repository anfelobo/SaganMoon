// ============================================================
// SAGANMOON - Amazfit Bip Max
// Versión 1.5
//
// DISEÑO
// ------------------------------------------------------------
// • Hora grande blanca y gruesa
// • Luna grande
// • Iluminación blanca y gruesa
// • Estrellas irregulares y dinámicas
// • BPM / pasos / batería dorados
// • Clima con icono meteorológico
// • Temperatura debajo del icono
// • Fecha en español o inglés
// • Dorado limpio
//
// Las 21 imágenes lunares permanecen intactas.
// moon_11-2.png queda reservada.
// ============================================================


import * as hmUI from '@zos/ui'
import { Time } from '@zos/sensor'
import { getLanguage } from '@zos/settings'

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

  { x: 24,  y: 48,  r: 2, alpha: 175 },
  { x: 88,  y: 31,  r: 1, alpha: 130 },
  { x: 151, y: 65,  r: 2, alpha: 205 },
  { x: 224, y: 27,  r: 1, alpha: 150 },
  { x: 382, y: 40,  r: 2, alpha: 190 },

  { x: 52,  y: 122, r: 1, alpha: 145 },
  { x: 137, y: 105, r: 2, alpha: 180 },
  { x: 205, y: 150, r: 1, alpha: 135 },
  { x: 365, y: 105, r: 1, alpha: 155 },
  { x: 410, y: 168, r: 2, alpha: 180 },

  { x: 20,  y: 215, r: 1, alpha: 160 },
  { x: 172, y: 235, r: 2, alpha: 145 },
  { x: 405, y: 265, r: 1, alpha: 175 },

  { x: 46,  y: 350, r: 2, alpha: 185 },
  { x: 185, y: 375, r: 1, alpha: 140 },
  { x: 292, y: 350, r: 2, alpha: 175 },
  { x: 392, y: 390, r: 1, alpha: 155 },

  { x: 30,  y: 438, r: 1, alpha: 150 },
  { x: 218, y: 425, r: 2, alpha: 170 },
  { x: 370, y: 445, r: 1, alpha: 140 }

]


// ============================================================
// DOS DÍGITOS
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


// ============================================================
// SELECCIÓN DE IMAGEN LUNAR
// ============================================================

function getMoonImageNumber(phaseAngle) {

  let angle =
    phaseAngle % 360


  if (angle < 0) {

    angle =
      angle + 360
  }


  return Math.round(
    angle / (360 / MOON_IMAGE_COUNT)
  ) % MOON_IMAGE_COUNT
}


// ============================================================
// RUTA LUNA
// ============================================================

function getMoonImagePath(imageNumber) {

  return (
    'moon/moon_' +
    twoDigits(imageNumber) +
    '.png'
  )
}


// ============================================================
// IDIOMA
//
// Zepp:
// 2 = English
// 3 = Spanish
// ============================================================

function isSpanish() {

  const language =
    getLanguage()


  return language === 3
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
// ETIQUETAS
// ============================================================

function getLabels() {

  if (isSpanish()) {

    return {

      heart:
        'BPM',

      steps:
        'PASOS',

      battery:
        'BATERÍA'

    }

  }


  return {

    heart:
      'BPM',

    steps:
      'STEPS',

    battery:
      'BATTERY'

  }
}


// ============================================================
// ETIQUETA DE FASE
// ============================================================

function getPhaseLabel(phaseName) {

  const spanishLabels = {

    'New Moon':
      'NUEVA',

    'Waxing Crescent':
      'CRECIENTE',

    'First Quarter':
      '1/4  CRECIENTE',

    'Waxing Gibbous':
      'GIBOSA  + ',

    'Full Moon':
      'LUNA LLENA',

    'Waning Gibbous':
      'GIBOSA - ',

    'Last Quarter':
      '1/4  MENGUANTE',

    'Waning Crescent':
      'MENGUANTE'

  }


  const englishLabels = {

    'New Moon':
      'NEW',

    'Waxing Crescent':
      'CRESCENT',

    'First Quarter':
      '1/4 WAXING',

    'Waxing Gibbous':
      'GIBBOUS +',

    'Full Moon':
      'FULL MOON',

    'Waning Gibbous':
      'GIBBOUS -',

    'Last Quarter':
      '1/4 WANING',

    'Waning Crescent':
      'WANING'

  }


  const labels =
    isSpanish()
      ? spanishLabels
      : englishLabels


  return labels[phaseName] || phaseName
}


// ============================================================
// NOMBRE DEL ASSET DE FASE
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
    isSpanish() ? 'ES_' : 'EN_'
  ) + (
    phaseNames[phaseName] || 'NEW_MOON'
  )
}


// ============================================================
// TEXTO GRUESO
//
// Zepp OS no ofrece una propiedad "bold" en TEXT.
// Se utilizan varias capas desplazadas 1 px.
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


  // ----------------------------------------------------------
  // CAPA IZQUIERDA
  // ----------------------------------------------------------

  hmUI.createWidget(
    hmUI.widget.TEXT,
    {
      x: x - 1,
      y: y,

      w: w,
      h: h,

      text:
        text,

      text_size:
        textSize,

      color:
        color,

      align_h:
        align,

      align_v:
        hmUI.align.CENTER_V
    }
  )


  // ----------------------------------------------------------
  // CAPA DERECHA
  // ----------------------------------------------------------

  hmUI.createWidget(
    hmUI.widget.TEXT,
    {
      x: x + 1,
      y: y,

      w: w,
      h: h,

      text:
        text,

      text_size:
        textSize,

      color:
        color,

      align_h:
        align,

      align_v:
        hmUI.align.CENTER_V
    }
  )


  // ----------------------------------------------------------
  // CAPA SUPERIOR
  // ----------------------------------------------------------

  hmUI.createWidget(
    hmUI.widget.TEXT,
    {
      x: x,
      y: y - 1,

      w: w,
      h: h,

      text:
        text,

      text_size:
        textSize,

      color:
        color,

      align_h:
        align,

      align_v:
        hmUI.align.CENTER_V
    }
  )


  // ----------------------------------------------------------
  // CAPA PRINCIPAL
  // ----------------------------------------------------------

  const core =
    hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x: x,
        y: y,

        w: w,
        h: h,

        text:
          text,

        text_size:
          textSize,

        color:
          color,

        align_h:
          align,

        align_v:
          hmUI.align.CENTER_V
      }
    )


  return core
}


// ============================================================
// TEXTO DORADO
// ============================================================

function createGoldText(options) {

  return createBoldText({

    x:
      options.x,

    y:
      options.y,

    w:
      options.w,

    h:
      options.h,

    text:
      options.text,

    textSize:
      options.textSize,

    color:
      GOLD,

    align:
      options.align

  })
}


// ============================================================
// NÚMEROS DE SENSORES
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

  heart:
    999,

  steps:
    99999,

  battery:
    100

}


// ============================================================
// ICONOS DE CLIMA
//
// El sensor WEATHER expone un índice de 0 a 28.
// Lo agrupamos en cuatro iconos:
//   • sun
//   • cloud
//   • cloud_rain
//   • cloud_lightning
// ============================================================

const WEATHER_ICON_NAME =
  'weather_'


const WEATHER_ICON_BY_INDEX = {

  0:
    'cloud',

  1:
    'cloud_rain',

  2:
    'cloud_rain',

  3:
    'sun',

  4:
    'cloud',

  5:
    'cloud_rain',

  6:
    'cloud_rain',

  7:
    'cloud_rain',

  8:
    'cloud_rain',

  9:
    'cloud_rain',

  10:
    'cloud_rain',

  11:
    'cloud',

  12:
    'cloud_rain',

  13:
    'cloud',

  14:
    'cloud',

  15:
    'cloud_lightning',

  16:
    'cloud_rain',

  17:
    'cloud',

  18:
    'cloud_rain',

  19:
    'cloud_lightning',

  20:
    'cloud_lightning',

  21:
    'cloud_rain',

  22:
    'cloud',

  23:
    'cloud',

  24:
    'cloud_rain',

  25:
    'cloud',

  26:
    'cloud',

  27:
    'cloud_rain',

  28:
    'sun'

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


// ============================================================
// TEMPERATURA
//
// El watchface muestra la temperatura en Celsius.
// ============================================================

function celsiusToDisplayTemperature(celsius) {

  return Math.round(celsius)
}


// ============================================================
// SLOTS DE TEMPERATURA
//
// Soporta:
//
//   8
//   12
//   -3
//   -12
//
// Máximo: 3 caracteres.
//
// Los valores de un solo dígito se alinean a la derecha.
// ============================================================

function getTemperatureSlots(value) {

  const text =
    '' + value


  // ----------------------------------------------------------
  // TRES CARACTERES
  // Ejemplo: -12
  // ----------------------------------------------------------

  if (text.length >= 3) {

    return [

      text[text.length - 3],

      text[text.length - 2],

      text[text.length - 1]

    ]
  }


  // ----------------------------------------------------------
  // UN CARÁCTER
  // Ejemplo: 8
  // ----------------------------------------------------------

  if (text.length === 1) {

    return [

      ' ',

      ' ',

      text

    ]
  }


  // ----------------------------------------------------------
  // DOS CARACTERES
  // Ejemplo: 12
  // ----------------------------------------------------------

  return [

    ' ',

    text[0],

    text[1]

  ]
}


// ============================================================
// ASSET DE CADA CARÁCTER DE TEMPERATURA
// ============================================================

function getTemperatureCharSrc(character) {

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
// SENSOR TEXT
// ============================================================

function createSensorText(options) {

  return hmUI.createWidget(
    hmUI.widget.TEXT_IMG,
    {
      x:
        options.x,

      y:
        options.y,

      w:
        options.w,

      h:
        options.h,

      type:
        options.type,

      font_array:
        SENSOR_NUMBER_IMAGES,

      h_space:
        0,

      align_h:
        hmUI.align.CENTER_H,

      invalid_image:
        'numbers/null.png',

      max_value:
        options.maxValue
    }
  )
}


// ============================================================
// ICONO DE SENSOR
// ============================================================

function createSensorIcon(options) {

  return hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x:
        options.x,

      y:
        options.y,

      w:
        36,

      h:
        28,

      src:
        'icons/' +
        options.name +
        '.png'
    }
  )
}


// ============================================================
// DÍGITO DIGITAL
// ============================================================

function createDigitalDigit(options) {

  return hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x:
        options.x,

      y:
        options.y,

      w:
        options.w,

      h:
        options.h,

      src:
        options.path +
        '/' +
        options.digit +
        '.png'
    }
  )
}


// ============================================================
// NORMALIZAR TEXTO
// ============================================================

function normalizeImageText(text) {

  return text
    .replace(/[ÁÀÂÄ]/g, 'A')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[ÍÌÎÏ]/g, 'I')
    .replace(/[ÓÒÔÖ]/g, 'O')
    .replace(/[ÚÙÛÜ]/g, 'U')
}


// ============================================================
// NOMBRE DEL ASSET DE LETRA
// ============================================================

function getLetterAssetName(character) {

  const symbolNames = {

    '/':
      'SLASH',

    '%':
      'PERCENT',

    '+':
      'PLUS',

    '-':
      'MINUS'

  }


  return (
    symbolNames[character] ||
    character
  )
}


// ============================================================
// CARPETA DEL ASSET DE TEXTO
// ============================================================

function getTextAssetPath(character) {

  return /[0-9]/.test(character) ||
    character === '/'
    ? 'numbers/'
    : 'letters/'
}


// ============================================================
// TEXTO CON IMÁGENES
// ============================================================

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
    (spaceCount * spaceWidth) -
    ((characters.length - 1) * spacing)


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
      letterWidth * 30 / 22
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
      (options.h - letterHeight) / 2
    )


  if (
    options.align ===
    hmUI.align.CENTER_H
  ) {

    x +=
      (options.w - textWidth) / 2
  }


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

      hmUI.createWidget(
        hmUI.widget.IMG,
        {
          x:
            x,

          y:
            y,

          w:
            letterWidth,

          h:
            letterHeight,

          src:
            (
              assetFolder
                ? assetFolder + '/'
                : getTextAssetPath(character)
            ) +
            getLetterAssetName(character) +
            '.png'
        }
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
}


// ============================================================
// IMAGEN DE FASE
// ============================================================

function createPhaseImage(options) {

  return hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x:
        options.x,

      y:
        options.y,

      w:
        options.w,

      h:
        options.h,

      src:
        'phase_labels/' +
        options.name +
        '.png'
    }
  )
}


// ============================================================
// TEXTO NEON
// ============================================================

function createNeonText(options) {

  createBoldText({

    x:
      options.x + 2,

    y:
      options.y + 2,

    w:
      options.w,

    h:
      options.h,

    text:
      options.text,

    textSize:
      options.textSize,

    color:
      DARK_CYAN,

    align:
      options.align

  })


  return createBoldText({

    x:
      options.x,

    y:
      options.y,

    w:
      options.w,

    h:
      options.h,

    text:
      options.text,

    textSize:
      options.textSize,

    color:
      NEON_CYAN,

    align:
      options.align

  })
}


// ============================================================
// CREAR ESTRELLAS
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

          center_x:
            star.x,

          center_y:
            star.y,

          radius:
            star.r,

          color:
            WHITE,

          alpha:
            star.alpha
        }
      )


    stars.push({

      widget:
        widget,

      baseAlpha:
        star.alpha

    })
  }


  return stars
}


// ============================================================
// ACTUALIZAR ESTRELLAS
// ============================================================

function updateStars(stars) {

  for (
    let i = 0;
    i < stars.length;
    i++
  ) {

    if (
      Math.random() >=
      0.35
    ) {

      continue
    }


    const random =
      Math.random()


    let alpha


    if (
      random < 0.20
    ) {

      alpha =
        0

    } else if (
      random < 0.55
    ) {

      alpha =
        Math.floor(
          stars[i].baseAlpha *
          0.30
        )

    } else if (
      random < 0.80
    ) {

      alpha =
        stars[i].baseAlpha

    } else {

      alpha =
        255
    }


    stars[i].widget.setProperty(
      hmUI.prop.ALPHA,
      alpha
    )
  }
}


// ============================================================
// WATCHFACE
// ============================================================

WatchFace({

  // ==========================================================
  // VARIABLES
  // ==========================================================

  starWidgets: [],

  starTimer: null,

  clockWidgets: [],

  clockTimer: null,

  displayedClock: '',

  sensorTimer: null,

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
      'SaganMoon: construyendo SaganMoon'
    )


    // ========================================================
    // FONDO
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:
          0,

        y:
          0,

        w:
          SCREEN_WIDTH,

        h:
          SCREEN_HEIGHT,

        color:
          BLACK
      }
    )


    // ========================================================
    // ESTRELLAS
    // ========================================================

    this.starWidgets =
      createStars()


    // ========================================================
    // HORA
    // ========================================================

    const time =
      new Time()


    const year =
      time.getFullYear()


    const month =
      time.getMonth()


    const day =
      time.getDate()


    const hour =
      time.getHours()


    const minute =
      time.getMinutes()


    const currentHour =
      twoDigits(hour)


    const currentMinute =
      twoDigits(minute)


    // ========================================================
    // HORA PRINCIPAL
    // ========================================================

    this.clockWidgets = [

      createDigitalDigit({

        x:
          28,

        y:
          50,

        w:
          68,

        h:
          92,

        path:
          'digits/clock',

        digit:
          currentHour[0]

      }),


      createDigitalDigit({

        x:
          96,

        y:
          50,

        w:
          68,

        h:
          92,

        path:
          'digits/clock',

        digit:
          currentHour[1]

      }),


      // ======================================================
      // MINUTOS
      // ======================================================

      createDigitalDigit({

        x:
          28,

        y:
          170,

        w:
          68,

        h:
          92,

        path:
          'digits/clock',

        digit:
          currentMinute[0]

      }),


      createDigitalDigit({

        x:
          96,

        y:
          170,

        w:
          68,

        h:
          92,

        path:
          'digits/clock',

        digit:
          currentMinute[1]

      })

    ]


    this.displayedClock =
      currentHour +
      currentMinute


    this.clockTimer =
      setInterval(
        () =>
          this.updateClock(),
        1000
      )


    // ========================================================
    // LÍNEA DORADA
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x:
          15,

        y:
          330,

        w:
          402,

        h:
          2,

        color:
          GOLD
      }
    )


   // ========================================================
// FECHA
//
// Nueva distribución:
//
// La fecha queda abajo a la izquierda,
// aproximadamente 10 px desde el borde.
// ========================================================

const jsDate =
  new Date(
    year,
    month - 1,
    day
  )


const weekDay =
  getWeekDayName(
    jsDate.getDay()
  )


const dateDay =
  twoDigits(day)


const dateMonth =
  twoDigits(month)


// ========================================================
// DÍA
// ========================================================

createDigitalDigit({

  x:
    28,

  y:
    458,

  w:
    22,

  h:
    30,

  path:
    'numbers',

  digit:
    dateDay[0]

})


createDigitalDigit({

  x:
    52,

  y:
    458,

  w:
    22,

  h:
    30,

  path:
    'numbers',

  digit:
    dateDay[1]

})


// ========================================================
// SEPARADOR DÍA / MES
// ========================================================

createDigitalDigit({

  x:
    76,

  y:
    458,

  w:
    12,

  h:
    30,

  path:
    'numbers',

  digit:
    'null'

})


// ========================================================
// MES
// ========================================================

createDigitalDigit({

  x:
    90,

  y:
    458,

  w:
    22,

  h:
    30,

  path:
    'numbers',

  digit:
    dateMonth[0]

})


createDigitalDigit({

  x:
    114,

  y:
    458,

  w:
    22,

  h:
    30,

  path:
    'numbers',

  digit:
    dateMonth[1]

})


// ========================================================
// DÍA DE LA SEMANA
// ========================================================

createLetterText({

  x:
    142,

  y:
    458,

  w:
    62,

  h:
    30,

  text:
    weekDay,

  maxLetterWidth:
    20,

  spacing:
    1,

  spaceWidth:
    6,

  align:
    hmUI.align.LEFT

})

    // ========================================================
    // DATOS LUNARES
    // ========================================================

    const moonRecord =
      getMoonData(
        year,
        month,
        day
      )


    let illumination =
      0


    let phaseName =
      'Sin datos'


    let phaseAngle =
      0


    let isWaxing =
      false


    if (
      moonRecord !== null
    ) {

      illumination =
        moonRecord.phase.illumination


      phaseName =
        moonRecord.phase.name


      phaseAngle =
        moonRecord.phase.phase_angle_deg


      isWaxing =
        moonRecord.phase.is_waxing


      console.log(
        'SaganMoon: fecha = ' +
        moonRecord.calendar_date
      )


      console.log(
        'SaganMoon: fase = ' +
        phaseName
      )


      console.log(
        'SaganMoon: iluminación = ' +
        Math.round(
          illumination * 100
        ) +
        '%'
      )


      console.log(
        'SaganMoon: ángulo = ' +
        phaseAngle +
        '°'
      )


      console.log(
        'SaganMoon: creciente = ' +
        isWaxing
      )

    } else {

      console.log(
        'SaganMoon: no hay datos lunares'
      )
    }


    // ========================================================
    // PORCENTAJE DE ILUMINACIÓN
    // ========================================================

    const phasePercent =
      Math.round(
        illumination * 100
      )


    // ========================================================
    // IMAGEN LUNAR
    // ========================================================

    const moonImageNumber =
      getMoonImageNumber(
        phaseAngle
      )


    const moonImagePath =
      getMoonImagePath(
        moonImageNumber
      )


    console.log(
      'SaganMoon: imagen lunar = moon_' +
      twoDigits(
        moonImageNumber
      ) +
      '.png'
    )


    // ========================================================
    // LUNA
    // ========================================================

    const moonX =
      265


    const moonY =
      120


    const moonSize =
      345


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
          moonImagePath

      }
    )


    // ========================================================
    // ILUMINACIÓN
    // ========================================================

    const illuminationText =
      '' +
      phasePercent


    const illuminationX =
      299


    const illuminationY =
      280


    for (
      let i = 0;
      i < illuminationText.length;
      i++
    ) {

      createDigitalDigit({

        x:
          illuminationX +
          (i * 24),

        y:
          illuminationY,

        w:
          22,

        h:
          30,

        path:
          'numbers',

        digit:
          illuminationText[i]

      })
    }


    createDigitalDigit({

      x:
        illuminationX +
        (illuminationText.length * 24),

      y:
        illuminationY,

      w:
        22,

      h:
        30,

      path:
        'letters',

      digit:
        'PERCENT'

    })


    createPhaseImage({

      x:
        84,

      y:
        281,

      w:
        195,

      h:
        32,

      name:
        getPhaseAssetName(
          phaseName
        )

    })


    // ========================================================
    // ETIQUETAS
    // ========================================================

    const labels =
      getLabels()


    // ========================================================
    // POSICIÓN DE INDICADORES
    // ========================================================
// POSICIÓN DE INDICADORES
//
// NUEVA DISTRIBUCIÓN
//
//       CORAZÓN       PASOS       BATERÍA
//
// El bloque completo tiene 340 px de ancho:
//
// x = 46
// x = 136
// x = 296
//
// Los pasos reciben más espacio porque pueden mostrar
// números de hasta 5 dígitos.
//
// Los tres valores están centrados verticalmente.
// ========================================================

const valueY =
  365


const labelY =
  410


// ========================================================
// FRECUENCIA CARDIACA
//
// Área:
// x = 46
// w = 90
//
// Icono centrado:
// x = 73
// ========================================================

this.heartValueWidget =
  createSensorText({

    x:
      46,

    y:
      valueY,

    w:
      90,

    h:
      42,

    type:
      hmUI.data_type.HEART,

    maxValue:
      SENSOR_LIMITS.heart

  })


createSensorIcon({

  x:
    73,

  y:
    labelY,

  name:
    'heart'

})


// ========================================================
// PASOS
//
// Este bloque es deliberadamente más ancho.
//
// Área:
// x = 136
// w = 160
//
// Esto permite que valores como:
//
// 542
// 8.542
// 12.345
//
// tengan espacio suficiente.
// ========================================================

this.stepValueWidget =
  createSensorText({

    x:
      136,

    y:
      valueY,

    w:
      160,

    h:
      42,

    type:
      hmUI.data_type.STEP,

    maxValue:
      SENSOR_LIMITS.steps

  })


createSensorIcon({

  x:
    198,

  y:
    labelY,

  name:
    'steps'

})


// ========================================================
// BATERÍA
//
// Área:
// x = 296
// w = 90
//
// Icono centrado:
// x = 323
// ========================================================

this.batteryValueWidget =
  createSensorText({

    x:
      296,

    y:
      valueY,

    w:
      90,

    h:
      42,

    type:
      hmUI.data_type.BATTERY,

    maxValue:
      SENSOR_LIMITS.battery

  })


createSensorIcon({

  x:
    323,

  y:
    labelY,

  name:
    'battery'

})


// ========================================================
// CLIMA
//
// El clima YA NO forma parte de la fila de sensores.
//
// Ahora se coloca junto a la fecha:
//
// 28/09 MIÉ  ☀ 18°C
//
// ========================================================

this.weatherIconWidget =
  hmUI.createWidget(
    hmUI.widget.IMG,
    {

      x:
        240,

      y:
        458,

      w:
        53,

      h:
        41,

      src:
        getWeatherIconSrc(3)

    }
  )


// ========================================================
// TEMPERATURA
//
// La temperatura queda inmediatamente después
// del icono meteorológico.
//
// Posición:
//
// ☀ 18°C
//
// ========================================================

const temperatureY =
  463


this.temperatureDigitWidgets = [

  // --------------------------------------------------------
  // PRIMER SLOT
  // --------------------------------------------------------

  hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x:
        220,

      y:
        temperatureY,

      w:
        22,

      h:
        30,

      src:
        'numbers/null.png'
    }
  ),


  // --------------------------------------------------------
  // SEGUNDO SLOT
  // --------------------------------------------------------

  hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x:
        244,

      y:
        temperatureY,

      w:
        22,

      h:
        30,

      src:
        'numbers/null.png'
    }
  ),


  // --------------------------------------------------------
  // TERCER SLOT
  //
  // Necesario para temperaturas como:
  // -12
  // --------------------------------------------------------

  hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x:
        268,

      y:
        temperatureY,

      w:
        22,

      h:
        30,

      src:
        'numbers/null.png'
    }
  )

]


// ========================================================
// SÍMBOLO DE GRADOS
// ========================================================

hmUI.createWidget(
  hmUI.widget.IMG,
  {

    x:
      292,

    y:
      temperatureY,

    w:
      22,

    h:
      30,

    src:
      'numbers/degree.png'

  }
)


// ========================================================
// UNIDAD CELSIUS
//
// Se retira: solo se muestran los dígitos y el símbolo
// de grados.
// ========================================================

    // ========================================================
    // ACTUALIZAR CLIMA INMEDIATAMENTE
    // ========================================================

    this.updateWeather()


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
    // INFORMACIÓN DE IDIOMA
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
    //
    // Cada 5 minutos.
    // ========================================================

    this.weatherTimer =
      setInterval(
        () =>
          this.updateWeather(),
        5 * 60 * 1000
      )
  },


  // ==========================================================
  // ACTUALIZAR RELOJ
  // ==========================================================

  updateClock() {

    const time =
      new Time()


    const currentClock =
      twoDigits(
        time.getHours()
      ) +
      twoDigits(
        time.getMinutes()
      )


    if (
      currentClock ===
      this.displayedClock
    ) {

      return
    }


    this.displayedClock =
      currentClock


    for (
      let i = 0;
      i < this.clockWidgets.length;
      i++
    ) {

      this.clockWidgets[i].setProperty(
        hmUI.prop.MORE,
        {
          src:
            'digits/clock/' +
            currentClock[i] +
            '.png'
        }
      )
    }
  },


  // ==========================================================
  // LEER FRECUENCIA CARDIACA
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


  // ==========================================================
  // LEER PASOS
  // ==========================================================

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


  // ==========================================================
  // LEER BATERÍA
  // ==========================================================

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


  // ==========================================================
  // ACTUALIZAR CLIMA
  // ==========================================================

  updateWeather() {

    if (
      this.weatherSensor === null ||
      this.weatherIconWidget === null
    ) {

      return
    }


    try {

      // ------------------------------------------------------
      // OBTENER PRONÓSTICO
      // ------------------------------------------------------

      const forecast =
        this.weatherSensor
          .getForecastWeather()


      const today =
        forecast
          .forecastData
          .data[0]


      // ------------------------------------------------------
      // ACTUALIZAR ICONO
      // ------------------------------------------------------

      this.weatherIconWidget.setProperty(

        hmUI.prop.MORE,

        {
          src:
            getWeatherIconSrc(
              today.index
            )
        }

      )


      // ------------------------------------------------------
      // OBTENER TEMPERATURA
      //
      // Conservamos today.high porque es el valor que
      // actualmente expone y funciona en nuestra integración.
      // ------------------------------------------------------

      const displayTemperature =
        celsiusToDisplayTemperature(
          today.high
        )


      // ------------------------------------------------------
      // CREAR SLOTS
      // ------------------------------------------------------

      const slots =
        getTemperatureSlots(
          displayTemperature
        )


      // ------------------------------------------------------
      // ACTUALIZAR LOS TRES DÍGITOS
      // ------------------------------------------------------

      for (
        let i = 0;
        i < this.temperatureDigitWidgets.length;
        i++
      ) {

        const character =
          slots[i] || ' '


        this.temperatureDigitWidgets[i]
          .setProperty(

            hmUI.prop.MORE,

            {
              src:
                getTemperatureCharSrc(
                  character
                )
            }

          )
      }


      // ------------------------------------------------------
      // LOG
      // ------------------------------------------------------

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
  // ACTUALIZAR VALORES DE SENSORES
  // ==========================================================

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
  // DESTRUCCIÓN
  // ==========================================================

  onDestroy() {

    // --------------------------------------------------------
    // RELOJ
    // --------------------------------------------------------

    if (
      this.clockTimer !==
      null
    ) {

      clearInterval(
        this.clockTimer
      )

      this.clockTimer =
        null
    }


    // --------------------------------------------------------
    // ESTRELLAS
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // SENSORES
    // --------------------------------------------------------

    if (
      this.sensorTimer !==
      null
    ) {

      clearInterval(
        this.sensorTimer
      )

      this.sensorTimer =
        null
    }


    // --------------------------------------------------------
    // CLIMA
    // --------------------------------------------------------

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
      'SaganMoon: cerrando watchface'
    )
  }

})