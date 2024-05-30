const inputElement = document.getElementById("header__checkbox");
const dropdownMenu = document.getElementById("header").lastElementChild;
const svgAnimation = document.getElementById("header--animation");
const btnGroup = document.getElementById("btns");
const startTime = document.getElementById("start");
const stopTime = document.getElementById("stop");
const resetTime = document.getElementById("reset");
const table = document.getElementById("table");
const tableHead = table.firstElementChild;
const tableBody = table.lastElementChild.lastElementChild;
const lapTime = document.getElementById("lap");
const clock = document.getElementById("clock");
let nIntervId = null, seconds = 0, minutes = 0, lapNumber = 1;

let formatTxt = (minutes, seconds) => {
  return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

function startWatch() {
  if (!nIntervId) {
    nIntervId = setInterval(timer, 1000);
    if (stopTime.classList.contains("no-display") === true && lapTime.classList.contains("no-display") === true) {
      hideOrShow(startTime, resetTime, stopTime, lapTime);
    }
  }
};

function stopWatch() {
  clearInterval(nIntervId);
  nIntervId = null;
  if (startTime.classList.contains("no-display") === true && resetTime.classList.contains("no-display") === true) {
    hideOrShow(startTime, resetTime, stopTime, lapTime);
  }
};

function resetWatch() {
  clearInterval(nIntervId);
  nIntervId = null;
  seconds = 00;
  minutes = 00;
  clock.textContent = "00:00";
  if (tableBody.rows.length > 0 ) {
    hideOrShow(tableHead);
  }
  lapNumber = 1;
  rowsLength = tableBody.rows.length - 1;
  while(tableBody.rows.length > 0){
    tableBody.lastChild.remove();
  }
};

function addRow() {
  if (tableBody.rows.length === 0 ) {
    hideOrShow(tableHead);
    console.log("true");
  }
    
  let newRow, newCell, colLength, snapTime, lastRowIndex, lastCellInfo;

  snapTime = formatTxt(minutes, seconds);
  newRow = tableBody.insertRow(-1);
  colLength = table.firstElementChild.rows[0].cells.length;
  
  for (let i = 0; i < colLength; i++) {
    let newTxt, newMinutes, newSeconds ;
    newCell = newRow.insertCell(i);

    if (i == 0) {
      newTxt = document.createTextNode(lapNumber);
      newCell.appendChild(newTxt);
    } else if (i == 1) {
      if (tableBody.rows.length === 1) {
        newTxt = document.createTextNode(snapTime);
      } else {
        // El "- 2" es debido a que el indice empieza en 0 y también porque a la hora de que regresar la cantidad de filas
        // el valor de este ya es 2. Por lo que 2 - 1 es igual a 1.
        lastRowIndex = tableBody.rows.length - 2;
        lastCellInfo = tableBody.rows[lastRowIndex].cells[2].textContent.split(":");
        calculateTime = ((minutes * 60) - (lastCellInfo[0] * 60)) + ((seconds - lastCellInfo[1]));
        if (calculateTime > 0 && calculateTime < 60) {
          newTxt = document.createTextNode(`00:${calculateTime.toString().padStart(2, "0")}`);
        } else {
          newSeconds = calculateTime % 60;
          newMinutes = (calculateTime - newSeconds) / 60;
          newTxt = document.createTextNode(formatTxt(newMinutes, newSeconds));
        }
      }
      newCell.appendChild(newTxt);
    } else {
      newTxt = document.createTextNode(snapTime);
      newCell.appendChild(newTxt);
    }
  }
  lapNumber++;
};

function hideOrShow(...args) {
  for (const arg of args) {
    arg.classList.toggle("no-display");
  }
};

function timer() {
  seconds++;
  
  if (seconds == 59) {
    seconds = 00;
    minutes++;
  }
  
  clock.textContent = formatTxt(minutes, seconds);
};

startTime.addEventListener("click", startWatch);
stopTime.addEventListener("click", stopWatch);
resetTime.addEventListener("click", resetWatch);
lapTime.addEventListener("click", addRow);

inputElement.addEventListener("click", () => {
  dropdownMenu.classList.toggle("no-display");
  svgAnimation.classList.toggle("opened");
});
