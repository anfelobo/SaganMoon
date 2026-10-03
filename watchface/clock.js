import * as hmUI from '@zos/ui'

let clockWidgets = []
let clockTimer = null
let lastTime = ''

function twoDigits(value) {
  if (value < 10) return '0' + value
  return '' + value
}

// COLOMBIA UTC-5
function getSystemTime() {
  const now = new Date()
  const colombiaTime = new Date(now.getTime() - (5 * 60 * 60 * 1000))

  return {
    year: colombiaTime.getUTCFullYear(),
    month: colombiaTime.getUTCMonth() + 1,
    day: colombiaTime.getUTCDate(),
    hour: colombiaTime.getUTCHours(),
    minute: colombiaTime.getUTCMinutes(),
    second: colombiaTime.getUTCSeconds()
  }
}

// DIGITOS DEL RELOJ
function createDigit(x, y, digit) {
  return hmUI.createWidget(hmUI.widget.IMG, {
    x: x,
    y: y,
    w: 68,
    h: 92,
    src: 'digits/clock/' + digit + '.png'
  })
}

function updateClockVisual(hour, minute) {
  const time = twoDigits(hour) + twoDigits(minute)

  if (time === lastTime) return

  lastTime = time

  //console.log('SaganMoon CLOCK -> ' + time)

  for (let i = 0; i < 4; i++) {
    const src = 'digits/clock/' + time[i] + '.png'
    clockWidgets[i].setProperty(hmUI.prop.SRC, src)
  }

  //console.log('SaganMoon RELOJ VISUAL -> ' + time)
}

// CREAR RELOJ
export function createClock() {
  //console.log('SaganMoon CLOCK -> creando reloj')

  clockWidgets = []
  lastTime = ''

  clockWidgets.push(createDigit(28, 50, '0'))
  clockWidgets.push(createDigit(96, 50, '0'))
  clockWidgets.push(createDigit(28, 170, '0'))
  clockWidgets.push(createDigit(96, 170, '0'))

  const dateInfo = getCurrentDateInfo()

  updateClockVisual(dateInfo.hour, dateInfo.minute)

  return dateInfo
}

// INICIAR RELOJ
export function startClock(callback) {
  if (clockTimer !== null) {
    clearInterval(clockTimer)
    clockTimer = null
  }

  //console.log('SaganMoon CLOCK -> iniciado')

  let lastDateKey = ''

  const update = () => {
    const dateInfo = getCurrentDateInfo()

    updateClockVisual(dateInfo.hour, dateInfo.minute)

    const dateKey =
      dateInfo.year + '-' +
      dateInfo.month + '-' +
      dateInfo.day

    if (dateKey !== lastDateKey) {
      lastDateKey = dateKey

      if (callback) {
        callback(dateInfo)
      }
    }
  }

  update()

  clockTimer = setInterval(update, 1000)
}

// DETENER RELOJ
export function stopClock() {
  if (clockTimer !== null) {
    clearInterval(clockTimer)
    clockTimer = null
    //console.log('SaganMoon CLOCK -> detenido')
  }
}

// OBTENER FECHA Y HORA
export function getCurrentDateInfo() {
  const dateInfo = getSystemTime()

  const weekDay = new Date(
    Date.UTC(
      dateInfo.year,
      dateInfo.month - 1,
      dateInfo.day
    )
  ).getUTCDay()

  return {
    year: dateInfo.year,
    month: dateInfo.month,
    day: dateInfo.day,
    hour: dateInfo.hour,
    minute: dateInfo.minute,
    second: dateInfo.second,
    weekDay: weekDay
  }
}