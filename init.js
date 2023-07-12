const playGame = function(x, y) { // x, y - board size
  const game = document.querySelector('.game');

  game.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
  game.style.gridTemplateRows = `repeat(${y}, 1fr)`;

  // determining starting point (center of the board)
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

  // setting up the board
  game.innerHTML = '';
  for (let i = 1; i <= x; i++) {
    for (let j = 1; j <= y; j++) {
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
        x: rnd(1, x),
        y: rnd(1, y)
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
  let points = 0;

  // game mechanics
  mechanics = function(e) {
    let alive = true;
    const checkWhatHappens = function() {
      const youAreDead = function() {
        alert('dead');
        document.removeEventListener('keydown', mechanics);
        alive = false;
      };
      const score = document.getElementById('score');
      score.innerHTML = ++points;

      // set new place of the head
      headDiv = divSelector(headPos);
      // add new coordinates for a body part
      body.unshift({...headPos});

      // check if snake eats an apple
      if (appleDiv === headDiv) {
        // check if you win
        if (body.length === x * y) {
          alert('Congratulations, you win');
          document.removeEventListener('keydown', mechanics);
          score.style.color = 'black';
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
      if (headPos.x <= 0 || headPos.x > x || headPos.y <= 0 || headPos.y > y) {
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
      if (alive) {
        // head left
        headDiv.classList.add("head", "rotate");
      }
    } else if (e.key === "ArrowRight") {
      headPos.x++;
      checkWhatHappens();
      if (alive) {
        // head right
        headDiv.classList.add("head", "rotate-thrice");
      }
    } else if (e.key === "ArrowUp") {
      headPos.y--;
      checkWhatHappens();
      if (alive) {
        // head up
        headDiv.classList.add("head", "rotate-twice");
      }
    } else if (e.key === "ArrowDown") {
      headPos.y++;
      checkWhatHappens();
      if (alive) {
        // head down
        headDiv.classList.add("head");
      }
    };
  };

  const removeListener = function() {
    document.removeEventListener('keydown', mechanics);
  };

  // start the game
  placeApple();
  document.addEventListener("keydown", mechanics);
  return removeListener;
};

let removeListener = playGame(5, 5);
const form = document.querySelector("form");
form.addEventListener('submit', e => {
  e.preventDefault();
  removeListener();
  removeListener = playGame(form.elements.x.value, form.elements.y.value);
});