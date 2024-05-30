const inputElement = document.getElementById("header__checkbox");
const dropdownMenu = document.getElementById("header").lastElementChild;
const svgAnimation = document.getElementById("header--animation");
const dateElement = document.getElementById("date");
const dateContainer = document.getElementById("date-container");
const selectHours = document.getElementById("hours");
const selectMinutes = document.getElementById("minutes");
const secondsInput = document.getElementById("second")
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const countdownContainer = document.getElementById("countdown-container");
const daysClock = document.getElementById("ct-days");
const hoursClock = document.getElementById("ct-hours");
const minutesClock = document.getElementById("ct-minutes");
const secondsClock = document.getElementById("ct-seconds");
const startTime = document.getElementById("start");
const stopTime = document.getElementById("stop");
const opts = document.getElementById("opts");
// Analog Alarm Clock by bone666138 -- https://freesound.org/s/198841/ -- License: Attribution 4.0 https://creativecommons.org/licenses/by/4.0/
const alarmSound = new Audio("../assets/sound/alarm-clock.mp3"); 
let clockIntervals = null;

let formatString = (value) => {
  return value.toString().padStart(2,"0");
}

function hideOrShow(...args) {
  for (const arg of args) {
    arg.classList.toggle("no-display");
  }
}

function createOptionElements(start, end, selectElement, formatFunction) {
  for (let x = start; x <= end; x++) {
    const option = document.createElement("option");
    option.text = formatFunction(x);
    option.value = x;
    selectElement.appendChild(option);
  }
}

function startWatch() {
  currentTime = new Date();
  hideOrShow(dateContainer, countdownContainer, opts, startTime, stopTime);
  let selectedTime = (`${formatString(selectHours.value)}:${formatString(selectMinutes.value)}:00`);
  let timeRightNow;

  if (selectedTime === (`${currentTime.getHours()}:${currentTime.getMinutes()}:00`)) {
    timeRightNow = currentTime.setSeconds(0);
    timeRightNow = currentTime.toLocaleTimeString();
  } else {
    timeRightNow = currentTime.toLocaleTimeString();
  }

  let getDateSelected = `${yearInput.value}-${formatString(monthInput.value)}-${formatString(dayInput.value)}T${selectedTime}`;
  let dateSelected = new Date(getDateSelected);
  let dateSelectedString = new Intl.DateTimeFormat(undefined, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateSelected);
  let calcTime = calculateTime(dateSelected, currentTime);

  if (currentTime > dateSelected) {
    countdownContainer.querySelector("h3").textContent = `Tiempo desde ${dateSelectedString}:`;
    clockTime(calcTime, 1);
  } else {
    countdownContainer.querySelector("h3").textContent = `Tiempo hasta ${dateSelectedString}:`;
    clockTime(calcTime);
  }
}

function stopWatch() {
  if (clockIntervals != null) {
    clearInterval(clockIntervals);
    clockIntervals = null;
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
  hideOrShow(dateContainer, countdownContainer, opts, startTime, stopTime);
}


function clockTime(time, n = 0) {
  let daysRemaining, hoursRemaining, minutesRemaining, secondsRemaining;
  daysRemaining = time.days;
  hoursRemaining = time.hours;
  minutesRemaining = time.minutes;
  secondsRemaining = time.seconds;

  daysClock.textContent =  formatString(daysRemaining);
  hoursClock.textContent =  formatString(hoursRemaining);
  minutesClock.textContent =  formatString(minutesRemaining);
  secondsClock.textContent =  formatString(secondsRemaining);

  if (n === 1) {
    clockIntervals = setInterval(() => {
      secondsRemaining++;
      if (secondsRemaining >= 60) {
        secondsRemaining = 00;
        minutesRemaining++;
        if (minutesRemaining >= 60) {
          minutesRemaining = 00;
          hoursRemaining++;
          if (hoursRemaining >= 24) {
            hoursRemaining = 00;
            daysRemaining++;
          }
        }
      }
      daysClock.textContent =  formatString(daysRemaining);
      hoursClock.textContent =  formatString(hoursRemaining);
      minutesClock.textContent =  formatString(minutesRemaining);
      secondsClock.textContent =  formatString(secondsRemaining);      
    }, 1000);
  } else {
    clockIntervals = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining < 00) {
        secondsRemaining = 59;
        minutesRemaining--;
        if (minutesRemaining < 00) {
          minutesRemaining = 59;
          hoursRemaining--;
          if (hoursRemaining < 00) {
            hoursRemaining = 23;
            daysRemaining--;
          }
        }
      }
      if (daysRemaining <= 00 && (hoursRemaining <= 00 && (minutesRemaining <= 00 && secondsRemaining <= 00))) {
        daysClock.textContent =  formatString("00");
        hoursClock.textContent =  formatString("00");
        minutesClock.textContent =  formatString("00");
        secondsClock.textContent =  formatString("00");      
        clearInterval(clockIntervals);
        alarmSound.play();
      } else {
        daysClock.textContent =  formatString(daysRemaining);
        hoursClock.textContent =  formatString(hoursRemaining);
        minutesClock.textContent =  formatString(minutesRemaining);
        secondsClock.textContent =  formatString(secondsRemaining);      
      }
    }, 1000);
  }
}

function calculateTime(selectedTime, currentTime) {

  let x = Math.trunc(Math.abs((selectedTime.getTime() - currentTime.getTime()) / 1000));

  function createObjTime(time) {
    let tmp = time;
    let daysLeft = Math.trunc(tmp / 86400);
    tmp = tmp - (daysLeft * 86400);
    let hoursLeft = Math.trunc(tmp / 3600);
    tmp = tmp - (hoursLeft * 3600);
    let minutesLeft = Math.trunc(tmp / 60);
    let secondsLeft = (tmp - (minutesLeft * 60));
    return {days: daysLeft, hours: hoursLeft, minutes: minutesLeft, seconds: secondsLeft};
  }

  return createObjTime(x);
}

let options = {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  minimumIntegerDigits: 2,
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

let currentTime = new Date();
let dateString = new Intl.DateTimeFormat("es-MX", options).format(currentTime.getTime());
dateString = `${dateString.slice(0,1).toUpperCase()}${dateString.slice(1)}.`;
dateElement.innerText = dateString;
let mxDate = new Intl.DateTimeFormat("es-MX").formatToParts(currentTime);

dayInput.setAttribute("placeholder", formatString(mxDate[0].value));
monthInput.setAttribute("placeholder", formatString(mxDate[2].value));
yearInput.setAttribute("placeholder", formatString(mxDate[4].value));

createOptionElements(0, 23, selectHours, formatString);
createOptionElements(0, 59, selectMinutes, formatString);

inputElement.addEventListener("click", () => {
  dropdownMenu.classList.toggle("no-display");
  svgAnimation.classList.toggle("opened");
});
startTime.addEventListener("click", startWatch);
stopTime.addEventListener("click", stopWatch);
