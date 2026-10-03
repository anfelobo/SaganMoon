import * as hmUI from '@zos/ui'
import * as hmSensor from '@zos/sensor'

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

let weatherSensor = null
let weatherIconWidget = null
let temperatureDigitWidgets = []

function getWeatherIconSrc(index) {
  const name =
    WEATHER_ICON_BY_INDEX[index] || 'cloud'

  return (
    'icons/weather_' +
    name +
    '.png'
  )
}

function getTemperatureSlots(value) {
  const text = '' + value

  if (text.length >= 3) {
    return [
      text[text.length - 3],
      text[text.length - 2],
      text[text.length - 1]
    ]
  }

  if (text.length === 1) {
    return [' ', ' ', text]
  }

  return [' ', text[0], text[1]]
}

function getTemperatureCharSrc(character) {
  if (character === '-') {
    return 'letters/MINUS.png'
  }

  if (character === ' ') {
    return 'numbers/null.png'
  }

  return 'numbers/' + character + '.png'
}

export function createWeather() {
  try {
    weatherSensor =
      hmSensor.createSensor(
        hmSensor.id.WEATHER
      )
  } catch (error) {
    console.log(
      'SaganMoon WEATHER ERROR SENSOR -> ' +
      error
    )
    return
  }

  weatherIconWidget =
    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x: 340,
        y: 438,
        w: 72,
        h: 56,
        src: getWeatherIconSrc(3)
      }
    )

  temperatureDigitWidgets = [
    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x: 220,
        y: 448,
        w: 22,
        h: 30,
        src: 'numbers/null.png'
      }
    ),

    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x: 244,
        y: 448,
        w: 22,
        h: 30,
        src: 'numbers/null.png'
      }
    ),

    hmUI.createWidget(
      hmUI.widget.IMG,
      {
        x: 268,
        y: 448,
        w: 22,
        h: 30,
        src: 'numbers/null.png'
      }
    )
  ]

  hmUI.createWidget(
    hmUI.widget.IMG,
    {
      x: 292,
      y: 448,
      w: 22,
      h: 30,
      src: 'numbers/degree.png'
    }
  )
}

export function updateWeather() {
  if (
    weatherSensor === null ||
    weatherIconWidget === null
  ) {
    return
  }

  try {
    const forecast =
      weatherSensor.getForecastWeather()

    console.log(
      'SaganMoon WEATHER forecast=' +
      JSON.stringify(forecast)
    )

    if (
      !forecast ||
      !forecast.forecastData ||
      !forecast.forecastData.data ||
      !forecast.forecastData.data[0]
    ) {
      console.log(
        'SaganMoon WEATHER: sin datos'
      )
      return
    }

    const today =
      forecast.forecastData.data[0]

    console.log(
      'SaganMoon WEATHER raw index=' +
      today.index +
      ' high=' +
      today.high +
      ' low=' +
      today.low
    )

    weatherIconWidget.setProperty(
      hmUI.prop.SRC,
      getWeatherIconSrc(today.index)
    )

    const displayTemperature =
      Math.round(today.high)

    const slots =
      getTemperatureSlots(
        displayTemperature
      )

    for (
      let i = 0;
      i < temperatureDigitWidgets.length;
      i++
    ) {
      temperatureDigitWidgets[i]
        .setProperty(
          hmUI.prop.SRC,
          getTemperatureCharSrc(
            slots[i] || ' '
          )
        )
    }

    console.log(
      'SaganMoon WEATHER -> index=' +
      today.index +
      ' temp=' +
      displayTemperature
    )
  } catch (error) {
    console.log(
      'SaganMoon WEATHER ERROR -> ' +
      error
    )
  }
}

export function getWeatherSensor() {
  return weatherSensor
}

export function destroyWeather() {
  weatherSensor = null
  weatherIconWidget = null
  temperatureDigitWidgets = []
}