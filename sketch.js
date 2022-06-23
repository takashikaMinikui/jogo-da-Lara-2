var trex, trex_running, edges;
var groundImage;
var PLAY = 1
var END = 0
var gamestate = PLAY

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png")
  cloudImg = loadImage("cloud.png")
  obstacle1 = loadImage("obstacle1.png")
  obstacle2 = loadImage("obstacle2.png")
  obstacle3 = loadImage("obstacle3.png")
  obstacle4 = loadImage("obstacle4.png")
  obstacle5 = loadImage("obstacle5.png")
  obstacle6 = loadImage("obstacle6.png")
  gameOver1 = loadImage("gameOver.png")
  restart1 = loadImage("restart.png")
  trex_collided = loadAnimation("trex_collided.png")
  checkpoint1 = loadSound("checkpoint.mp3")
  jump1 = loadSound("jump.mp3")
  die1 = loadSound("die.mp3")
}

function setup() {
  createCanvas(windowWidth, 200);

  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  edges = createEdgeSprites();
  ground = createSprite(200, 180, 450, 10)
  gameOver = createSprite(width / 2, 60)
  restart = createSprite(width / 2, 150)
  trex.addAnimation("collided", trex_collided)

  gameOver.addImage(gameOver1)
  restart.addImage(restart1)
  ground.addImage(groundImage)
  ground.scale = 1.1

  gameOver.scale = 0.5
  restart.scale = 0.5

  trex.scale = 0.5;
  trex.x = 50

  grounddois = createSprite(200, 190, 450, 10)
  grounddois.visible = false

  score = 0

  obstacleGroup = new Group()
  cloudGroup = new Group()
}

function draw() {

  background("white");

  if (gamestate === PLAY) {

    if (keyDown("space") && trex.y >= 160) {
      trex.velocityY = -10;

      jump1.play()
    }

    gameOver.visible = false
    restart.visible = false
    spawn()

    ground.velocityX = -(5 + score / 100)
    score = score + Math.round(frameCount / 640)
    trex.velocityY = trex.velocityY + 0.5;
    if (ground.x < 0) {
      ground.x = ground.width / 2
    }
    spawnclouds()

    if (obstacleGroup.isTouching(trex)) {
      gamestate = END
      die1.play()
    }

  }
  else if (gamestate === END) {
    ground.velocityX = 0
    obstacleGroup.setVelocityXEach(0)
    cloudGroup.setVelocityXEach(0)

    obstacleGroup.setLifetimeEach(-1)
    cloudGroup.setLifetimeEach(-1)

    gameOver.visible = true
    restart.visible = true

    trex.changeAnimation("collided", trex_collided)
    trex.velocityY = 0
  }
  if (mousePressedOver(restart)) {
    console.log("testar")

    reset()
  }

  textFont("Impact")
  text("score:" + score, 50, 40)

  trex.collide(grounddois)

  drawSprites();
}

function reset() {
  gamestate = PLAY

  obstacleGroup.destroyEach()
  cloudGroup.destroyEach()

  score = 0

  trex.changeAnimation("running", trex_running);
}

function spawnclouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(width, 90, 10, 10)
    cloud.velocityX = -3
    cloud.addImage(cloudImg)
    cloud.scale = 0.6
    cloud.y = Math.round(random(10, 65))

    cloud.depth = trex.depth
    trex.depth = trex.depth + 1
    cloud.lifetime = width

    cloudGroup.add(cloud)
  }
}

function spawn() {
  if (frameCount % 180 === 0) {
    obstacle = createSprite(width, 165, 10, 10)
    obstacle.velocityX = -(5 + score / 100)
    obstacle.lifetime = width

    obstacle.scale = 0.5

    var R = Math.round(random(1, 6))
    switch (R) {
      case 1: obstacle.addImage(obstacle1)
        break
      case 2: obstacle.addImage(obstacle2)
        break
      case 3: obstacle.addImage(obstacle3)
        break
      case 4: obstacle.addImage(obstacle4)
        break
      case 5: obstacle.addImage(obstacle5)
        break
      case 6: obstacle.addImage(obstacle6)
        break
    }
    obstacleGroup.add(obstacle)
  }
}