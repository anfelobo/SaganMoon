import * as hmUI from '@zos/ui'
import * as hmSensor from '@zos/sensor'

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

let heartRateSensor = null
let stepSensor = null
let batterySensor = null

let heartValueWidget = null
let stepValueWidget = null
let batteryValueWidget = null

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

export function createSensors() {
  if (typeof hmSensor === 'undefined') {
    console.log(
      'SaganMoon SENSORS: hmSensor no disponible'
    )
    return
  }

  try {
    heartRateSensor =
      hmSensor.createSensor(
        hmSensor.id.HEART
      )

    stepSensor =
      hmSensor.createSensor(
        hmSensor.id.STEP
      )

    batterySensor =
      hmSensor.createSensor(
        hmSensor.id.BATTERY
      )

    heartValueWidget =
      createSensorText({
        x: 46,
        y: 355,
        w: 90,
        h: 42,
        type: hmUI.data_type.HEART,
        maxValue: SENSOR_LIMITS.heart
      })

    createSensorIcon({
      x: 73,
      y: 390,
      name: 'heart'
    })

    stepValueWidget =
      createSensorText({
        x: 136,
        y: 355,
        w: 160,
        h: 42,
        type: hmUI.data_type.STEP,
        maxValue: SENSOR_LIMITS.steps
      })

    createSensorIcon({
      x: 198,
      y: 390,
      name: 'steps'
    })

    batteryValueWidget =
      createSensorText({
        x: 296,
        y: 355,
        w: 90,
        h: 42,
        type: hmUI.data_type.BATTERY,
        maxValue: SENSOR_LIMITS.battery
      })

    createSensorIcon({
      x: 323,
      y: 390,
      name: 'battery'
    })

    console.log(
      'SaganMoon SENSORS: sensores creados'
    )
  } catch (error) {
    console.log(
      'SaganMoon SENSORS ERROR -> ' +
      error
    )
  }
}

function readHeartRate() {
  if (heartRateSensor === null) {
    return '--'
  }

  try {
    const value = heartRateSensor.last

    return value && value > 0
      ? value
      : '--'
  } catch (error) {
    return '--'
  }
}

function readSteps() {
  if (stepSensor === null) {
    return '--'
  }

  try {
    const value = stepSensor.current

    return value !== undefined && value >= 0
      ? value
      : '--'
  } catch (error) {
    return '--'
  }
}

function readBattery() {
  if (batterySensor === null) {
    return '--'
  }

  try {
    const value = batterySensor.current

    return value !== undefined && value >= 0
      ? value
      : '--'
  } catch (error) {
    return '--'
  }
}

export function updateSensors() {
  const heartValue = readHeartRate()
  const stepValue = readSteps()
  const batteryValue = readBattery()

  if (heartValueWidget !== null) {
    heartValueWidget.setProperty(
      hmUI.prop.TEXT,
      '' + heartValue
    )
  }

  if (stepValueWidget !== null) {
    stepValueWidget.setProperty(
      hmUI.prop.TEXT,
      '' + stepValue
    )
  }

  if (batteryValueWidget !== null) {
    batteryValueWidget.setProperty(
      hmUI.prop.TEXT,
      '' + batteryValue + '%'
    )
  }

  console.log(
    'SaganMoon SENSORS -> HR=' +
    heartValue +
    ' STEP=' +
    stepValue +
    ' BAT=' +
    batteryValue
  )
}

export function getWeatherSensor() {
  return null
}

export function destroySensors() {
  heartRateSensor = null
  stepSensor = null
  batterySensor = null
  heartValueWidget = null
  stepValueWidget = null
  batteryValueWidget = null
}