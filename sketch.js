let base, ship, ship_image, star_image, bullets, stars, hp_bar
let gameStarted = false
let gameOver = false
let hiscore = 0
let score = 0
let level = 1
let grav = 2
let hp = 100


function preload() {
  // preloading images to use for stars and ship
  ship_image = loadImage("assets/ship.png");
  star_image = loadImage("assets/star.png");

}


function setup() {
  stars = new Group();
  bullets = new Group();
  createCanvas(800, 600);
  frameRate(40);
  ship = createSprite(width / 2, height * .93, 20, 20)
  ship.addImage(ship_image)
  base = createSprite(width / 2, height * .985, 800, 20)
  hp_bar = createSprite(width / 2, height * .013, width, 20)
  base.shapeColor = color(0, 174, 255)
  hp_bar.shapeColor = color(0, 253, 47)
  ship.shapeColor = color(255, 255, 255)
  // creating 25 stars
  for (let i = 0; i < 25; i++) {
    createStar()
  }
}




function draw() {
  // before game starts, requires a space click or mouse left click"
  if (!gameStarted) {
    textSize(30)
    clear()
    background(0)
    textAlign(CENTER)
    fill(255, 255, 255)
    text(`Welcome to Starfall.`, width / 2, height / 2)
    text(`Press "Space" or Click to start.`, width / 2, height / 1.7);
    if (keyWentDown("space") || mouseWentDown(LEFT)) {
      gameStarted = true
    }
  }
  if (!gameOver && gameStarted) {
    // if gameover is false/gamestarted is true
    // game renders normally
    clear()
    background(0)
    textAlign(CENTER);
    fill(255, 255, 255)
    // Game display texts
    let title_text = text("Starfall", width / 2, 35)
    let hp_text = text(`BASE HP: ${hp}`, width / 2, 50)
    let score_text = text(`Score: ${score}`, 700, 35);
    let hiscore_text = text(`Hi-Score: ${hiscore}`, 700, 50)
    let level_text = text(`Level: ${level}`, 50, 35)
    let control_text = text(`← Move Left | Move Right →
Z : Shoot `, width / 2, 65);

    //draw all the sprites added to the sketch so far
    //the positions will be updated automatically at every cycle
    if (keyDown("left")) {
      if (ship.position.x > 50) {
        ship.velocity.x = -27;
      } else {
        ship.velocity.x = 0
      }
    }
    if (keyWentUp("left")) {
      ship.velocity.x = 0;
    }
    //keyDown is similar to keyIsDown() except it accepts both key codes and characters
    if (keyDown("right")) {
      if (ship.position.x < 750) {
        ship.velocity.x = +27;
      } else {
        ship.velocity.x = 0
      }
    }
    if (keyWentUp("right")) {
      ship.velocity.x = 0;
    }

    if (keyWentDown("z")) {
      let bullet = createSprite(ship.position.x, ship.position.y * .985, 3, 10);
      bullet.setSpeed(10, ship.rotation - 90);
      bullet.life = 50;
      bullets.add(bullet)
    }


    stars.overlap(bullets, starHit);
    stars.overlap(base, baseHit)

    drawSprites();
  } else if (gameOver) {
    // when gameover (hp reaches 0) is true below will render
    textSize(30)
    textAlign(CENTER)
    fill(255, 255, 255)
    text(`
        GAME OVER `, width / 2, height / 2)
    text(`
        Press "P"
        to play again.
        `, width / 2, height / 2 + 50);
    stars.forEach(s => {
      s.remove();
    })
  }
  // if gamesover and "p" is clicked, game is reset
  // hp 100, score 0, 25 more stars
  if (keyWentDown("p") && gameOver) {
    hp = 100
    score = 0
    hp_bar.width = width
    hp_bar.shapeColor = color(0, 253, 47)
    // stars = new Group();
    while (stars.length < 25) {
      createStar();
    }
    gameOver = false
  }
  // Levels 2-11 determined by score
  switch (score) {
    case 20:
      level = 2;
      grav = 4;
      break;
    case 40:
      level = 3;
      grav = 5;
      break;
    case 60:
      level = 4;
      grav = 6;
      break;
    case 80:
      level = 5;
      grav = 7;
      break;
    case 100:
      level = 6;
      grav = 8;
      break;
    case 120:
      level = 7;
      grav = 9;
      break;
    case 140:
      level = 8;
      grav = 10;
      break;
    case 160:
      level = 9;
      grav = 11;
      break;
    case 180:
      level = 10;
      grav = 12;
      break;
    case 200:
      level = 11;
      grav = 13;
      break;
  }
  // if score which starts at 0 is higher than current hiscore, redeclares hiscore
  if (score > hiscore) {
    hiscore = score
  }
}
// creates star in y position -100 (-100 is above the canvas, so it prerenders
// and falls into the canvas) between x positions 50-750
// stars fall with speed according to gravity

function createStar() {
  let star = createSprite((random(50, 750)),
    (random(-100, -3000)), 30, 30);
  star.addSpeed(grav, 90)
  star.rotationSpeed = 3
  stars.add(star)
  star.addImage(star_image)
}


// if the base platform is hit hp is minused 10
// hp_bar sprite (rectangle with width of 800) loses 80 width (10% of 800)
function baseHit(star) {
  if (hp > 10) {
    hp -= 10
    hp_bar.width -= 80
    if (hp <= 50 && hp >= 30) {
      hp_bar.shapeColor = color(255, 156, 0)
    } else if (hp <= 30 && hp >= 10) {
      hp_bar.shapeColor = color(247, 10, 10)
    }
  } else {
    hp = 0
    hp_bar.width = 0
    setTimeout(() => {
      gameOver = true
    }, 300)
  }
  star.remove()
}

function starHit(star, bullet) {
  bullet.remove();
  star.remove();
  createStar()
  score += 1
}