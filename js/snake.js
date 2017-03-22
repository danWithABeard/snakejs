/**
* Snake
* Daniel Cicconi
* dancicconi@gmail.com
* March 22, 2017
*/
(function() {
  /** Initialize the canvas */
  var canvas = document.getElementById("snakeCanvas");
  var ctx = canvas.getContext("2d");
  var pixelSize = 10;

  /** Initialize the hero snake's state at the start of the game */
  var snakeBody = [{x: 10, y: 10}];
  var currentDirection = 'right';

  /** Generate a random starting location for the apple */
  var currentAppleLocationX = generateRandomNumber(canvas.width - 10);
  var currentAppleLocationY = generateRandomNumber(canvas.height - 10);

  /** Player UI */
  var score = 0;

  /** Enable keyboard event listeners */
  document.addEventListener('keydown', keyDownHandler, false);

  /** Handle player's keyboard inputs and prevent unnatural reverse direction changes */
  function keyDownHandler(e) {
    if (e.keyCode == '39' && currentDirection !== 'left') {
      currentDirection = 'right';
    } else if (e.keyCode == '37' && currentDirection !== 'right') {
      currentDirection = 'left';
    } else if (e.keyCode == '38' && currentDirection !== 'down') {
     currentDirection = 'up';
    } else if (e.keyCode == '40' && currentDirection !== 'up') {
      currentDirection = 'down';
    }
  }

  /** Utility function to generate a random number and keep the pixel ratio of `pixelSize` consistent */
  function generateRandomNumber(upperBound) {
    var randomNumber = Math.random() * upperBound + 1;
    return Math.round(randomNumber / pixelSize) * pixelSize;
  }

  /** Determine if the hero snake has run into the canvas wall */
  function canvasCollisionDetection() {
    var currentHead = snakeBody[snakeBody.length - 1];

    if (currentHead.x < 0 ||
        currentHead.x >= canvas.width ||
        currentHead.y < 0 ||
        currentHead.y >= canvas.height) {
      gameOver();
    }
  }

  /** Compare the single vertebra of the snake versus the currentHead of the snake (this) */
  function matchCoordinates(vertebra) {
    return (vertebra.x === this.x && vertebra.y === this.y);
  }

  /**
  * Determine if the player has directed the snake's head back into its body
  * It is impossible for the player to run into themselves into they reach a length of 4
  */
  function snakeCollisionDetection() {
    if (snakeBody.length >= 4) {
      var currentHead = snakeBody[snakeBody.length - 1];

      /** Copy the snake array so we do not accidentally mutate the actual hero snake */
      var collisionArray = snakeBody.slice();

      /** We do not need to check the head (last element of snakeBody array) since this will automatically trigger the collision detection */
      collisionArray.pop();

      /** Compare the head to any other vertebra of the snake body to see if the hero snake ran into its body */
      if (collisionArray.some(matchCoordinates, currentHead)) {
        gameOver();
      }
    }
  }

  /** Generate a new apple on the canvas for the snake to acquire */
  function changeAppleLocation() {
    currentAppleLocationX = generateRandomNumber(canvas.width - 10);
    currentAppleLocationY = generateRandomNumber(canvas.height - 10);
  }

  /** Handle the user successfully capturing the apple */
  function collectApple() {
    changeAppleLocation();
    score++;
  }

  /** Determine if the player has successfully navigated the snake to capture the apple */
  function appleCollisionDetection() {
    var currentHead = snakeBody[snakeBody.length - 1];
    var headX = currentHead.x;
    var headY = currentHead.y;

    /** Extend the snake 1 vertebra longer by pushing a new head element to the snakeBody array */
    if (headX === currentAppleLocationX &&
        headY === currentAppleLocationY) {
      snakeBody.push({x: headX, y: headY });
      collectApple();
    }
  }

  /**
  * Create the illusion of the snake moving on the screen by removing
  * the tail (first element of the array) and creating a new head based on
  * the snake's currentDirection
  */
  function moveSnake() {
    var currentHead = snakeBody[snakeBody.length - 1];
    var heady = currentHead.y;
    var headx = currentHead.x;

    /** Remove the current tail of the hero snake */
    snakeBody.shift();

    /** Determine where to attach the new head of the hero snake */
    switch (currentDirection) {
      case 'right':
        headx += pixelSize;
        break;
      case 'left':
        headx -= pixelSize;
        break;
      case 'down':
        heady += pixelSize;
        break;
      case 'up' :
        heady -= pixelSize;
        break;
      default:
        /** Do nothing */
    }

    /** Push the new head into the snakeBody array */
    snakeBody.push({x: headx, y: heady });
  }

  /** Run the end game state */
  function gameOver() {
    alert('Game Over!');
    document.location.reload();
  }

  /** Render the hero snake to the canvas */
  function drawSnake() {
    for(var s = 0; s < snakeBody.length; s++) {
      ctx.fillStyle = "#0095DD";
      ctx.fillRect(snakeBody[s].x, snakeBody[s].y, pixelSize, pixelSize);
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(snakeBody[s].x, snakeBody[s].y, pixelSize, pixelSize);
    }
  }

  /** Render the apple to the canvas */
  function drawApple() {
    ctx.beginPath();
    ctx.rect(currentAppleLocationX, currentAppleLocationY, pixelSize, pixelSize);
    ctx.fillStyle = "#ff0000";
    ctx.fill();
    ctx.closePath();
  }

  /** Render the score to the canvas */
  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
  }

  /** Clear the canvas and prepare for the next animation frame */
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /** Run the game and all the necessary functions to make the game work */
  function draw() {
    clearCanvas();
    moveSnake();
    drawScore();
    drawSnake();
    drawApple();
    snakeCollisionDetection();
    appleCollisionDetection();
    canvasCollisionDetection();

    /** Set a timeout to make the canvas re-render slower to achieve the pixel-y animation */
    setTimeout(function() {
      requestAnimationFrame(draw)
    }, 100);
  }

  /** Game on */
  draw();
})();
