// ============================================================
// SAGANMOON - Amazfit Bip Max
// Versión 1.4 estable
//
// DISEÑO
// ------------------------------------------------------------
// • Hora grande blanca y gruesa
// • Luna 150x150
// • Iluminación blanca y gruesa
// • Estrellas irregulares y dinámicas
// • BPM / pasos / batería dorados y gruesos
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

const MOON_IMAGE_COUNT = 21

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


  const imageNumber =
    Math.floor(
      angle / (360 / MOON_IMAGE_COUNT)
    ) + 1


  if (imageNumber < 1) {
    return 1
  }


  if (
    imageNumber >
    MOON_IMAGE_COUNT
  ) {

    return MOON_IMAGE_COUNT
  }


  return imageNumber
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


function getPhaseLabel(phaseName) {

  if (!isSpanish()) {
    return phaseName
  }

  const phaseLabels = {
    'New Moon': 'Luna nueva',
    'Waxing Crescent': 'Creciente',
    'First Quarter': 'Cuarto creciente',
    'Waxing Gibbous': 'Gibosa creciente',
    'Full Moon': 'Luna llena',
    'Waning Gibbous': 'Gibosa menguante',
    'Last Quarter': 'Cuarto menguante',
    'Waning Crescent': 'Menguante'
  }

  return phaseLabels[phaseName] || phaseName
}


// ============================================================
// TEXTO GRUESO
//
// Zepp OS no ofrece una propiedad "bold" en TEXT.
// Para conseguir un aspecto más grueso utilizamos varias
// capas del MISMO color, desplazadas 1 px.
//
// No es un efecto neon.
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
      font_array: SENSOR_NUMBER_IMAGES,
      h_space: 0,
      align_h: hmUI.align.CENTER_H,
      invalid_image: 'numbers/null.png',
      max_value: options.maxValue
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
      src: 'icons/' + options.name + '.png'
    }
  )
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


function createNeonText(options) {

  createBoldText({
    x: options.x + 2,
    y: options.y + 2,
    w: options.w,
    h: options.h,
    text: options.text,
    textSize: options.textSize,
    color: DARK_CYAN,
    align: options.align
  })

  return createBoldText({
    x: options.x,
    y: options.y,
    w: options.w,
    h: options.h,
    text: options.text,
    textSize: options.textSize,
    color: NEON_CYAN,
    align: options.align
  })
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
// INICIO
// ============================================================

WatchFace({

  // ==========================================================
  // VARIABLES
  // ==========================================================

  starWidgets: [],

  starTimer: null,

  sensorTimer: null,

  heartRateSensor: null,

  stepSensor: null,

  batterySensor: null,

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

    if (typeof hmSensor !== 'undefined') {

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
    //
    // BLANCO / GRUESO
    // Se conserva exactamente el tamaño de la versión 1.3.
    // ========================================================

    createDigitalDigit({
      x: 28,
      y: 70,
      w: 68,
      h: 92,
      path: 'digits/clock',
      digit: currentHour[0]
    })

    createDigitalDigit({
      x: 96,
      y: 70,
      w: 68,
      h: 92,
      path: 'digits/clock',
      digit: currentHour[1]
    })


    // ========================================================
    // MINUTOS
    //
    // BLANCO / GRUESO
    // ========================================================

    createDigitalDigit({
      x: 28,
      y: 190,
      w: 68,
      h: 92,
      path: 'digits/clock',
      digit: currentMinute[0]
    })

    createDigitalDigit({
      x: 96,
      y: 190,
      w: 68,
      h: 92,
      path: 'digits/clock',
      digit: currentMinute[1]
    })


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


    createDigitalDigit({
      x: 122,
      y: 460,
      w: 22,
      h: 30,
      path: 'numbers',
      digit: twoDigits(day)[0]
    })

    createDigitalDigit({
      x: 146,
      y: 460,
      w: 22,
      h: 30,
      path: 'numbers',
      digit: twoDigits(day)[1]
    })

    createNeonText({
      x: 170,
      y: 460,
      w: 12,
      h: 30,
      text: '/',
      textSize: 16,
      align: hmUI.align.CENTER_H
    })

    createDigitalDigit({
      x: 184,
      y: 460,
      w: 22,
      h: 30,
      path: 'numbers',
      digit: twoDigits(month)[0]
    })

    createDigitalDigit({
      x: 208,
      y: 460,
      w: 22,
      h: 30,
      path: 'numbers',
      digit: twoDigits(month)[1]
    })

    createNeonText({
      x: 236,
      y: 460,
      w: 100,
      h: 29,
      text: weekDay,
      textSize: 29,
      align: hmUI.align.LEFT
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


    let illumination = 0

    let phaseName =
      'Sin datos'

    let phaseAngle = 0

    let isWaxing = false


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
    // PORCENTAJE
    //
    // BLANCO / GRUESO
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

    const moonX = 290

    const moonY = 165

    const moonSize = 500


    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x:
          moonX - moonSize / 2,

        y:
          moonY - moonSize / 2,

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
    //
    // BLANCO / GRUESO
    // ========================================================

    createNeonText({

      x: 350,

      y: 280,

      w: 55,

      h: 34,

      text:
        phasePercent + '%',

      textSize:
        20,

      align:
        hmUI.align.CENTER_H

    })

    createNeonText({
      x: 155,
      y: 280,
      w: 205,
      h: 34,
      text: getPhaseLabel(phaseName).toUpperCase(),
      textSize: 18,
      align: hmUI.align.CENTER_H
    })


    // ========================================================
    // ETIQUETAS
    // ========================================================

    const labels =
      getLabels()


    // ========================================================
    // VALORES INICIALES
    // ========================================================

    // ========================================================
    // POSICIÓN DE LOS INDICADORES
    // ========================================================

    const valueY = 365

    const labelY = 410


    // ========================================================
    // FRECUENCIA CARDIACA
    //
    // DORADO / GRUESO
    // ========================================================

    this.heartValueWidget =
      createSensorText({

        x: 5,

        y: valueY,

        w: 130,

        h: 42,

        type: hmUI.data_type.HEART,

        maxValue: SENSOR_LIMITS.heart

      })


    createSensorIcon({

      x: 52,

      y: labelY - 2,

      name: 'heart'

    })


    // ========================================================
    // PASOS
    //
    // DORADO / GRUESO
    // ========================================================

    this.stepValueWidget =
      createSensorText({

        x: 145,

        y: valueY,

        w: 140,

        h: 42,

        type: hmUI.data_type.STEP,

        maxValue: SENSOR_LIMITS.steps

      })


    createSensorIcon({

      x: 197,

      y: labelY - 2,

      name: 'steps'

    })


    // ========================================================
    // BATERÍA
    //
    // DORADO / GRUESO
    // ========================================================

    this.batteryValueWidget =
      createSensorText({

        x: 290,

        y: valueY,

        w: 137,

        h: 42,

        type: hmUI.data_type.BATTERY,

        maxValue: SENSOR_LIMITS.battery

      })


    createSensorIcon({

      x: 340,

      y: labelY - 2,

      name: 'battery'

    })

    createGoldText({

      x: 400,

      y: valueY,

      w: 25,

      h: 42,

      text: '%',

      textSize: 20,

      align: hmUI.align.CENTER_H

    })


    // ========================================================
    // ESTRELLAS
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


    console.log(
      'SaganMoon: idioma = ' +
      (
        isSpanish()
          ? 'ES'
          : 'EN'
      )
    )
  },


  readHeartRate() {

    if (this.heartRateSensor === null) {
      return '--'
    }

    try {

      const value =
        this.heartRateSensor.last

      return value && value > 0 ? value : '--'

    } catch (error) {

      console.log(
        'SaganMoon: ERROR FRECUENCIA = ' +
        error
      )

      return '--'
    }
  },


  readSteps() {

    if (this.stepSensor === null) {
      return '--'
    }

    try {

      const value =
        this.stepSensor.current

      return value !== undefined && value >= 0 ? value : '--'

    } catch (error) {

      console.log(
        'SaganMoon: ERROR PASOS = ' +
        error
      )

      return '--'
    }
  },


  readBattery() {

    if (this.batterySensor === null) {
      return '--'
    }

    try {

      const value =
        this.batterySensor.current

      return value !== undefined && value >= 0 ? value : '--'

    } catch (error) {

      console.log(
        'SaganMoon: ERROR BATERIA = ' +
        error
      )

      return '--'
    }
  },


  updateSensorValues() {

    const heartValue = this.readHeartRate()

    const stepValue = this.readSteps()

    const batteryValue = this.readBattery()

    if (this.heartValueWidget !== null) {
      this.heartValueWidget.setProperty(
        hmUI.prop.TEXT,
        '' + heartValue
      )
    }

    if (this.stepValueWidget !== null) {
      this.stepValueWidget.setProperty(
        hmUI.prop.TEXT,
        '' + stepValue
      )
    }

    if (this.batteryValueWidget !== null) {
      this.batteryValueWidget.setProperty(
        hmUI.prop.TEXT,
        '' + batteryValue + '%'
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

    if (
      this.starTimer !== null
    ) {

      clearInterval(
        this.starTimer
      )

      this.starTimer =
        null
    }

    if (
      this.sensorTimer !== null
    ) {

      clearInterval(
        this.sensorTimer
      )

      this.sensorTimer =
        null
    }


    console.log(
      'SaganMoon: cerrando watchface'
    )
  }

})