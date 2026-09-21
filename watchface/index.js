// ============================================================
// SAGANMOON - Amazfit Bip Max
// Paso 7: Cálculo dinámico de la fase lunar
//
// Este archivo:
// 1. Crea el fondo negro.
// 2. Dibuja las estrellas.
// 3. Muestra la hora.
// 4. Muestra la fecha.
// 5. Calcula la fase lunar usando fecha y hora actuales.
// 6. Dibuja la Luna según el porcentaje calculado.
// 7. Muestra el porcentaje de iluminación.
// ============================================================

import * as hmUI from '@zos/ui'
import { Time } from '@zos/sensor'


// ============================================================
// CONFIGURACIÓN DE PANTALLA
// ============================================================

const SCREEN_WIDTH = 432
const SCREEN_HEIGHT = 514


// ============================================================
// CÁLCULO DE LA FASE LUNAR
//
// Utilizamos una luna nueva conocida como referencia y el
// período sinódico medio de la Luna.
//
// El resultado está entre 0.0 y 1.0:
//
// 0.00 = Luna nueva
// 0.25 = Cuarto creciente
// 0.50 = Luna llena
// 0.75 = Cuarto menguante
// ============================================================

function getMoonPhase(date) {

  // Luna nueva de referencia.
  const knownNewMoon = new Date('2000-01-06T18:14:00Z')

  // Duración media del ciclo lunar en días.
  const lunarCycle = 29.530588853

  // Diferencia entre la fecha actual y la referencia.
  const difference =
    date.getTime() - knownNewMoon.getTime()

  // Convertimos milisegundos a días.
  const days =
    difference / 86400000

  // Calculamos cuántos ciclos lunares han transcurrido.
  const cycles =
    days / lunarCycle

  // Nos quedamos únicamente con la parte decimal.
  let phase =
    cycles - Math.floor(cycles)

  // Protección para fechas anteriores a la referencia.
  if (phase < 0) {
    phase += 1
  }

  return phase
}


// ============================================================
// PORCENTAJE DE ILUMINACIÓN
//
// La iluminación depende del ángulo de fase.
//
// Luna nueva  -> 0%
// Cuarto      -> 50%
// Luna llena  -> 100%
// ============================================================

function getIllumination(phase) {

  const illumination =
    (1 - Math.cos(phase * 2 * Math.PI)) / 2

  return illumination
}


// ============================================================
// NOMBRE DE LA FASE
// ============================================================

function getMoonPhaseName(phase) {

  if (phase < 0.0625) {
    return 'Luna nueva'
  }

  if (phase < 0.1875) {
    return 'Creciente'
  }

  if (phase < 0.3125) {
    return 'Cuarto creciente'
  }

  if (phase < 0.4375) {
    return 'Gibosa creciente'
  }

  if (phase < 0.5625) {
    return 'Luna llena'
  }

  if (phase < 0.6875) {
    return 'Gibosa menguante'
  }

  if (phase < 0.8125) {
    return 'Cuarto menguante'
  }

  if (phase < 0.9375) {
    return 'Menguante'
  }

  return 'Luna nueva'
}


// ============================================================
// FORMATO DE DOS DÍGITOS
//
// Convierte:
// 7  -> 07
// 9  -> 09
// 12 -> 12
// ============================================================

function twoDigits(value) {

  if (value < 10) {
    return '0' + value
  }

  return '' + value
}


// ============================================================
// INICIO DEL WATCHFACE
// ============================================================

Page({

  // ==========================================================
  // INICIALIZACIÓN
  // ==========================================================

  onInit() {

    console.log(
      'SaganMoon: iniciando watchface'
    )
  },


  // ==========================================================
  // CONSTRUCCIÓN DE LA INTERFAZ
  // ==========================================================

  build() {

    console.log(
      'SaganMoon: construyendo SaganMoon'
    )


    // ========================================================
    // FONDO NEGRO
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.FILL_RECT,
      {
        x: 0,
        y: 0,
        w: SCREEN_WIDTH,
        h: SCREEN_HEIGHT,
        color: 0x000000
      }
    )


    // ========================================================
    // ESTRELLAS
    //
    // Son posiciones fijas para esta primera versión.
    // Más adelante podemos hacer que algunas tengan
    // diferentes intensidades o incluso parpadeen.
    // ========================================================

    const stars = [

      { x: 35,  y: 55,  size: 2 },
      { x: 92,  y: 38,  size: 3 },
      { x: 155, y: 78,  size: 2 },
      { x: 225, y: 45,  size: 2 },
      { x: 305, y: 72,  size: 3 },
      { x: 385, y: 42,  size: 2 },

      { x: 58,  y: 145, size: 2 },
      { x: 130, y: 125, size: 2 },
      { x: 190, y: 165, size: 3 },
      { x: 270, y: 130, size: 2 },
      { x: 350, y: 155, size: 2 },
      { x: 410, y: 115, size: 3 },

      { x: 25,  y: 230, size: 2 },
      { x: 105, y: 210, size: 3 },
      { x: 175, y: 250, size: 2 },
      { x: 245, y: 220, size: 2 },
      { x: 325, y: 245, size: 3 },
      { x: 395, y: 205, size: 2 },

      { x: 45,  y: 315, size: 3 },
      { x: 120, y: 345, size: 2 },
      { x: 205, y: 300, size: 2 },
      { x: 285, y: 335, size: 3 },
      { x: 365, y: 310, size: 2 },

      { x: 75,  y: 410, size: 2 },
      { x: 155, y: 445, size: 3 },
      { x: 235, y: 395, size: 2 },
      { x: 315, y: 430, size: 2 },
      { x: 390, y: 390, size: 3 },

      { x: 35,  y: 485, size: 2 },
      { x: 105, y: 470, size: 2 },
      { x: 190, y: 490, size: 2 },
      { x: 275, y: 475, size: 3 },
      { x: 355, y: 495, size: 2 }
    ]


    // ========================================================
    // CREAR ESTRELLAS
    // ========================================================

    for (let i = 0; i < stars.length; i++) {

      const star = stars[i]

      hmUI.createWidget(
        hmUI.widget.CIRCLE,
        {
          center_x: star.x,
          center_y: star.y,
          radius: star.size,
          color: 0xFFFFFF
        }
      )
    }


    // ========================================================
    // OBTENER FECHA Y HORA ACTUALES
    // ========================================================

    const time = new Time()

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


    // ========================================================
    // MOSTRAR HORA
    //
    // Por ahora utilizamos TEXT para asegurar compatibilidad
    // con el entorno API 2.0 que estamos usando.
    // ========================================================

    const currentTime =
      twoDigits(hour) +
      ':' +
      twoDigits(minute)


    hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x: 40,
        y: 185,
        w: 352,
        h: 100,

        text: currentTime,

        text_size: 72,

        color: 0xFFFFFF,

        align_h: hmUI.align.CENTER_H,

        align_v: hmUI.align.CENTER_V
      }
    )


    // ========================================================
    // MOSTRAR FECHA
    // ========================================================

    const monthNames = [

      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC'
    ]


    const currentDateText =
      twoDigits(day) +
      ' ' +
      monthNames[month - 1] +
      ' ' +
      year


    hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x: 60,
        y: 290,
        w: 312,
        h: 45,

        text: currentDateText,

        text_size: 24,

        color: 0xD4AF37,

        align_h: hmUI.align.CENTER_H,

        align_v: hmUI.align.CENTER_V
      }
    )


    // ========================================================
    // CREAR OBJETO DATE
    //
    // Incluimos ahora hora y minutos.
    // Esto es importante porque la fase cambia continuamente.
    // ========================================================

    const currentDate =
      new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        0
      )


    // ========================================================
    // CALCULAR FASE LUNAR
    // ========================================================

    const phase =
      getMoonPhase(currentDate)


    // ========================================================
    // CALCULAR ILUMINACIÓN
    // ========================================================

    const illumination =
      getIllumination(phase)


    const phasePercent =
      Math.round(
        illumination * 100
      )


    // ========================================================
    // OBTENER NOMBRE DE LA FASE
    // ========================================================

    const phaseName =
      getMoonPhaseName(phase)


    // ========================================================
    // MOSTRAR INFORMACIÓN EN LA CONSOLA DEL SIMULADOR
    //
    // Esto nos permitirá comprobar que el cálculo coincide
    // aproximadamente con las fuentes astronómicas.
    // ========================================================

    console.log(
      'SaganMoon: fase = ' +
      phasePercent +
      '% - ' +
      phaseName
    )


    console.log(
      'SaganMoon: phase decimal = ' +
      phase
    )


    // ========================================================
    // CONFIGURACIÓN DE LA LUNA
    // ========================================================

    const moonRadius = 45

    const moonX = 216

    const moonY = 395


    // ========================================================
    // DIBUJAR DISCO COMPLETO DE LA LUNA
    //
    // Primero dibujamos toda la Luna en color dorado claro.
    // Después colocamos encima la parte oscura.
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.CIRCLE,
      {
        center_x: moonX,
        center_y: moonY,

        radius: moonRadius,

        color: 0xF5E6A8
      }
    )


    // ========================================================
    // CALCULAR LA SOMBRA
    //
    // La posición de la sombra depende de la fase.
    //
    // Para:
    // 0%   -> Luna nueva
    // 50%  -> cuarto
    // 100% -> Luna llena
    //
    // Esta primera representación es geométrica y sencilla.
    // Más adelante podremos hacer una representación lunar
    // mucho más realista.
    // ========================================================

    let shadowOffset =
      moonRadius *
      (1 - 2 * illumination)


    // ========================================================
    // LIMITAR EL DESPLAZAMIENTO
    //
    // Evita que la sombra pueda salir de los límites
    // esperados del disco lunar.
    // ========================================================

    if (shadowOffset > moonRadius) {

      shadowOffset =
        moonRadius
    }

    if (shadowOffset < -moonRadius) {

      shadowOffset =
        -moonRadius
    }


    // ========================================================
    // DIBUJAR SOMBRA
    //
    // Utilizamos un círculo negro desplazado para producir
    // una representación sencilla de la fase.
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.CIRCLE,
      {
        center_x:
          moonX - shadowOffset,

        center_y:
          moonY,

        radius:
          moonRadius,

        color:
          0x000000
      }
    )


    // ========================================================
    // MOSTRAR PORCENTAJE DE ILUMINACIÓN
    // ========================================================

    hmUI.createWidget(
      hmUI.widget.TEXT,
      {
        x: 80,
        y: 450,
        w: 272,
        h: 35,

        text:
          phasePercent + '%',

        text_size: 18,

        color: 0xFFFFFF,

        align_h:
          hmUI.align.CENTER_H,

        align_v:
          hmUI.align.CENTER_V
      }
    )
  },


  // ==========================================================
  // DESTRUCCIÓN DEL WATCHFACE
  // ==========================================================

  onDestroy() {

    console.log(
      'SaganMoon: cerrando watchface'
    )
  }

})