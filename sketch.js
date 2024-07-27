let pacman = [];
let ghost = [];
let gameOver = [];
let centerX, centerY;
let scrollX = 0;
let scrollY = 0;
let listWidth = 800;
let rowHeight = 200;
let listHeight = rowHeight * 6;
let horizontalSpacing = 1300;
let verticalSpacing = 1500;
let columnSpacing = 500;
let gameisLogo;
let targetDate;
let currentPacmanFrame = 0;
let currentGhostFrame = 0;
let frameCounter = 0;
let maxSpeed = 15;
let pacmanAngle = 0;

let gameState = "playing";
let gameOverFrame = 0;
let gameOverStartTime;
let backButton;
let bookTicketButton;
let gameOverAnimationComplete = false;

let cherry, strawberry, orange, apple;
let fruitVisible = Array(8).fill(true);

let listItems = [
  { time: "09:00", name: "Guy Bendov", topic: "Greetings" },
  { time: "10:00", name: "Amit Arnon", topic: "In Sound Mind - Creation" },
  { time: "11:00", name: "Bosmat Agayoff", topic: "Color in Mobile Gaming" },
  { time: "12:00", name: "Alon Simon", topic: "The Quest is Alive" },
  { time: "13:00", name: "Wren Brier", topic: "Environmental Storytelling" },
  { time: "14:00", name: "Vered Pnueli", topic: "Gaming in the Academy" },
  { time: "15:00", name: "Yonatan Tepperberg", topic: "Nintendo Switch Porting" },
  { time: "16:00", name: "Eduardo Schilman", topic: "Gaming Behavioral Neuroscience" },
];

function preload() {
  gameisLogo = loadImage("gameisLogo.png");
  pacman[0] = loadImage("pacmanSprite1.png");
  pacman[1] = loadImage("pacmanSprite2.png");
  pacman[2] = loadImage("pacmanSprite3.png");
  ghost[0] = loadImage("RedGhost_1.png");
  ghost[1] = loadImage("RedGhost_2.png");
  for (let i = 1; i <= 11; i++) {
    gameOver[i-1] = loadImage(`gameOver_${i}.png`);
  }
  cherry = loadImage("Cherry.png");
  strawberry = loadImage("StrawBerry.png");
  orange = loadImage("Orange.png");
  apple = loadImage("Apple.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  frameRate(24);

  targetDate = new Date("2025-05-15T09:00:00+03:00").getTime();

  backButton = createButton('Back 2 LineUp');
  backButton.position(width / 2 - 100, height /2 + 160);
  backButton.size(200, 50);
  backButton.mousePressed(resetGame);
  backButton.hide();
  
  bookTicketButton = createButton('Book Your Ticket');
  bookTicketButton.position(width / 2 - 100, height / 2 + 100);
  bookTicketButton.size(200, 50);
  bookTicketButton.mousePressed(bookTicket);
  bookTicketButton.hide();
  
  // Apply custom styling
  backButton.style('font-family', '"Press Start 2P", cursive');
  backButton.style('font-size', '16px');
  backButton.style('color', 'rgb(143, 163, 249)');
  backButton.style('background-color', 'black');
  backButton.style('border', '2px solid rgb(143, 163, 249)');
  backButton.style('cursor', 'pointer');
  backButton.style('padding', '10px');
  
  bookTicketButton.style('font-family', '"Press Start 2P", cursive');
  bookTicketButton.style('font-size', '16px');
  bookTicketButton.style('color', 'yellow');
  bookTicketButton.style('background-color', 'black');
  bookTicketButton.style('border', '2px solid yellow');
  bookTicketButton.style('cursor', 'pointer');
  bookTicketButton.style('padding', '10px');
  
  addButtonStyles();
}

function addButtonStyles() {
  backButton.style('transition', 'all 0.3s ease');
  
  backButton.mouseOver(function() {
    this.style('background-color', 'rgb(143, 163, 249)');
    this.style('color', 'black');
  });
  
  backButton.mouseOut(function() {
    this.style('background-color', 'black');
    this.style('color', 'rgb(143, 163, 249)');
  });

  bookTicketButton.style('transition', 'all 0.3s ease');
  
  bookTicketButton.mouseOver(function() {
    this.style('background-color', 'yellow');
    this.style('color', 'black');
    this.style('border', '2px solid yellow');
  });
  
  bookTicketButton.mouseOut(function() {
    this.style('background-color', 'black');
    this.style('color', 'yellow');
    this.style('border', '2px solid yellow');
  });
}
function draw() {
  background(0);

  if (gameState === "playing") {
    let dx = mouseX - centerX;
    let dy = mouseY - centerY;
    let distance = dist(mouseX, mouseY, centerX, centerY);
    let angle = atan2(dy, dx);

    let moveSpeed = map(distance, 0, width / 2, maxSpeed, 0.5);

    scrollX += cos(angle) * moveSpeed;
    scrollY += sin(angle) * moveSpeed;

    scrollX = (scrollX + horizontalSpacing) % horizontalSpacing;
    scrollY = (scrollY + verticalSpacing) % verticalSpacing;

    pacmanAngle = atan2(-sin(angle), -cos(angle));

    drawLineup();
    checkFruitDisappear();
    drawPacmanAndGhost();

    let gameOverRadius = 20;
    if (dist(mouseX, mouseY, centerX, centerY) < gameOverRadius) {
      gameState = "gameOver";
      gameOverStartTime = millis();
    }
  } else if (gameState === "gameOver") {
    if (!gameOverAnimationComplete) {
      drawGameOver();
    } else {
      backButton.show();
      bookTicketButton.show();
    }
  }

  // Always draw the black header and countdown timer
  fill(0);
  rect(0, 0, width, 100);

  fill(255);
  textFont("Press Start 2P");
  textSize(20);
  text(getCountdownText(), width / 2, 55);
  fill(143, 163, 249);
  textFont("Roboto Mono");
  textSize(16);
  text("to the event", width / 2, 85);
}

function drawLineup() {
  push();
  translate(width / 2, height / 2);
  for (let offsetY = -1; offsetY <= 1; offsetY++) {
    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      push();
      translate(
        scrollX + offsetX * horizontalSpacing - horizontalSpacing / 2,
        scrollY + offsetY * verticalSpacing - verticalSpacing / 2
      );

      image(gameisLogo, 0, -listHeight / 2 + 400, 550, 150);

      for (let i = 0; i < 4; i++) {
        let yPos = i * rowHeight;
        drawListItem(i, -columnSpacing / 2, yPos);
      }

      for (let i = 4; i < 8; i++) {
        let yPos = (i - 4) * rowHeight + rowHeight / 2;
        drawListItem(i, columnSpacing / 2, yPos);
      }

      pop();
    }
  }
  pop();
}

function drawPacmanAndGhost() {
  push();
  translate(centerX, centerY);
  rotate(pacmanAngle);
  let pacmanWidth = 75;
  let pacmanHeight = 70;
  image(pacman[currentPacmanFrame], 0, 0, pacmanWidth, pacmanHeight);
  pop();

  push();
  translate(mouseX, mouseY);
  if (mouseX < width / 2) {
    scale(-1, 1);
  }
  image(ghost[currentGhostFrame], 0, 0, 75, 75);
  pop();

  frameCounter++;
  if (frameCounter >= 4) {
    frameCounter = 0;
    currentPacmanFrame = (currentPacmanFrame + 1) % 3;
    currentGhostFrame = (currentGhostFrame + 1) % 2;
  }
}

function drawGameOver() {
  let elapsedTime = millis() - gameOverStartTime;
  let animationDuration = 1500;
  if (elapsedTime < animationDuration) {
    gameOverFrame = floor(map(elapsedTime, 0, animationDuration, 0, gameOver.length));
    image(gameOver[gameOverFrame], centerX, centerY);
  } else if (!gameOverAnimationComplete) {
    gameOverAnimationComplete = true;
    backButton.show();
    bookTicketButton.show();
  }
}

function resetGame() {
  gameState = "playing";
  gameOverFrame = 0;
  gameOverAnimationComplete = false;
  backButton.hide();
  bookTicketButton.hide();
  scrollX = horizontalSpacing / 2;
  scrollY = verticalSpacing / 2;
  fruitVisible = Array(8).fill(true);
}

function bookTicket() {
  window.open("https://www.eventer.co.il/event/gameis24/vy2xL", "_blank");
}

function drawListItem(index, x, y) {
  let item = listItems[index];

  fill(255);
  textFont("Press Start 2P");
  textSize(25);
  text(item.name, x, y + 10);

  fill(143, 163, 249);
  textFont("Roboto Mono");
  textSize(20);
  text(item.topic, x, y + 50);
  
  if (fruitVisible[index]) {
    let fruitImage;
    switch (item.time) {
      case "09:00":
      case "15:00":
        fruitImage = cherry;
        break;
      case "10:00":
      case "16:00":
        fruitImage = strawberry;
        break;
      case "11:00":
      case "14:00":
        fruitImage = orange;
        break;
      case "12:00":
      case "13:00":
        fruitImage = apple;
        break;
    }
    image(fruitImage, x, y - 55, 60, 60);
  } else {
    fill(255, 255, 0);
    textFont("Press Start 2P");
    textSize(20);
    text(item.time, x, y - 55);
  }
}

function checkFruitDisappear() {
  for (let i = 0; i < listItems.length; i++) {
    if (fruitVisible[i]) {
      let offsetX = i >= 4 ? columnSpacing / 2 : -columnSpacing / 2;
      let offsetY = (i % 4) * rowHeight + (i >= 4 ? rowHeight / 2 : 0);
      let fruitX = (scrollX + offsetX - horizontalSpacing / 2 + width / 2) % horizontalSpacing;
      let fruitY = (scrollY + offsetY - verticalSpacing / 2 + height / 2) % verticalSpacing;
      
      if (fruitX < 0) fruitX += horizontalSpacing;
      if (fruitY < 0) fruitY += verticalSpacing;
      
      let collisionRadius = 20;
      
      if (rectCircleColliding(fruitX - 25, fruitY - 25, 50, 50, width / 2, height / 2, collisionRadius)) {
        fruitVisible[i] = false;
      }
    }
  }
}

function rectCircleColliding(rx, ry, rw, rh, cx, cy, radius) {
  let testX = cx;
  let testY = cy;

  if (cx < rx) testX = rx;
  else if (cx > rx + rw) testX = rx + rw;
  if (cy < ry) testY = ry;
  else if (cy > ry + rh) testY = ry + rh;

  let distX = cx - testX;
  let distY = cy - testY;
  let distance = sqrt((distX * distX) + (distY * distY));

  return distance <= radius;
}

function getCountdownText() {
  let now = new Date().getTime();
  let timeLeft = targetDate - now;

  if (timeLeft < 0) {
    return "Event has started!";
  }

  let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  backButton.position(width / 2 - 100, height - 60);
  bookTicketButton.position(width / 2 - 100, height - 120);
}

function addButtonStyles() {
  backButton.style('transition', 'all 0.3s ease');
  
  backButton.mouseOver(function() {
    this.style('background-color', 'rgb(143, 163, 249)');
    this.style('color', 'black');
  });
  
  backButton.mouseOut(function() {
    this.style('background-color', 'black');
    this.style('color', 'rgb(143, 163, 249)');
  });

  bookTicketButton.style('transition', 'all 0.3s ease');
  
  bookTicketButton.mouseOver(function() {
    this.style('background-color', 'yellow');
    this.style('color', 'black');
    this.style('border', '2px solid yellow');
  });
  
  bookTicketButton.mouseOut(function() {
    this.style('background-color', 'black');
    this.style('color', 'yellow');
    this.style('border', '2px solid yellow');
  });
}