const game = document.querySelector('.game');

// board size
const xMax = 5;
const yMax = 5;
game.style.gridTemplateColumns = `repeat(${xMax}, 1fr)`;
game.style.gridTemplateRows = `repeat(${xMax}, 1fr)`;

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
headDiv.classList.add("head");
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
    const youAreDead = function() {
      alert('dead');
      document.removeEventListener('keydown', mechanics);
    };

    // set new place of the head
    headDiv = divSelector(headPos);
    // add new coordinates for a body part
    body.unshift({...headPos});

    // check if snake eats an apple
    if (appleDiv === headDiv) {
      // check if you win
      if (body.length === xMax * yMax) {
        alert('Congratulations, you win');
        document.removeEventListener('keydown', mechanics);
      } else {
        // if you didn't win yet, place an apple in new position
        placeApple();
      };
      // clear the class of eaten apple,
      headDiv.className = '';
    } else {
      // delete the last part of the body if the apple was not eaten
      divSelector(body.pop()).className = '';
    };

    // check if body (beside head) already exists
    if (body[1]) {
      // select the correct image for each part of the body along with rotation
      for (let i = 1; i < body.length; i++) {
        divSelector(body[i]).className = '';
        // image selection
        if (i === body.length - 1) {
          divSelector(body[i]).classList.add("body-end");
          // rotation for body end
          if (body[i].x === body[i - 1].x) {
            if (body[i].y < body[i - 1].y) {
              divSelector(body[i]).classList.add("rotate-twice");
            };
          } else {
            if (body[i].x < body[i - 1].x) {
              divSelector(body[i]).classList.add("rotate");
            } else {
              divSelector(body[i]).classList.add("rotate-thrice");
            };
          };
        } else if (body[i].x === body[i - 1].x && body[i].x === body[i + 1].x) {
          // rotation taking into consideration right away
          divSelector(body[i]).classList.add("body-straight");
        } else if (body[i].y === body[i - 1].y && body[i].y === body[i + 1].y) {
          // rotation taking into consideration right away
          divSelector(body[i]).classList.add("body-straight", "rotate");
        } else {
          divSelector(body[i]).classList.add("body-turn");
          // rotation for body turn
          if (
            (
              body[i - 1].x < body[i + 1].x &&
              body[i - 1].y < body[i + 1].y &&
              body[i - 1].y === body[i].y
            ) ||
            (
              body[i - 1].x > body[i + 1].x &&
              body[i - 1].y > body[i + 1].y &&
              body[i - 1].x === body[i].x
            )
          ) {
            divSelector(body[i]).classList.add("rotate");
          } else if (
            (
              body[i - 1].x < body[i + 1].x &&
              body[i - 1].y > body[i + 1].y &&
              body[i - 1].y === body[i].y
            ) ||
            (
              body[i - 1].x > body[i + 1].x &&
              body[i - 1].y < body[i + 1].y &&
              body[i - 1].x === body[i].x
            )
          ) {
            divSelector(body[i]).classList.add("rotate-twice");
          } else if (
            (
              body[i - 1].x < body[i + 1].x &&
              body[i - 1].y < body[i + 1].y &&
              body[i - 1].x === body[i].x
            ) ||
            (
              body[i - 1].x > body[i + 1].x &&
              body[i - 1].y > body[i + 1].y &&
              body[i - 1].y === body[i].y
            )
          ) {
            divSelector(body[i]).classList.add("rotate-thrice");
          };
        }
      };
    };

    // check if snake doesn't go out of the board
    if (headPos.x <= 0 || headPos.x > xMax || headPos.y <= 0 || headPos.y > yMax) {
      youAreDead();
    };
    // check if snake doesn't go into it's body;
    // slice(1) is for not considering new head position
    // (otherwise you would die in every single move)
    if (body.slice(1).filter(el => el.x === headPos.x && el.y === headPos.y).length) {
      youAreDead();
    };
  };

  if (e.key === "ArrowLeft") {
    headPos.x--;
    checkWhatHappens();
    // head left
    headDiv.classList.add("head", "rotate");
  } else if (e.key === "ArrowRight") {
    headPos.x++;
    checkWhatHappens();
    // head right
    headDiv.classList.add("head", "rotate-thrice");
  } else if (e.key === "ArrowUp") {
    headPos.y--;
    checkWhatHappens();
    // head up
    headDiv.classList.add("head", "rotate-twice");
  } else if (e.key === "ArrowDown") {
    headPos.y++;
    checkWhatHappens();
    // head down
    headDiv.classList.add("head");
  };
};

// start the game
placeApple();
document.addEventListener("keydown", mechanics);