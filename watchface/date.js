import * as hmUI from '@zos/ui'
import { getLanguage } from '@zos/settings'

let dateDayWidgets = []
let dateMonthWidgets = []
let weekDayWidgets = []
let lastDateKey = ''

const DATE_DIGIT_PATH = 'numbers'
const WEEKDAY_PATH_ES = 'phase_labels/ES_'
const WEEKDAY_PATH_EN = 'phase_labels/EN_'

const WEEKDAYS_ES = [
  'DOM',
  'LUN',
  'MAR',
  'MIE',
  'JUE',
  'VIE',
  'SAB'
]

const WEEKDAYS_EN = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT'
]

function twoDigits(value) {
  return String(value).padStart(2, '0')
}

function createDigit(x, y, digit) {
  return hmUI.createWidget(hmUI.widget.IMG, {
    x: x,
    y: y,
    w: 22,
    h: 30,
    src: DATE_DIGIT_PATH + '/' + digit + '.png'
  })
}

function createWeekDay(x, y, letter) {
  const language = getLanguage()
  const prefix = language === 3 ? WEEKDAY_PATH_ES : WEEKDAY_PATH_EN

  return hmUI.createWidget(hmUI.widget.IMG, {
    x: x,
    y: y,
    w: 68,
    h: 92,
    src: prefix + letter + '.png'
  })
}

function getDateInfo(timeData) {
  const now = timeData || new Date()

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    weekday: now.getDay()
  }
}

export function createDate(timeData) {
  const dateInfo = getDateInfo(timeData)

  const day = twoDigits(dateInfo.day)
  const month = twoDigits(dateInfo.month)

  dateDayWidgets = []
  dateMonthWidgets = []
  weekDayWidgets = []

  dateDayWidgets.push(createDigit(220, 448, day[0]))
  dateDayWidgets.push(createDigit(244, 448, day[1]))

  dateMonthWidgets.push(createDigit(268, 448, month[0]))
  dateMonthWidgets.push(createDigit(292, 448, month[1]))

  const weekdays = getLanguage() === 3 ? WEEKDAYS_ES : WEEKDAYS_EN
  const weekday = weekdays[dateInfo.weekday]

  for (let i = 0; i < weekday.length; i++) {
    weekDayWidgets.push(createWeekDay(316 + (i * 22), 448, weekday[i]))
  }

  lastDateKey =
    dateInfo.year + '-' +
    twoDigits(dateInfo.month) + '-' +
    twoDigits(dateInfo.day)

  console.log(
    'SaganMoon DATE -> ' +
    day + '/' +
    month + ' ' +
    weekday
  )
}

export function updateDate(timeData) {
  const dateInfo = getDateInfo(timeData)

  const dateKey =
    dateInfo.year + '-' +
    twoDigits(dateInfo.month) + '-' +
    twoDigits(dateInfo.day)

  if (dateKey === lastDateKey) {
    return
  }

  lastDateKey = dateKey

  const day = twoDigits(dateInfo.day)
  const month = twoDigits(dateInfo.month)

  dateDayWidgets[0].setProperty(
    hmUI.prop.SRC,
    DATE_DIGIT_PATH + '/' + day[0] + '.png'
  )

  dateDayWidgets[1].setProperty(
    hmUI.prop.SRC,
    DATE_DIGIT_PATH + '/' + day[1] + '.png'
  )

  dateMonthWidgets[0].setProperty(
    hmUI.prop.SRC,
    DATE_DIGIT_PATH + '/' + month[0] + '.png'
  )

  dateMonthWidgets[1].setProperty(
    hmUI.prop.SRC,
    DATE_DIGIT_PATH + '/' + month[1] + '.png'
  )

  const weekdays = getLanguage() === 3 ? WEEKDAYS_ES : WEEKDAYS_EN
  const weekday = weekdays[dateInfo.weekday]

  for (let i = 0; i < weekDayWidgets.length; i++) {
    if (i < weekday.length) {
      const language = getLanguage()
      const prefix = language === 3 ? WEEKDAY_PATH_ES : WEEKDAY_PATH_EN

      weekDayWidgets[i].setProperty(
        hmUI.prop.SRC,
        prefix + weekday[i] + '.png'
      )
    }
  }

  console.log(
    'SaganMoon DATE UPDATE -> ' +
    day + '/' +
    month + ' ' +
    weekday
  )
}

export function getLastDateKey() {
  return lastDateKey
}