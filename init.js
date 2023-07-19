const playGame = function(x, y) { // x, y - board size
  const game = document.querySelector('.game');
  const scoreMoves = document.getElementById('score-moves');
  const scoreApples = document.getElementById('score-apples');
  scoreMoves.innerHTML = "0";
  scoreApples.innerHTML = "0";

  // assets
  const audio = {
    die: new Audio('./assets/you died.mp4'),
    win: new Audio('./assets/winning.mp4'),
  };
  audio.die.volume = 0.4; // die volume does not require additional fade in / out effect
  audio.win.volume = 0;
  let finishing = document.getElementById('finishing');

  // adjust board size
  game.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
  game.style.gridTemplateRows = `repeat(${y}, 1fr)`;
  if (+x >= +y) {
    game.style.width = 96 + 'vh';
    game.style.height = 96 * (y / x) + 'vh';
  } else {
    game.style.height = 96 + 'vh';
    game.style.width = 96 * (x / y) + 'vh';
  }

  // determining starting point (center of the board)
  let startingPoint = {};

  function determStartPoint(value, dim) {
    if (value % 2 === 0) {
      startingPoint[dim] = +value / 2;
    } else {
      startingPoint[dim] = (+value + 1) / 2;
    }
  };

  determStartPoint(x, 'x');
  determStartPoint(y, 'y');

  // setting up the board
  game.innerHTML = '';
  for (let i = 1; i <= y; i++) {
    for (let j = 1; j <= x; j++) {
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
  let pointsMoves = 0;
  let pointsApples = 0;

  // game mechanics
  mechanics = function(e) {
    let alive = true;
    const checkWhatHappens = function() {
      const youAreDead = function() {
        audio.die.play();
        finishing.classList.add("ending", "die");
        setTimeout(() => finishing.classList.remove("ending", "die"), 8000);
        document.removeEventListener('keydown', mechanics);
        alive = false;
      };
      scoreMoves.innerHTML = ++pointsMoves;

      // set new place of the head
      headDiv = divSelector(headPos);
      // add new coordinates for a body part
      body.unshift({...headPos});

      // check if snake eats an apple
      if (appleDiv === headDiv) {
        scoreApples.innerHTML = ++pointsApples;
        // check if you win
        if (body.length === x * y) {
          audio.win.play();
          let interval = setInterval(() => {
            audio.win.volume += 0.01;
            if (audio.win.volume >= 0.4) {
              clearInterval(interval);
            };
          }, 50);

          finishing.classList.add("ending", "win");
          setTimeout(() => {
            finishing.classList.remove("win");
            finishing.classList.add("win-going");
            setTimeout(() => finishing.classList.remove("ending", "win-going"), 11000);
          }, 9000);

          setTimeout(() => {
            interval = setInterval(() => {
              audio.win.volume -= 0.01;
              if (audio.win.volume <= 0.01) {
                audio.win.volume = 0;
                clearInterval(interval);
              }
            }, 50);
          }, 18000);
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

let removeListener = playGame(30, 30);
const form = document.querySelector("form");
form.addEventListener('submit', e => {
  e.preventDefault();
  let x = form.elements.x.value;
  let y = form.elements.y.value;
  let errorDiv = document.getElementsByClassName('error')[0];
  if (+x < 5 || y < 5) {
    errorDiv.innerHTML = "The board is too small (min is 5 x 5)";
    return;
  } else if (+x > 100 || +y > 100) {
    errorDiv.innerHTML = "The board is too big (max is 100 x 100)";
    return;
  };
  errorDiv.innerHTML = "";
  removeListener();
  removeListener = playGame(x, y);
});