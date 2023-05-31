let player;
let bullets = [];
let enemies = [];
let score = 0;
let isGameOver = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player();
}

function draw() {
  background(0);

  if (isGameOver) {
    gameOver();
    return;
  }

  player.update();
  player.show();

  // 更新子彈
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    // 檢查子彈是否擊中敵人
    for (let j = enemies.length - 1; j >= 0; j--) {
      if (bullets[i].hits(enemies[j])) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score++;
        break;
      }
    }
  }

  // 更新敵人
  for (let enemy of enemies) {
    enemy.update();
    enemy.show();

    // 檢查敵人是否碰撞到玩家
    if (enemy.hits(player)) {
      isGameOver = true;
      break;
    }
  }

  // 產生新的敵人
  if (frameCount % 20 === 0) {
    let enemy = new Enemy();
    enemies.push(enemy);
  }

  // 顯示分數
  fill(255);
  textSize(24);
  text(`Score: ${score}`, 10, 30);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    player.shoot();
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.speed = 5;
  }

  update() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    this.x = constrain(this.x, 0, width);
  }

  show() {
    fill(0, 255, 0);
    noStroke();
    triangle(this.x, this.y - 20, this.x - 20, this.y + 20, this.x + 20, this.y + 20);
  }

  shoot() {
    let bullet = new Bullet(this.x, this.y - 20);
    bullets.push(bullet);
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
  }

  update() {
    this.y -= this.speed;
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, 10, 10);
  }

  hits(enemy) {
    let d = dist(this.x, this.y, enemy.x, enemy.y);
    return d < 16;
  }
}

class Enemy {
  constructor() {
    this.x = random(width);
    this.y = random(-200, -100);
    this.speed = random(3, 6);
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.x = random(width);
      this.y = random(-200, -100);
    }
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    rectMode(CENTER);
    rect(this.x, this.y, 30, 30);
  }

  hits(player) {
    let d = dist(this.x, this.y, player.x, player.y);
    return d < 20;
  }
}

function gameOver() {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(30);
  text('Game Over!', width / 2, height / 2);
  textSize(20);
  text(`Final Score: ${score}`, width / 2, height / 2 + 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
