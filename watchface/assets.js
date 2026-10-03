// RUTAS DE ASSETS

export function getClockDigitPath(digit) {
  return 'digits/clock/' + digit + '.png'
}

export function getNumberPath(digit) {
  return 'numbers/' + digit + '.png'
}

export function getLetterPath(letter) {
  return 'letters/' + letter + '.png'
}

export function getMoonPath(number) {
  return (
    'moon/moon_' +
    String(number).padStart(2, '0') +
    '.png'
  )
}

export function getWeatherPath(name) {
  return 'icons/weather_' + name + '.png'
}