const game = document.querySelector('.game');
const xMax = 30;
const yMax = 30;
let startingPoint = {};
function determStartPoint(value, dim) {
  if (value % 2 === 0) {
    startingPoint[dim] = value / 2;
  } else {
    startingPoint[dim] = (value + 1) / 2;
  }
};

determStartPoint(xMax, 'x');
determStartPoint(yMax, 'y');

for (let i = 1; i <= xMax; i++) {
  for (let j = 1; j <= yMax; j++) {
    const div = document.createElement("div");
    div.setAttribute("data-x", j);
    div.setAttribute("data-y", i);
    game.appendChild(div);
  }
};

const divSelector = function(object) {
  return document.querySelector(`div[data-x="${object.x}"][data-y="${object.y}"]`);
};
const startDiv = divSelector(startingPoint);
startDiv.classList.add("head-down");
let headPos = {
  x: startDiv.dataset.x,
  y: startDiv.dataset.y,
};
let headDiv = startDiv;

let mechanics = function(e) {
  let clearAndReselect = function() {
    if (headPos.x <= 0 || headPos.x > xMax || headPos.y <= 0 || headPos.y > yMax) {
      alert('dead');
    };
    headDiv.className = '';
    headDiv = divSelector(headPos);
  };

  if (e.key === "ArrowLeft") {
    headPos.x--;
    clearAndReselect();
    headDiv.classList.add("head-left");
  } else if (e.key === "ArrowRight") {
    headPos.x++;
    clearAndReselect();
    headDiv.classList.add("head-right");
  } else if (e.key === "ArrowUp") {
    headPos.y--;
    clearAndReselect();
    headDiv.classList.add("head-up");
  } else if (e.key === "ArrowDown") {
    headPos.y++;
    clearAndReselect();
    headDiv.classList.add("head-down");
  };
};

document.addEventListener("keydown", mechanics);