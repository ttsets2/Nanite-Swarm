  // Sets the number of enemies and the bullet speed
let enemyNumbers = 0;
let enemyBulletSpeed = 0;
let gameOverCheck = enemyNumbers;
let difficulty = "Hard";

scoreCounter = 0;
clickCounter = 0;

  // Array to store all enemies.
let enemyList = []

  // Data structure to hold the shots;
var pBullets = [];

  // Enemy bullets
var enemyBullets = [];

  // create a class for enemy's to use (store in an array)
class Enemy {
  constructor(x, y, hitBox, aimLook, vector, magnitudeX, magnitudeY, boost, hp) {
    this.enemyX = x;
    this.enemyY = y;
    this.hitBox = hitBox;
    this.aimLook = aimLook;
    this.magnitudeX = magnitudeX;
    this.magnitudeY = magnitudeY;
    this.boost = boost;
    this.HP = hp;
  }
}

  // creates class for the player.
class Player {
  constructor(x, y, hitBox, aimLook, vector, magnitudeX, magnitudeY, boost, hp) {
    this.playerX = x;
    this.playerY = y;
    this.hitBox = hitBox;
    this.aimLook = aimLook;
    this.magnitudeX = magnitudeX;
    this.magnitudeY = magnitudeY;
    this.boost = boost;
    this.HP = hp;
  }
}

  // All function to handle core functions of a single bullet
function Bullet(X,Y,PX,PY){
  this.speed = 20;
  this.x = PX;
  this.y = PY;
  this.dir = createVector(X-PX, Y-PY).normalize()
  this.r = 20;

  this.show = function(){
    fill(0,0,255);
    circle(this.x,this.y,this.r);
    //print("BulletX: ", this.x, "BulletY: ", this.y);
  }
  this.toTarget = function() {
    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;
  }
  this.onScreen = function() {
    return this.x > -this.r && this.x < width+this.r &&
      this.y > -this.r && this.y < height+this.r;
  }
}

  // All function to handle core functions of a single bullet
function BulletE(X,Y,PX,PY){
  this.speed = enemyBulletSpeed;
  this.x = PX;
  this.y = PY;
  this.dir = createVector(X-PX, Y-PY).normalize()
  this.r = 20;

  this.showE = function(){
    fill(0,255,0);
    circle(this.x,this.y,this.r);
    //print("BulletX: ", this.x, "BulletY: ", this.y);
  }
  this.toTargetE = function() {
    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;
  }
  this.onScreenE = function() {
    return this.x > -this.r && this.x < width+this.r &&
      this.y > -this.r && this.y < height+this.r;
  }
}

  // Function that spawns enemies into an array.
function spawnEnemies(){
	for(i = 0; i < enemyNumbers; i++){
		randX = int(random(10, windowWidth-10));
		randY = int(random(10, windowHeight-10));
		enemyList.push(new Enemy(randX, randY, 30, 0, 0, 0, 0, 1, 1));
	}
}

  // It's a setup function.....
function setup() {
		// Gets the difficulty option from the front page
	//const queryString = window.location.search;
	//const urlParams = new URLSearchParams(queryString);
	//difficulty = urlParams.get('difficulty');

	if(difficulty == "Easy"){
		enemyNumbers = 5;
		enemyBulletSpeed = 10;
	} else if (difficulty == "Medium"){
		enemyNumbers = 10;
		enemyBulletSpeed = 13;
	} else if (difficulty == "Hard"){
		enemyNumbers = 15;
		enemyBulletSpeed = 18;
	}
	
	background('black');
	frameRate(60);
	noStroke();
	createCanvas(windowWidth, windowHeight);
	angleMode(DEGREES);
  
	spawnEnemies();

	player = new Player(windowWidth/2, windowHeight/2, 20, 0, 0, 0, 0, 1, 1);
}

  // Function that moves the players position
function calcMovement(){
  player.playerX += player.magnitudeX;
  player.playerY += player.magnitudeY;
  
  for(i = 0; i < enemyNumbers; i++){
    enemyList[i].enemyY += enemyList[i].magnitudeY;
    enemyList[i].enemyX += enemyList[i].magnitudeX;
  }
}
  
  // Function that brings the player back to a stop.
function spaceBrake(){
  if (player.magnitudeX < 0) {
    player.magnitudeX += (0.05*player.boost);
  }
  else if(player.magnitudeX > 0) {
    player.magnitudeX -= (0.05*player.boost);
  }
  
  if(player.magnitudeY < 0){
    player.magnitudeY += (0.05*player.boost);
  }
  else if(player.magnitudeY > 0) {
    player.magnitudeY -= (0.05*player.boost);
  }
  
  if(abs(player.magnitudeY) < 0.001){
    player.magnitudeY = 0;
  }
  if(abs(player.magnitudeX) < 0.001){
    player.magnitudeX = 0;
  }
}

  // Checks that the player is within the play border. Otherwise
  // they get moved to the opposite side
function checkBorder(){
  if (player.playerX > windowWidth+10){
    player.playerX = -10;
  }
  else if (player.playerX < -10){
    player.playerX = windowWidth+10;
  }
  
  if (player.playerY > windowHeight+10){
    player.playerY = -10;
  }
  else if (player.playerY < -10){
    player.playerY = windowHeight+10;
  }
  
  for(i = 0; i < enemyNumbers; i++){
    if (enemyList[i].enemyX > windowWidth+10){
      enemyList[i].enemyX = -10;
    }
    else if (enemyList[i].enemyX < -10){
      enemyList[i].enemyX = windowWidth+10;
    }

    if (enemyList[i].enemyY > windowHeight+10){
      enemyList[i].enemyY = -10;
    }
    else if (enemyList[i].enemyY < -10){
      enemyList[i].enemyY = windowHeight+10;
    }
  }
}

  // Moves the enemies towards the player
function moveToPlayer(){
    // gets the difference between player and enemy coordinates
  for(i = 0; i < enemyNumbers; i++){
    if (enemyList[i].HP){
      distanceX = player.playerX - enemyList[i].enemyX;
      distanceY = player.playerY - enemyList[i].enemyY;

      actualDistance = sqrt((abs(distanceX))**2 + (abs(distanceY))**2);

      if(actualDistance > 200){
        theta = atan(abs(distanceX)/abs(distanceY));

        multDiffX = (theta/90);
        multDiffY = (1-multDiffX);

        if ((enemyList[i].magnitudeX < 5) && (distanceX >= 0)){
          enemyList[i].magnitudeX += (0.08 * multDiffX);
        }
        if ((enemyList[i].magnitudeX > -5) && (distanceX < 0)){
          enemyList[i].magnitudeX -= (0.08 * multDiffX);
        }

        if ((enemyList[i].magnitudeY < 5) && (distanceY >= 0)){
          enemyList[i].magnitudeY += (0.08 * multDiffY);
        }
        if ((enemyList[i].magnitudeY > -5) && (distanceY < 0)){
          enemyList[i].magnitudeY -= (0.08 * multDiffY);
        }
      }
      else{
        if ((enemyList[i].magnitudeX < 5) && (distanceX >= 0)){
          enemyList[i].magnitudeX -= (0.08 * multDiffX);
        }
        if ((enemyList[i].magnitudeX > -5) && (distanceX < 0)){
          enemyList[i].magnitudeX += (0.08 * multDiffX);
        }

        if ((enemyList[i].magnitudeY < 5) && (distanceY >= 0)){
          enemyList[i].magnitudeY -= (0.08 * multDiffY);
        }
        if ((enemyList[i].magnitudeY > -5) && (distanceY < 0)){
          enemyList[i].magnitudeY += (0.08 * multDiffY);
        }
      }
    }
  }
}

  // Creates an array of bullets and also checks for collision
function spawnPBullets(){
  let keepbullets = []
  let anyhit = false;
  for (let i=0; i < pBullets.length; i++) {
    pBullets[i].toTarget();
    let hit = false;
    let tempEnemyCount = gameOverCheck;
    for(j = 0; j < enemyNumbers; j++){
      hit = false;
      let distance = dist(pBullets[i].x, pBullets[i].y, enemyList[j].enemyX, enemyList[j].enemyY);
      if(enemyList[j].HP > 0){
        hit = distance <= (enemyList[j].hitBox/2)+10;
      }
      
      if(hit){
        // print(frameCount, " ", i, " ", hit, " ", j, " distance: ", (enemyList[j].hitBox/2)+10);
        // print(distance);
        enemyList[j].HP = -1;
        tempEnemyCount -= 1;
        //print(tempEnemyCount);
        hit = false;
        scoreCounter ++;
        break;
      }
    }
    gameOverCheck = tempEnemyCount;
    anyhit = anyhit || hit
    if (!hit && pBullets[i].onScreen()) {
      keepbullets.push(pBullets[i]);
      pBullets[i].show();
    }
  }
  pBullets = keepbullets;
}

  // Creates an array of bullets for the enemy
function spawnEBullets(){
  let keepEBullets = []
  let anyhitP = false;
  for (let i=0; i < enemyBullets.length; i++) {
    enemyBullets[i].toTargetE();
    let hit = dist(enemyBullets[i].x, enemyBullets[i].y, player.playerX, player.playerY) <= (player.hitBox/2)+10;
    anyhitP = anyhitP || hit
    if (!hit && enemyBullets[i].onScreenE()) {
      keepEBullets.push(enemyBullets[i]);
      enemyBullets[i].showE();
    }
  }
  enemyBullets = keepEBullets;
  if (anyhitP) {
    player.HP -= 1;
  }
}

  // Creates a bullet on mouse press
function mousePressed(){
  clickCounter += 1;
  if (mouseX != player.playerX || mouseY != player.playerY ) {
    pBullets.push( new Bullet(mouseX,mouseY,player.playerX,player.playerY) )
  }
}

  // Randomly creates a bullet for the enemydd
function shootPlayer(){
  if (gameOverCheck > 0){
    let r = int(random(0,enemyNumbers));
    while (enemyList[r].HP < 0){
      r = int(random(0,enemyNumbers));
    }
    
      // predicts where the player will be (roughly)
    distance = dist(enemyList[r].enemyX, enemyList[r].enemyY, player.playerX, player.playerY) ;
    distance = distance / enemyBulletSpeed;
    
    playerXF = player.playerX + player.magnitudeX*distance;
    playerYF = player.playerY + player.magnitudeY*distance;
    
    enemyBullets.push( new BulletE(playerXF, playerYF, enemyList[r].enemyX, enemyList[r].enemyY));
  }
}

  // Writes down game info on the top left
function writeInfo(){
  textAlign(LEFT);
  textSize(32);
  
  Score = str(scoreCounter);
  textFull = "Targets Destroyed: " + scoreCounter; 
  text(textFull, 10, 30);
  
  playerHp = str(player.HP);
  textFull = "Health: " + playerHp; 
  text(textFull, 10, 70);
}

  // Draw end screen
function displayEndScreen(){
  background('white');
  
  fill('black');
  
  textAlign(CENTER);
  
  kills = str(scoreCounter);
  textFull = "Targets Destroyed: " + kills; 
  text(textFull, (windowWidth/2), windowHeight/5);
  
  textFull = "Clicks: " + clickCounter; 
  text(textFull, (windowWidth/2), windowHeight/5+60);
  
  score = int(scoreCounter/(clickCounter/10));
  if(score <= 0){
	  score = 0;
  }
  Score = str(score);
  textFull = "Total Score: " + Score; 
  text(textFull, (windowWidth/2), windowHeight/5+120);
}

  // Draws the board
function draw() {
   // creates the space background.
  background('black');

    // Respawn the enmies
  if(gameOverCheck == 0){
    print("Respawning");
    gameOverCheck = enemyNumbers;
    enemyList = [];
    spawnEnemies();
  }
  
    // Draws the enemies
  for(i = 0; i < enemyNumbers; i++){
    fill(255-(i*10), 0+(i+10), 0+(i*10));
    if (enemyList[i].HP > 0){
      circle(enemyList[i].enemyX, enemyList[i].enemyY, enemyList[i].hitBox);
    }
  }

    // Writes the game info on the top.
  writeInfo();

    // Draws the player of size hitBox.
  fill('white');
  circle(player.playerX, player.playerY, player.hitBox);

    // Checks for W and S (up and down)
  if ((keyIsDown(68)) && (player.magnitudeX < 10)){
    player.magnitudeX += (0.08*player.boost);
  }
  if((keyIsDown(65)) && (player.magnitudeX > -10)){
    player.magnitudeX -= (0.08*player.boost);
  }

    // Checks for A and D (left and right)  
  if ((keyIsDown(83)) && (player.magnitudeY < 10)){
    player.magnitudeY += (0.08*player.boost);
  }
  if ((keyIsDown(87)) && (player.magnitudeY > -10)){
    player.magnitudeY -= (0.08*player.boost);
  }

    // Checks for SPACE (brakes)
  if (keyIsDown(32)){
    spaceBrake();
  }

    // Checks if SHIFT is down.
  if(keyIsDown(16)){
    player.boost = 2;
  } else{
    player.boost = 1;
  }
  
  if((frameCount > 90)){
      // Calculate the acceleration of the enemies to the player
    moveToPlayer();
      // Calculates the movement of the player and all enemies.
    calcMovement();

      // Checks that the entities have not breached to border, if they have they get Tp'ed to the other side
    checkBorder();

      // Draws spawned bullets and checks for collisions
    spawnPBullets();
    spawnEBullets();

      // Shoots bullets for enemies, 1 ouut of 100 chance of opening fire
    if(frameCount > 120){
      let firing = int(random(0, 1000));
      if(firing > 990){
        shootPlayer();
      }
    }
  }
  
	// If the player's HP ever drops below 1 it'll end the game
  if(player.HP < 1){
    displayEndScreen();
    noLoop();
  }
}