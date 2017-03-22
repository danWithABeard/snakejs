(function() {
  /** Canvas */
  var canvas = document.getElementById("snakeCanvas");
  var ctx = canvas.getContext("2d");

  /** Snake */
  var snakeBody = [{x: 1, y: 1}];
  var currentDirection = 'right';

  /** Apple */
  var currentAppleLocationX = generateRandomNumber(canvas.width - 10);
  var currentAppleLocationY = generateRandomNumber(canvas.height - 10);

  /** UI */
  var score = 0;

  /** Keyboard Event Listeners */
  document.addEventListener('keydown', keyDownHandler, false);

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

  function generateRandomNumber(upperBound) {
    var randomNumber = Math.random() * upperBound + 1;
    return Math.round(randomNumber / 10) * 10;
  }

  function canvasCollisionDetection() {
    var currentHead = snakeBody[snakeBody.length - 1];

    if (currentHead.x * 10 < 0 ||
        currentHead.x * 10 >= canvas.width ||
        currentHead.y * 10 < 0 ||
        currentHead.y * 10 >= canvas.height) {
      gameOver();
    }
  }

  /** Compare the single vertebra of the snake versus the currentHead of the snake (this) */
  function matchCoordinates(vertebra) {
    return (vertebra.x === this.x && vertebra.y === this.y);
  }

  function snakeCollisionDetection() {
    if (snakeBody.length >= 4) {
      var currentHead = snakeBody[snakeBody.length - 1];

      var collisionArray = snakeBody.slice();
      collisionArray.pop();

      var collision = collisionArray.filter(matchCoordinates, currentHead);

      if (collision.length) {
        gameOver();
      }
    }
  }

  function changeAppleLocation() {
    currentAppleLocationX = generateRandomNumber(canvas.width - 10);
    currentAppleLocationY = generateRandomNumber(canvas.height - 10);
  }

  function collectApple() {
    changeAppleLocation();
    score++;
  }

  function appleCollisionDetection() {
    var currentHead = snakeBody[snakeBody.length - 1];

    var heady = currentHead.y;
    var headx = currentHead.x;

    if (currentHead.x * 10 === currentAppleLocationX &&
        currentHead.y * 10 === currentAppleLocationY) {
      snakeBody.push({x: headx, y: heady });
      collectApple();
    }
  }

  function moveSnake() {
    var currentHead = snakeBody[snakeBody.length - 1];
    var heady = currentHead.y;
    var headx = currentHead.x;

    snakeBody.shift();

    switch (currentDirection) {
      case 'right':
        headx += 1;
        break;
      case 'left':
        headx -= 1;
        break;
      case 'down':
        heady += 1;
        break;
      case 'up' :
        heady -= 1;
        break;
      default:
        /** Do nothing */
    }

    snakeBody.push({x: headx, y: heady });
  }

  /** Run the end game state */
  function gameOver() {
    alert('Game Over!');
    document.location.reload();
  }

  function drawSnake() {
    for(var s = 0; s < snakeBody.length; s++) {
      ctx.fillStyle = "#0095DD";
      ctx.fillRect(snakeBody[s].x * 10, snakeBody[s].y * 10, 10, 10);
      ctx.strokeStyle = "#ffffff";
      ctx.strokeRect(snakeBody[s].x * 10, snakeBody[s].y * 10, 10, 10);
    }
  }

  /** Draw the apple to the canvas */
  function drawApple() {
    ctx.beginPath();
    ctx.rect(currentAppleLocationX, currentAppleLocationY, 10, 10);
    ctx.fillStyle = "#ff0000";
    ctx.fill();
    ctx.closePath();
  }

  /** Draw the score to the canvas */
  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
  }

  /** Clear the canvas and prepare for the next animation frame */
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function draw() {
    clearCanvas();
    moveSnake();
    drawScore();
    drawSnake();
    drawApple();
    snakeCollisionDetection();
    appleCollisionDetection();
    canvasCollisionDetection();

    /** Set a timeout to make the canvas render slower to achieve the blocky animation  */
    setTimeout(function() {
      requestAnimationFrame(draw)
    }, 100);
  }

  draw();
})();
