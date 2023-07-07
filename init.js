const game = document.querySelector('.game');
const x = 30;
const y = 30;
let startingPoint = {};
function determStartPoint(value, dim) {
  if (value % 2 === 0) {
    startingPoint[dim] = value / 2;
  } else {
    startingPoint[dim] = (value + 1) / 2;
  }
};

determStartPoint(x, 'x');
determStartPoint(y, 'y');

for (let i = 1; i <= x; i++) {
  for (let j = 1; j <= y; j++) {
    const div = document.createElement("div");
    div.setAttribute("data-x", i);
    div.setAttribute("data-y", j);
    game.appendChild(div);
  }
};

const startDiv = document.querySelector(`div[data-x="${startingPoint.x}"][data-y="${startingPoint.y}"]`);
startDiv.classList.add("head-left");