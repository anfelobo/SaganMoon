
// ============================================================
// SAGANMOON - CLOCK
// ============================================================

import * as hmUI from '@zos/ui'
import { Time } from '@zos/sensor'

let timeSensor = null
let clockWidgets = []
let clockTimer = null
let displayedClock = ''

function twoDigits(value) {
  if (value < 10) {
    return '0' + value
  }

  return '' + value
}

function readTime() {
  if (timeSensor !== null) {
    try {
      return {
        year: timeSensor.getFullYear(),
        month: timeSensor.getMonth(),
        day: timeSensor.getDate(),
        hour: timeSensor.getHours(),
        minute: timeSensor.getMinutes(),
        second: timeSensor.getSeconds(),
        weekDay: timeSensor.getDay() % 7
      }
    } catch (error) {
      console.log(
        'SaganMoon CLOCK: ERROR Time = ' +
        error
      )
    }
  }

  const date = new Date()

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    weekDay: date.getDay()
  }
}

function updateClock(onTimeChanged) {
  const dateInfo = readTime()

  const hourText =
    twoDigits(dateInfo.hour)

  const minuteText =
    twoDigits(dateInfo.minute)

  const currentClock =
    hourText +
    minuteText

  console.log(
    'SaganMoon CLOCK: TIME -> ' +
    hourText +
    ':' +
    minuteText +
    ':' +
    twoDigits(dateInfo.second)
  )

  if (
    currentClock !==
    displayedClock
  ) {
    displayedClock =
      currentClock

    console.log(
      'SaganMoon CLOCK: ACTUALIZANDO -> ' +
      currentClock
    )

    for (
      let i = 0;
      i < clockWidgets.length;
      i++
    ) {
      const digit =
        currentClock[i]

      const src =
        'digits/clock/' +
        digit +
        '.png'

      console.log(
        'SaganMoon CLOCK: DIGITO ' +
        i +
        ' -> ' +
        src
      )

      clockWidgets[i].setProperty(
        hmUI.prop.SRC,
        src
      )
    }

    console.log(
      'SaganMoon CLOCK: RELOJ VISUAL -> ' +
      currentClock
    )
  }

  if (
    typeof onTimeChanged ===
    'function'
  ) {
    onTimeChanged(dateInfo)
  }
}

export function createClock() {
  console.log(
    'SaganMoon CLOCK: creando reloj'
  )

  try {
    timeSensor =
      new Time()

    console.log(
      'SaganMoon CLOCK: Time API 2.0 creado'
    )
  } catch (error) {
    timeSensor = null

    console.log(
      'SaganMoon CLOCK: ERROR creando Time = ' +
      error
    )
  }

  const dateInfo =
    readTime()

  const currentHour =
    twoDigits(
      dateInfo.hour
    )

  const currentMinute =
    twoDigits(
      dateInfo.minute
    )

  const currentClock =
    currentHour +
    currentMinute

  displayedClock =
    currentClock

  console.log(
    'SaganMoon CLOCK: HORA INICIAL -> ' +
    currentClock
  )

  clockWidgets = [
    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x: 28,
        y: 50,
        w: 68,
        h: 92,
        src:
          'digits/clock/' +
          currentHour[0] +
          '.png'
      }
    ),

    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x: 96,
        y: 50,
        w: 68,
        h: 92,
        src:
          'digits/clock/' +
          currentHour[1] +
          '.png'
      }
    ),

    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x: 28,
        y: 170,
        w: 68,
        h: 92,
        src:
          'digits/clock/' +
          currentMinute[0] +
          '.png'
      }
    ),

    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x: 96,
        y: 170,
        w: 68,
        h: 92,
        src:
          'digits/clock/' +
          currentMinute[1] +
          '.png'
      }
    )
  ]

  console.log(
    'SaganMoon CLOCK: WIDGETS CREADOS'
  )

  return dateInfo
}

export function startClock(onTimeChanged) {
  if (
    clockTimer !== null
  ) {
    clearInterval(
      clockTimer
    )
  }

  console.log(
    'SaganMoon CLOCK: timer iniciado'
  )

  clockTimer =
    setInterval(
      () => {
        updateClock(
          onTimeChanged
        )
      },
      1000
    )
}

export function stopClock() {
  if (
    clockTimer !== null
  ) {
    clearInterval(
      clockTimer
    )

    clockTimer =
      null
  }

  console.log(
    'SaganMoon CLOCK: timer detenido'
  )

  clockWidgets = []
  timeSensor = null
  displayedClock = ''
}

export function getCurrentDateInfo() {
  return readTime()
}

