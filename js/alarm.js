const inputElement = document.getElementById("header__checkbox");
const dropdownMenu = document.getElementById("header").lastElementChild;
const svgAnimation = document.getElementById("header--animation");
const startTime = document.getElementById("start");
const stopTime = document.getElementById("disable");
const currentTimeClock = document.getElementById("currentTime");
const alarmClock = document.getElementById("remainingTime");
const dateElement = document.getElementById("date");
const selectHours = document.getElementById("hours");
const selectMinutes = document.getElementById("minutes");
const optAlarm = document.getElementById("opts-alarm");
// Analog Alarm Clock by bone666138 -- https://freesound.org/s/198841/ -- License: Attribution 4.0 https://creativecommons.org/licenses/by/4.0/
const alarmSound = new Audio("../assets/sound/alarm-clock.mp3");
let nIntervId = null, clockIntervals = null, seconds, minutes, hours;

let currentTime = new Date();
let ctArray = currentTime.toLocaleTimeString().split(":");
currentTimeClock.innerText = ctArray.join(":");

let dateString = new Intl.DateTimeFormat(undefined, {
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(currentTime);
dateElement.innerText = dateString;

createOptionElements(0, 23, selectHours, formatString);
createOptionElements(0, 59, selectMinutes, formatString);

window.addEventListener("load", refreshDisplayTime);
startTime.addEventListener("click", startAlarm);
stopTime.addEventListener("click", stopAlarm);

inputElement.addEventListener("click", () => {
  dropdownMenu.classList.toggle("no-display");
  svgAnimation.classList.toggle("opened");
});

function formatString(value) {
  return value.toString().padStart(2, "0");
}

function formatTime(hours, minutes, seconds) {
  hours = hours || 0;
  minutes = minutes || 0;
  seconds = seconds || 0;

  const formattedHours = formatString(hours);
  const formattedMinutes = formatString(minutes);
  const formattedSeconds = formatString(seconds);

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function startAlarm() {
  clearInterval(nIntervId);
  nIntervId = null;
  hideOrShow(optAlarm, startTime, stopTime, currentTimeClock, alarmClock);
  
  const selectedTime = formatTime(selectHours.value, selectMinutes.value, 0);
  const actualTime = ctArray.join(":");
  console.log(selectedTime, actualTime);
  let remainingTime = calculateRemainingTime(selectedTime, actualTime);
  console.log(remainingTime);

  
  if (!remainingTime) {
    return alarm("error");
  }
  return countdown(remainingTime);
}

function stopAlarm() {
  if (clockIntervals) {
    clearInterval(clockIntervals);
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
  hideOrShow(optAlarm, startTime, stopTime, currentTimeClock, alarmClock);
  return refreshDisplayTime();
}

function calculateRemainingTime(selectedTime, currentTime) {
  const selectedSplit = selectedTime.split(":");
  const currentSplit = currentTime.split(":");
  // St = SelectedTime, Ct = CurrentTime
  splitSt = selectedSplit.map(x => Number(x));
  splitCt = currentSplit.map(x => Number(x));

  function createObjTime(time) {
    let tmp = time;
    let secondsToHours = Math.floor(tmp / 3600);
    tmp = tmp - (secondsToHours * 3600);
    let secondsToMinutes = Math.floor(tmp / 60);
    let secondsLeft = (tmp - (secondsToMinutes * 60));
    return {hours: secondsToHours, minutes: secondsToMinutes, seconds: secondsLeft};
  }

  const stInSeconds = (splitSt[0] * 3600) + (splitSt[1] * 60) + splitSt[2];
  const ctInSeconds = (splitCt[0] * 3600) + (splitCt[1] * 60) + splitCt[2];
  let timeDiffInSeconds = stInSeconds - ctInSeconds; 


  if(stInSeconds < ctInSeconds) {
    timeDiffInSeconds += 86400;
  }

  const timeFormat = createObjTime(Math.abs(timeDiffInSeconds) % 86400);

  return timeFormat;
}

function refreshDisplayTime() {
  if (!nIntervId) {

    nIntervId = setInterval(() => {
      ctArray[2]++;

      if (ctArray[2] % 5 === 0) {
        currentTime = new Date();
        ctArray = currentTime.toLocaleTimeString().split(":");
      }

      ctArray = ctArray.map((x) => {
        return formatString(x);
      })      

      currentTimeClock.innerText = ctArray.join(":");
    }, 1000);
  } else {
    alarm("Error");
  }
}

function countdown(remainingTime) {
  clockIntervals = setInterval(() => {
    remainingTime.seconds--;
    if (remainingTime.seconds < 0) {
      remainingTime.seconds = 59;
      remainingTime.minutes--;
      if (remainingTime.minutes < 0) {
        remainingTime.minutes = 59;
        remainingTime.hours--;
      }
    }
    if (remainingTime.hours === 0 && remainingTime.minutes === 0 && remainingTime.seconds === 0) {
      alarmClock.textContent = formatTime(0, 0, 0);
      clearInterval(currentIntervalId);
      alarmSound.play();
    }
    alarmClock.textContent = formatTime(remainingTime.hours, remainingTime.minutes, remainingTime.seconds);
  }, 1000);
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
