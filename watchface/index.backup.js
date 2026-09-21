// ============================================================
// SAGANMOON - Amazfit Bip Max
// Versión 1.4
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
import { Time, HeartRate, Step, Battery } from '@zos/sensor'
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

Page({

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
        x: 0,
        y: 0,

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
    //
    // BLANCO / GRUESO
    // Se conserva exactamente el tamaño de la versión 1.3.
    // ========================================================

    createBoldText({

      x: 10,

      y: 112,

      w: 195,

      h: 115,

      text:
        currentHour,

      textSize:
        105,

      color:
        WHITE,

      align:
        hmUI.align.CENTER_H

    })


    // ========================================================
    // MINUTOS
    //
    // BLANCO / GRUESO
    // ========================================================

    createBoldText({

      x: 10,

      y: 214,

      w: 195,

      h: 110,

      text:
        currentMinute,

      textSize:
        96,

      color:
        WHITE,

      align:
        hmUI.align.CENTER_H

    })


    // ========================================================
    // LÍNEA DORADA
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x: 42,
        y: 330,

        w: 135,
        h: 2,

        color:
          GOLD
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


    const currentDateText =
      twoDigits(day) +
      '/' +
      twoDigits(month) +
      ' ' +
      weekDay


    createGoldText({

      x: 25,

      y: 463,

      w: 382,

      h: 38,

      text:
        currentDateText,

      textSize:
        20,

      align:
        hmUI.align.CENTER_H

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

    const moonX = 300

    const moonY = 225


    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x:
          moonX - 75,

        y:
          moonY - 75,

        w:
          150,

        h:
          150,

        src:
          moonImagePath
      }
    )


    // ========================================================
    // ILUMINACIÓN
    //
    // BLANCO / GRUESO
    // ========================================================

    createBoldText({

      x: 355,

      y: 205,

      w: 72,

      h: 65,

      text:
        phasePercent + '%',

      textSize:
        22,

      color:
        WHITE,

      align:
        hmUI.align.CENTER_H

    })


    // ========================================================
    // SENSORES
    //
    // ESTA PARTE SE CONSERVA DE LA VERSIÓN 1.3.
    // No estamos cambiando todavía la arquitectura.
    // ========================================================
console.log('SaganMoon: SENSOR HR = ' + this.heartRateSensor)
console.log('SaganMoon: SENSOR STEP = ' + this.stepSensor)
console.log('SaganMoon: SENSOR BAT = ' + this.batterySensor)

console.log('SaganMoon: DATA HEART = ' + hmUI.data_type.HEART)
console.log('SaganMoon: DATA STEP = ' + hmUI.data_type.STEP)
console.log('SaganMoon: DATA BATTERY = ' + hmUI.data_type.BATTERY)

    // ========================================================
    // ETIQUETAS
    // ========================================================

    const labels =
      getLabels()


    // ========================================================
    // VALORES INICIALES
    // ========================================================

    let heartValue = 0

    let stepValue = 0

    let batteryValue = 0


    try {

      heartValue =
        this.heartRateSensor.getLast()

    } catch (error) {

      console.log(
        'SaganMoon: ERROR FRECUENCIA = ' +
        error
      )
    }


    try {

      stepValue =
        this.stepSensor.getCurrent()

    } catch (error) {

      console.log(
        'SaganMoon: ERROR PASOS = ' +
        error
      )
    }


    try {

      batteryValue =
        this.batterySensor.getCurrent()

    } catch (error) {

      console.log(
        'SaganMoon: ERROR BATERIA = ' +
        error
      )
    }


    // ========================================================
    // NORMALIZAR VALORES
    // ========================================================

    if (
      !heartValue ||
      heartValue < 1
    ) {

      heartValue = '--'
    }


    if (
      !stepValue ||
      stepValue < 0
    ) {

      stepValue = '--'
    }


    if (
      !batteryValue ||
      batteryValue < 0
    ) {

      batteryValue = '--'
    }


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
      createGoldText({

        x: 5,

        y: valueY,

        w: 130,

        h: 42,

        text:
          '' + heartValue,

        textSize:
          27,

        align:
          hmUI.align.CENTER_H

      })


    createGoldText({

      x: 5,

      y: labelY,

      w: 130,

      h: 25,

      text:
        labels.heart,

      textSize:
        13,

      align:
        hmUI.align.CENTER_H

    })


    // ========================================================
    // PASOS
    //
    // DORADO / GRUESO
    // ========================================================

    this.stepValueWidget =
      createGoldText({

        x: 145,

        y: valueY,

        w: 140,

        h: 42,

        text:
          '' + stepValue,

        textSize:
          27,

        align:
          hmUI.align.CENTER_H

      })


    createGoldText({

      x: 145,

      y: labelY,

      w: 140,

      h: 25,

      text:
        labels.steps,

      textSize:
        13,

      align:
        hmUI.align.CENTER_H

    })


    // ========================================================
    // BATERÍA
    //
    // DORADO / GRUESO
    // ========================================================

    this.batteryValueWidget =
      createGoldText({

        x: 290,

        y: valueY,

        w: 137,

        h: 42,

        text:
          '' +
          batteryValue +
          '%',

        textSize:
          27,

        align:
          hmUI.align.CENTER_H

      })


    createGoldText({

      x: 290,

      y: labelY,

      w: 137,

      h: 25,

      text:
        labels.battery,

      textSize:
        13,

      align:
        hmUI.align.CENTER_H

    })


    // ========================================================
    // ACTUALIZACIÓN DE SENSORES
    //
    // Cada 30 segundos.
    // ========================================================

    this.sensorTimer =
      setInterval(
        () => {

          this.updateSensorValues()

        },
        30000
      )


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
      'SaganMoon: sensores activados'
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


  // ==========================================================
  // ACTUALIZAR SENSORES
  // ==========================================================

  updateSensorValues() {

    let heartValue = 0

    let stepValue = 0

    let batteryValue = 0


    try {

      heartValue =
        this.heartRateSensor.getLast()

    } catch (error) {

      heartValue = 0
    }


    try {

      stepValue =
        this.stepSensor.getCurrent()

    } catch (error) {

      stepValue = 0
    }


    try {

      batteryValue =
        this.batterySensor.getCurrent()

    } catch (error) {

      batteryValue = 0
    }


    if (
      !heartValue ||
      heartValue < 1
    ) {

      heartValue = '--'
    }


    if (
      stepValue < 0 ||
      stepValue === undefined
    ) {

      stepValue = '--'
    }


    if (
      batteryValue < 0 ||
      batteryValue === undefined
    ) {

      batteryValue = '--'
    }


    if (
      this.heartValueWidget !== null
    ) {

      this.heartValueWidget.setProperty(
        hmUI.prop.TEXT,
        '' + heartValue
      )
    }


    if (
      this.stepValueWidget !== null
    ) {

      this.stepValueWidget.setProperty(
        hmUI.prop.TEXT,
        '' + stepValue
      )
    }


    if (
      this.batteryValueWidget !== null
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