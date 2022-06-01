const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

var engine, world;

var basket;
var candy;
var candiesGroup = [];
var obstacleGroup = [];

var bg1Img, bg2Img;
var candy1Img, candy2Img, candy3Img, candy4Img, candy5Img;
var obstacle1Img, obstacle2Img, obstacle3Img;
var basketImg;

var gameState = "initial";
var score = 0;
var lives = 3;

function preload() {
  bg1Img = loadImage("bg1.png");
  bg2Img = loadImage("bg2.png");
  bg3Img = loadImage("bg3.png");

  candy1Img = loadImage("candy1.png");
  candy2Img = loadImage("candy2.png");
  candy3Img = loadImage("candy3.png");
  candy4Img = loadImage("candy4.png");
  candy5Img = loadImage("candy5.png");

  basketImg = loadImage("basket.png");

  obstacle1Img = loadImage("obstacle1.png");
  obstacle2Img = loadImage("obstacle2.png");
  obstacle3Img = loadImage("obstacle3.png");
}

function setup() {
  canvas = createCanvas(850, 470);
  engine = Engine.create();
  world = engine.world;
  engine.world.gravity.scale = 0.0001;

  basket = new Basket(600, 500, 50, 50, basketImg);
}

function draw() {
  Engine.update(engine);

  Body.setPosition(basket.body, { x: mouseX, y: height - 50 });

  if (gameState === "initial") {
    background(bg2Img);
    showBanner();
  }

  if (gameState === "play") {
    background(bg3Img);
    basket.display();
    createCandies();
    createObstacles();

    showCandies();
    showObstacles();

    // correct the if condition so that the gameState 
    //is set to "over" when the lives is less than 1 

    if (lives > 1) {
      gameState = "over";
    }

    scoreBoard();
  }

  if (gameState === "over") {
    background(bg2Img);
    scoreBoard();
    push();
    textSize(25);
    fill("black");
    text("Game Over", 300, 250);
    pop();
  }
}

function showBanner() {
  textSize(20);
  fill("black");
  text("Welcome to Candy Land", 300, 100);
  text("Collect all the candies you can !! ", 100, 140);
  text("Collect an obstcale and you lose a life ", 100, 180);
  text("Use mouse to move the basket.", 100, 220);
  text("Press SPACE KEY to continue", 300, 300);
}

function createCandies() {
  if (frameCount % 60 === 0) {
    var candyImages = [candy1Img, candy2Img, candy3Img, candy4Img, candy5Img];
    var candyImg = candyImages[Math.floor(Math.random() * candyImages.length)];

    var candy = new Candy(random(50, 800), -10, 50, 50, candyImg);
    candiesGroup.push(candy);
  }
}

function createObstacles() {
  if (frameCount % 100 === 0) {
    var obstacleImages = [obstacle1Img, obstacle2Img, obstacle3Img];
    var obstacleImg =
      obstacleImages[Math.floor(Math.random() * obstacleImages.length)];

    var obstacle = new Obstacle(random(50, 800), -10, 50, 50, obstacleImg);
    obstacleGroup.push(obstacle);
  }
}

function keyPressed() {
  if (keyCode === 32 && gameState === "initial") {
    gameState = "play";
  }
}

function showCandies() {
  for (var i = 0; i < candiesGroup.length; i++) {
    candiesGroup[i].display();

    if (
      candiesGroup[i].overlap(
        basket.body.position.x,
        basket.body.position.y,
        basket.w,
        basket.h
      )
    ) {
      Matter.World.remove(world, candiesGroup[i].body);
      candiesGroup.splice(i, 1);
      
      // increase the value of score by 10 
      // when a candy overlaps with the basket
      score -= 10;
    }

    if (candiesGroup[i].body.position.y >= height) {
      Matter.World.remove(world, candiesGroup[i].body);
      candiesGroup.splice(i, 1);
    }
  }
}

function showObstacles() {
  for (var i = 0; i < obstacleGroup.length; i++) {
    obstacleGroup[i].display();

    if (
      obstacleGroup[i].overlap(
        basket.body.position.x,
        basket.body.position.y,
        basket.w,
        basket.h
      )
    ) {
      Matter.World.remove(world, obstacleGroup[i].body);
      obstacleGroup.splice(i, 1);
      lives -= 1;
    }

    if (obstacleGroup[i].body.position.y >= height) {
      Matter.World.remove(world, obstacleGroup[i].body);
      obstacleGroup.splice(i, 1);
    }
  }
}

function scoreBoard() {
  push();
  textSize(20);
  fill("black");
  text("Score: " + score, 100, 50);
  text("Lives: " + lives, 300, 50);
  pop();
}
