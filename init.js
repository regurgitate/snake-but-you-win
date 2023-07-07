const game = document.querySelector('.game');

// board size
const xMax = 30;
const yMax = 30;

// determining starting point (center of the board)
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

// setting up the board
for (let i = 1; i <= xMax; i++) {
  for (let j = 1; j <= yMax; j++) {
    const div = document.createElement("div");
    div.setAttribute("data-x", j);
    div.setAttribute("data-y", i);
    game.appendChild(div);
  }
};

// putting head at the starting point
const divSelector = function(object) {
  return document.querySelector(`div[data-x="${object.x}"][data-y="${object.y}"]`);
};

let headDiv = divSelector(startingPoint);
headDiv.classList.add("head-down");
let headPos = {...startingPoint};

// placing an apple
let appleDiv = null;

const placeApple = function() {
  const rnd = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  };
  let applePos = {
    x: null,
    y: null
  };
  const genAppleRndPos = function() {
    applePos = {
      x: rnd(1, xMax),
      y: rnd(1, yMax)
    };
  };

  do  {
    genAppleRndPos();
    appleDiv = divSelector(applePos);
  }
  while (appleDiv.className);

  appleDiv.classList.add("apple");
};

// snake body - the head is part of it
let body = [
  {...headPos}
];

// game mechanics (moving)
const mechanics = function(e) {
  let checkWhatHappens = function() {
    // check if player doesn't go out of the board
    if (headPos.x <= 0 || headPos.x > xMax || headPos.y <= 0 || headPos.y > yMax) {
      alert('dead');
    };

    // erase head from previous place
    headDiv.className = '';
    // set new place of the head and start to adjust body
    headDiv = divSelector(headPos);
    body.unshift({...headPos});
    if (body[1]) {
      divSelector(body[1]).classList.add("body");
    };
    // check if snake eats an apple
    if (appleDiv === headDiv) {
      // place an apple in new position
      placeApple();
      // after that clear the class of eaten apple,
      // so the new one won't appear in the same place
      headDiv.className = '';
    } else {
      divSelector(body.pop()).className = '';
    };
  };

  if (e.key === "ArrowLeft") {
    headPos.x--;
    checkWhatHappens();
    headDiv.classList.add("head-left");
  } else if (e.key === "ArrowRight") {
    headPos.x++;
    checkWhatHappens();
    headDiv.classList.add("head-right");
  } else if (e.key === "ArrowUp") {
    headPos.y--;
    checkWhatHappens();
    headDiv.classList.add("head-up");
  } else if (e.key === "ArrowDown") {
    headPos.y++;
    checkWhatHappens();
    headDiv.classList.add("head-down");
  };
};

// start the game
placeApple();
document.addEventListener("keydown", mechanics);