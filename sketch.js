//sprite liberary
//https://molleindustria.github.io/p5.play/docs/classes/Sprite.html

//p5js
//https://p5js.org/reference/

var trex, trex_running;
var ground, groundImage;
var invisibleground;
var clouds, cloudsImage;
var obstacle,
  obstacle1Image,
  obstacle2Image,
  obstacle3Image,
  obstacle4Image,
  obstacle5Image,
  obstacle6Image;
var score = 0;
var play = 0;
var end = 1;
var gamestate = play;
var obstaclegroup;
var cloudsgroup;
var restart, restartImage, gameover, gameoverImage;
localStorage["HighestScore"] = 0;
var jump, die, checkpoint;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudsImage = loadImage("cloud.png");
  obstacle1Image = loadImage("obstacle1.png");
  obstacle2Image = loadImage("obstacle2.png");
  obstacle3Image = loadImage("obstacle3.png");
  obstacle4Image = loadImage("obstacle4.png");
  obstacle5Image = loadImage("obstacle5.png");
  obstacle6Image = loadImage("obstacle6.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkpoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //create a trex sprite

  trex = createSprite(40, height-15, 80, 80);
  trex.addAnimation("trex", trex_running);
  trex.scale = 0.4;
  ground = createSprite(200, height-15, 2000, 20);
  ground.addImage("floor", groundImage);

  invisibleground = createSprite(200, height-3, 2000, 20);
  invisibleground.visible = false;

  cloudsgroup = new Group();
  obstaclegroup = new Group();

  gameover = createSprite(width/2, height/2+170);
  gameover.addImage("gameOver", gameoverImage);
  gameover.scale = 0.5;
  restart = createSprite(width/2, height/2+200);
  restart.addImage("restart", restartImage);
  restart.scale = 0.4;

  trex.debug = false;
  trex.setCollider("circle", 0, 0, 45);
}

function draw() {
  background("white");
  drawSprites();

  textSize(15);
  textStyle("bold");
  text("Score: " + score, width/2-400, height/2+100);
  text("HighestScore: " + localStorage["HighestScore"], width/2-250, height/2+100);

  if (gamestate === play) {
    ground.velocityX = -(5 + score / 100);

    if ((touches.length> 0 || keyDown("space")) && trex.y >= height-60) {
      trex.velocityY = -6;
      jump.play();
      touches=[]
    } else if ((touches.length> 0 || keyDown("space")) && trex.y >= height-60) {
      trex.velocityY = -6;
      jump.play();
      touches=[]
    }

    trex.velocityY = trex.velocityY + 0.6;
    if (ground.x < 0 ) {
      ground.x = ground.width / 2;
    }

    score = score + Math.round(random(frameCount % 5 === 0));

    if (trex.isTouching(obstaclegroup)) {
      gamestate = end;
      die.play()
    }

    if (score>0 && score % 20===0){
      checkpoint.play()

    }

    createclouds();
    createobstacle();
    gameover.visible = false;
    restart.visible = false;
  } else if (gamestate === end) {
    trex.velocityY = 0;
    ground.velocityX = 0;

    obstaclegroup.setVelocityXEach(0);
    cloudsgroup.setVelocityXEach(0);
    gameover.visible = true;
    restart.visible = true;

    if (touches.length<0 ||mousePressedOver(restart)) {
      resetgame();
      touches=[]
    }
  }

  trex.collide(invisibleground);

  //console.log(trex.y)
}

function createclouds() {
  if (frameCount % 80 === 0) {
    clouds = createSprite(width+20,80 , 100, 20);
    clouds.addImage("cloudy", cloudsImage);
    clouds.velocityX = -5;
    clouds.scale = 0.6;
    //console.log('display clouds',frameCount)
    clouds.y = Math.round(random(height-100, height-200));
    trex.depth = clouds.depth;
    trex.depth + 1;
    // console.log("trex depth is", trex.depth);
    // console.log("clouds depth is", clouds.depth);

    //lifetime to clouds time=distance/speed = 600/4=150
    clouds.lifetime = 120;
    cloudsgroup.add(clouds);
    cloudsgroup.setLifetimeEach(-1);
  }
}

function createobstacle() {
  if (frameCount % 50 === 0) {
    obstacle = createSprite(width+5, height-28, 10, 20);
    obstacle.velocityX = -(5 + score / 100);
    obstacle.scale = 0.5;
    obstacle.lifetime = 170;
    obstaclegroup.add(obstacle);
    obstaclegroup.setLifetimeEach(-1);

    var number = Math.round(random(1, 6));

    switch (number) {
      case 1:
        obstacle.addImage("ob1", obstacle1Image);
        break;
      case 2:
        obstacle.addImage("ob2", obstacle2Image);
        break;
      case 3:
        obstacle.addImage("ob3", obstacle3Image);
        break;
      case 4:
        obstacle.addImage("ob4", obstacle4Image);
        break;
      case 5:
        obstacle.addImage("ob5", obstacle5Image);
        break;
      case 6:
        obstacle.addImage("ob6", obstacle6Image);
        break;

      default:
        break;
    }
  }
}
function resetgame() {
  
  gamestate = play;
  obstaclegroup.destroyEach();
  cloudsgroup.destroyEach();

  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"]=score
  }
  score = 0;
}
