import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import iziToast from 'izitoast'
import 'izitoast/dist/css/iziToast.min.css'
import errorIcon from '../img/bi_x-octagon.svg'

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: handleClose
}

let END_DATE = null

const startBtn = document.querySelector('[data-start]')
startBtn.disabled = true
startBtn.addEventListener('click', handleClick)

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24

  // Remaining days
  const days = Math.floor(ms / day)
  // Remaining hours
  const hours = Math.floor((ms % day) / hour)
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute)
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second)

  return { days, hours, minutes, seconds }
}

function convertMsPad(value) {
  return String(value).padStart(2, '0')
}

const myInput = document.querySelector('#datetime-picker')
flatpickr(myInput, options)

function handleClose(selectedDates) {
  const selectedDateTime = new Date(selectedDates[0]).getTime()
  if (selectedDateTime < Date.now()) {
    iziToast.show({
      position: 'topRight',
      message: 'Please choose a date in the future',
      messageColor: 'white',
      theme: 'dark', // dark
      color: '#ef4040',
      iconUrl: errorIcon
    })
    startBtn.disabled = true
    return
  } else {
    END_DATE = selectedDateTime
    startBtn.disabled = false
  }
}

const elements = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]')
}

function handleClick() {
  startBtn.disabled = true
  myInput.disabled = true
  const repeat = () => {
    if (END_DATE - Date.now() <= 0) {
      myInput.disabled = false
      clearInterval(intervalId)
      for (const key in elements) {
        elements[key].textContent = convertMsPad(0)
      }
      return
    }
    const timeLeft = convertMs(END_DATE - Date.now())
    for (const key in timeLeft) {
      elements[key].textContent = convertMsPad(timeLeft[key])
    }
  }
  repeat()
  const intervalId = setInterval(repeat, 1000)
}
