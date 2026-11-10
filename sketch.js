//NOTES:----------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------


// Game state variables
let gameStarted = false;
let gameEnded = false;
let winner = null;
let endScreenAnimation = 0;
let restartButton = {
  x: 0,
  y: 0,
  width: 120,
  height: 40,
  hovered: false
};

// Game music
let controlVar=true;
let track0, track1, track2, track3, track4, track5, startTrack, endTrack;
let tracks=[];
let currentTrack;

// Common game colours
let greyScale=false;
let colours = {
  r: [255, 0, 0],
  b: [0, 0, 255],
  g: [255, 215, 0],
  w: [255, 255, 255],
  bomb: [255, 100, 0] 
};

// Striker icons
let strikerIcons = [];
let currentStrikerIcon = 0; // 0 = default circle, 1-9 = custom icons
let strikerIconsLoaded = false;

// Pause handling
let paused = false;
let pauseMenu = false;

// Queen pocketing logic
let queenNeedsCovering = false;
let coverTurn = false;
let sOnCTurn = false;
let queenCovered = false;

// Coin dimensions
let strikerSize = 30;
let strikerMass = 1.5;
let coinMass = 2;
let coinSize=25;
let coinTrails = []; // Array to store trail points for each coin

// Aiming
let isDragging = false;
let aimAssist = false;
let aimAssistButton;

// Arrays for coins and pocketed coins
let coins = [];
let coinsToRemove = [];

// How many left to pocket for each player and whether they dued on that turn
let due = false;
let redLeft = 9;
let blueLeft = 9;

// Pocketing
let playerHasPocketedCoin = false;
let index;
let pockets = [];
let pocketRadius = 150; // Fixed: Back to original size
let waitingForNextTurn = false;
let currentPlayer = 1;

// Game screen controls
let startButton;
let rulesButton;
let controlsButton;
let onRulesScreen=false;
let onControlsScreen=false;
let showRules=false;
let showControls=false;

// Special features:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Screenshake
let shakeIntensity = 0;
let shakeDecay = 0.95;
let screenshakeEnabled = false;

let aimStartTime = 0;

let maxAimTime = 5000; // max screen shake happens after aiming for 5 seconds
    // Drunkenness
let drunkennessEnabled = false;
let drunkTime = 0;
let drunkClouds = [];
let coinFadeOffsets = [];
let timerEnabled = false;
    // Bomb system
let bombEnabled = false;
let bombCoin = null;
let bombMoved = false;
    // For timer
let redGlowIntensity = 0;
    // No skill mode
let noSkillModeEnabled=false;
    // Laser aim and inverted aim
let laserAim = false;
let invertedControls = false;
    // Glitch mode
let glitchEnabled = false;
let lastGlitchTime = 0;
let glitchInterval = 2000; // 2 seconds
let glitchEffects = []; // Array to store active glitch effects
    // Sticky zones
let stickyZonesEnabled = false;
let stickyZones = [];
let zoneSize = 80;
    // Wraparound board edges (I've named it wormholes for some reason)
let wormholesEnabled=false;
    // Board tilt
let wobblyBoard=false;
let tiltDirections=['up', 'down', 'left', 'right']
let tiltDirection=null;
let tiltVector;
    // Bounce pads
let trampolines=[];
let trampolinesEnabled=false;
let bounceStrength=2;//3 is too high, bugs out sometimes
let trampolineLengths=[60, 70, 80, 90, 100, 110, 120];
let trampolineWidth=12
let currentTrampolineLength=trampolineLengths[0];
let widd=trampolineWidth, high=currentTrampolineLength;
let trampolineClicked=false
let tClickedIndex;
let changeMessage=true;
let finalMessage;
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Message system
let messageText = "";
let messageTimer = 0;
let messageDuration = 120; // 2 seconds at 60fps

//-----------------------------------------------------------------------------------------------------------------------------
 function preload() {
  
  // Loading the font and music assets before the game starts, store songs to array 'tracks'
  titleFont =  loadFont('assets/GeostarFill-Regular.ttf');
  track0=   loadSound('assets/uptown-funk-cool-vintage-music-279730.mp3');
  track1=   loadSound('assets/Syntheticsax - Tico-Tico 2.mp3');
  track2=  loadSound('assets/Kool & The Gang - Get Down On It (1).mp3');
  track3=   loadSound('assets/fire platformer music.mp3');
  track4=  loadSound('assets/2. Chic - Le Freak (1).mp3');
  track5=  loadSound('assets/fightmanaudio (1).mp3');
  tracks.push(track0, track1, track2, track3, track4, track5);
  endTrack=  loadSound('assets/fightmanaudioclip.mp3');
  //use whichever song - maybe GIVE USER A CHOICE
  
  // Load striker icons with error handling
  strikerIcons[0] = null; // Default striker
  
  // Try to load images, needed error handling to see which images were causing errors. Uses the built in loadImage success and failure callbacks, and try catch.
  try {
    strikerIcons[1] =   loadImage('vectorstock_25205978.png', 
      () => console.log('Icon 1 loaded successfully'), 
      () => console.log('Failed to load icon 1')
    );
    strikerIcons[2] =   loadImage('dogshock copy.png',
      () => console.log('Icon 2 loaded successfully'), 
      () => console.log('Failed to load icon 2')
    );
    strikerIcons[3] =   loadImage('darwin-nunez-ribeiro-smile.png',
      () => console.log('Icon 3 loaded successfully'), 
      () => console.log('Failed to load icon 3')
    );
    strikerIcons[4] =   loadImage('Liverpool_Blue_Coat_School.png',
      () => console.log('Icon 4 loaded successfully'), 
      () => console.log('Failed to load icon 4')
    );
    strikerIcons[5] =   loadImage('footy1.png',
      () => console.log('Icon 5 loaded successfully'), 
      () => console.log('Failed to load icon 5')
    );
    strikerIcons[6] =   loadImage('skull1.png',
      () => console.log('Icon 6 loaded successfully'), 
      () => console.log('Failed to load icon 6')
    );
    strikerIcons[7] =   loadImage('GolemCard copy1.png',
      () => console.log('Icon 7 loaded successfully'), 
      () => console.log('Failed to load icon 7')
    );
    strikerIcons[8] =   loadImage('Mr_Incredible_Is_Red_Now copy1.png',
      () => console.log('Icon 8 loaded successfully'), 
      () => console.log('Failed to load icon 8')
    );
  } catch (error) {
    console.log('Error loading striker icons:', error);
  } 
}
//-----------------------------------------------------------------------------------------------------------------------------
function setup() {
  // Initialise canvas and side panels
  
  // Greyscale
    if (greyScale){
    colours = {
  r: [80,80,80],
  b: [211,211,211],
  g: [10,10,10],
  w: [255, 255, 255],
  bomb: [169,169,169]
};
  }
  
  // Initiate canvas
  let canvas = createCanvas(600, 600);
  canvas.parent('game-container');
  
  // Play music
  startTrack=track1;
  startTrack.loop();
  textFont(titleFont);
  
  // Create pockets and starting coin setup
  createCoins();

  
  // Initialize coin trails
  for (let i = 0; i < 50; i++) {
    coinTrails[i] = [];
  }
  
  // Wait for DOM to be ready before setting up event listeners
  setTimeout(() => {
    document.getElementById('red-count').innerText = redLeft;
    document.getElementById('blue-count').innerText = blueLeft;
    
    document.getElementById('aimAssistBtn').addEventListener('click', toggleAimAssist);
    document.getElementById('laserAimBtn').addEventListener('click', toggleLaserAim);
    document.getElementById('invertedControlsBtn').addEventListener('click', toggleInvertedControls);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('screenshakeBtn').addEventListener('click', toggleScreenshake);
    document.getElementById('drunkennessBtn').addEventListener('click', toggleDrunkenness);
    document.getElementById('timerBtn').addEventListener('click', toggleTimer);
    document.getElementById('bombBtn').addEventListener('click', toggleBomb);
    document.getElementById('noSkillBtn').addEventListener('click', toggleNoSkill);
    document.getElementById('glitchBtn').addEventListener('click', toggleGlitch);
    document.getElementById('stickyBtn').addEventListener('click', toggleStickyZones);
    document.getElementById('wormholeBtn').addEventListener('click', toggleWormholes);
    document.getElementById('wobblyBoardBtn').addEventListener('click', toggleWobblyBoard);
    document.getElementById('trampolineBtn').addEventListener('click', toggleTrampolines);
  }, 1000);
   // Initialize restart button position
  restartButton.x = width/2 - restartButton.width/2;
  restartButton.y = height/2 + 60;

  // Board tilt initial vector
  tiltVector=createVector(1,0);
  
  // Main screen buttons
  startButton = {
  x: width/2-60,
  y: height/2+160,
  width: 120,
  height: 40,
  hovered: false
};
    rulesButton = {
  x: width/2-60,
  y: height/2+55,
  width: 120,
  height: 40,
  hovered: false
};
    controlsButton = {
  x: width/2-60,
  y: height/2-50,
  width: 120,
  height: 40,
  hovered: false
};
  
}
//-----------------------------------------------------------------------------------------------------------------------------
function updatePowerBar(forceMag) {
  let maxPower = 50;
  let percent = constrain(forceMag / maxPower, 0, 1) * 100;
  document.getElementById('power-fill-left').style.height = percent + "%";
  document.getElementById('power-fill-right').style.height = percent + "%";
}
//-----------------------------------------------------------------------------------------------------------------------------
function updateScores() {
  // Called when coin pocketed or added
  document.getElementById('red-count').innerText = redLeft;
  document.getElementById('blue-count').innerText = blueLeft;
}
//-----------------------------------------------------------------------------------------------------------------------------
function showMessage(text) {
  // Displays messages from special features for set time period (messageDuration)
  messageText = text;
  messageTimer = messageDuration;
}
//-----------------------------------------------------------------------------------------------------------------------------

function findValidPosition(x, y, radius) {
  // General function to find valid positions for things like bounce pads
  let attempts = 0;
  let maxAttempts = 50;
  
  while (attempts < maxAttempts) {
    let valid = true;
    
    // Check collision with existing coins
    for (let coin of coins) {
      let distance = dist(x, y, coin.pos.x, coin.pos.y);
      if (distance < radius + coin.r + 5) { // 5 pixel buffer
        valid = false;
        break;
      }
    }
    
    // Check bounds
    if (x - radius < 60 || x + radius > width - 60 || 
        y - radius < 60 || y + radius > height - 60) {
      valid = false;
    }
    
    if (valid) {
      return createVector(x, y);
    }
    
    // Try new position
    x = random(100, width - 100);
    y = random(100, height - 100);
    attempts++;
  }
  
  // If no valid position found, return original with slight offset
  return createVector(constrain(x, 100, width - 100), constrain(y, 100, height - 100));
}
//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------
function draw() {
  
  
  // console.log(shakeIntensity)
  if (screenshakeEnabled){
        addScreenshake(0.5)
      }
  // Apply screenshake
  if (screenshakeEnabled && shakeIntensity > 0.1) {
    translate(random(-shakeIntensity, shakeIntensity), random(-shakeIntensity, shakeIntensity));
    shakeIntensity *= shakeDecay;
  }

  background(0);
  
  // Apply red glow overlay for timer pressure
  if (redGlowIntensity > 0) {
    fill(255, 0, 0, redGlowIntensity);
    rect(0, 0, width, height);
  }
  
  // Show title screen if game not started
  if (!gameStarted) {
    background(10, 10, 40); 
    if (showRules){
    //console.log('draw')
    background(10, 10, 40);
    onRulesScreen=true;
    showRulesScreen();
    return;
  }else if (showControls){
    background(10, 10, 40);
    onControlsScreen=true;
    showControlsScreen();
    return;
  }else{
    showInfoScreen();
    return;
  }
  }
  
  // Show pause menu if paused
  if (paused) {
    showPauseMenu();
    return;
  }
  if (gameEnded){
    showEndScreen()
    return;
  }


  
    // Draw sticky zones (behind coins)
  if (stickyZonesEnabled && stickyZones.length > 0) {
    push();
    for (let zone of stickyZones) {
      // Draw splodge shape
      fill(139, 69, 19, 120); // Semi-transparent brown
      stroke(160, 82, 45, 180);
      strokeWeight(2);

      beginShape();
      for (let point of zone.points) {
        vertex(point.x, point.y);
      }
      endShape(CLOSE);

      // Add inner darker area
      fill(101, 67, 33, 80);
      noStroke();
      beginShape();
      for (let point of zone.points) {
        let innerX = lerp(point.x, zone.x, 0.4);
        let innerY = lerp(point.y, zone.y, 0.4);
        vertex(innerX, innerY);
      }
      endShape(CLOSE);
    }
    pop();
  }

  drawTrampolines()
  
  
  
  // Update timer and red glow
  if (timerEnabled && isDragging) {
    let aimDuration = millis() - aimStartTime;
    
    // Progressive red glow
    redGlowIntensity = map(aimDuration, 0, maxAimTime, 0, 80);
    redGlowIntensity = constrain(redGlowIntensity, 0, 80);
    
    // Add coin if timer exceeds 5 seconds
    if (aimDuration > maxAimTime) {
      addTimerPenaltyCoin();
  
      isDragging = false;
      redGlowIntensity = 0;
    }
  } else {
    redGlowIntensity = max(0, redGlowIntensity - 2); // Fade out red glow
  }
  
  // Update aiming screenshake
  if (screenshakeEnabled && isDragging) {
    let aimDuration = millis() - aimStartTime;
    let shakeAmount = map(aimDuration, 0, maxAimTime, 0, 3);
    shakeAmount = constrain(shakeAmount, 0, 3);
    shakeIntensity = max(shakeIntensity, shakeAmount);
  }
  
  // Enhanced drunkenness effects
  if (drunkennessEnabled) {
    drunkTime += 0.05;

    // Initialize fade offsets for coins if not done
    if (coinFadeOffsets.length !== coins.length) {
      coinFadeOffsets = [];
      for (let i = 0; i < coins.length; i++) {
        coinFadeOffsets[i] = {
          fadeOffset: random(0, TWO_PI),
          fadeSpeed: random(0.03, 0.07)
        };
      }
    }

    // Generate and update grey clouds
    if (frameCount % 90 === 0) { // Every 1.5 seconds
      // Add new clouds
      for (let i = 0; i < random(2, 5); i++) {
        drunkClouds.push({
          x: random(width),
          y: random(height),
          size: random(60, 120),
          alpha: 0,
          targetAlpha: random(30, 80),
          fadeSpeed: random(0.5, 1.5),
          life: random(180, 300), // 3-5 seconds
          driftX: random(-0.5, 0.5),
          driftY: random(-0.5, 0.5)
        });
      }
    }

    // Update existing clouds
    for (let i = drunkClouds.length - 1; i >= 0; i--) {
      let cloud = drunkClouds[i];

      // Fade in/out logic
      if (cloud.life > 60) { // Fade in
        cloud.alpha = lerp(cloud.alpha, cloud.targetAlpha, cloud.fadeSpeed * 0.02);
      } else { // Fade out in last second
        cloud.alpha = lerp(cloud.alpha, 0, cloud.fadeSpeed * 0.05);
      }

      // Drift movement
      cloud.x += cloud.driftX;
      cloud.y += cloud.driftY;

      cloud.life--;

      if (cloud.life <= 0 || cloud.alpha < 1) {
        drunkClouds.splice(i, 1);
      }
    }
  }

  
  // Game UI - Player info
  stroke('red');
  
  textSize(12);
  fill('red');
  if (greyScale){
    stroke(80,80,80);
  fill(80,80,80);
  }
  text('Player 1: RED', width/2-50, 560);
  text('Left to pocket: ' + redLeft, width/2-57, 580);
  stroke('blue');
  fill('blue');
  if (greyScale){
    stroke(211,211,211);
  fill(211,211,211);
  }
  text('Player 2: BLUE', width/2-53, 8);
  text('Left to pocket: ' + blueLeft, width/2-54, 28);
  
  // Feature status display in corners
  // fill(255);
  // textSize(10);
  // // Bottom left - Aim Assist
  // text("Aim Assist: " + (aimAssist ? "ON" : "OFF"), 100, height - 30);
  
  // // Bottom right - Screenshake
  // text("Screenshake: " + (screenshakeEnabled ? "ON" : "OFF"), width - 220, height - 30);
  
//   // Top left - Drunkenness
//   text("Drunkenness: " + (drunkennessEnabled ? "ON" : "OFF"), 100, 20);
  
//   // Top right - Timer
//   text("Timer: " + (timerEnabled ? "ON" : "OFF"), width - 180, 20);
  
//   // Center top - Bomb
//   if (bombEnabled) {
//     text("Bomb: ON", width/2 - 30, 60);
//   }
  
  //basic updating
  striker.show();
  striker.update();
  drawBoardLines();
  
  drawTrampolines()
  
  for (let coin of coins) {
    coin.show();
    coin.update();
  }
  
    // Glitch mode logic
  if (glitchEnabled && millis() - lastGlitchTime > glitchInterval) {
    teleportRandomCoin();
    lastGlitchTime = millis();
  }

  // Draw glitch effects
  for (let i = glitchEffects.length - 1; i >= 0; i--) {
    let effect = glitchEffects[i];

    push();
    // Glitch visual effect
    stroke(0,255,255, effect.alpha);
    strokeWeight(2);
    fill(0,255,255,effect.alpha-100);

    // Draw glitchy rectangles around the effect position
    for (let j = 0; j < 5; j++) {
      let offsetX = random(-5, 5);
      let offsetY = random(-5, 5);
      let size = random(20, 40);
      rectMode(CENTER)
      rect(effect.x + offsetX, effect.y + offsetY, size, size);
    }
    pop();

    effect.alpha -= 8; // Fade out
    effect.timer--;

    if (effect.timer <= 0 || effect.alpha <= 0) {
      glitchEffects.splice(i, 1);
    }
  }

  
    // Draw coin trails
  for (let i = 0; i < coins.length; i++) {
    let coin = coins[i];
    let trail = coinTrails[i];

    // Add current position to trail if coin is moving
    if (coin.vel.mag() > 0.5) {
      trail.push({
        x: coin.pos.x,
        y: coin.pos.y,
        life: 15 // Trail point lifespan
      });
    }

    // Draw and update trail
    for (let j = trail.length - 1; j >= 0; j--) {
      let point = trail[j];
      let alpha = map(point.life, 0, 15, 0, 40);

      push();
      fill(coin.col[0], coin.col[1], coin.col[2], alpha);
      if (greyScale){
        if (coin.col[0] === 255 && coin.col[1] === 0 && coin.col[2] === 0) {
          fill(80, 80, 80, alpha);  // Dark gray for red coins
        } else if (coin.col[0] === 0 && coin.col[1] === 0 && coin.col[2] === 255) {
          fill(211, 211, 211, alpha);  // Light gray for blue coins
        }else if (coin.col[0] === 255 && coin.col[1] === 215 && coin.col[2] === 0) {
          fill(10,10,10, alpha);  // Near black for queen
        }
      }
      noStroke();
      let size = map(point.life, 0, 15, 4, 25);
      if (j==0){
        let size = map(point.life, 0, 15, 4, 30+8);
      }
      
      ellipse(point.x, point.y, size);
      pop();

      point.life--;
      if (point.life <= 0) {
        trail.splice(j, 1);
      }
    }

    // Limit trail length
    if (trail.length > 8) {
      trail.shift();
    }
  }

  
  
  
  fill(255);
  // Check if bomb moved
  if (bombEnabled && bombCoin && !bombMoved) {
    if (bombCoin.vel.mag() > 0.1) {
      bombMoved = true;
    }
  }
  

  
  // Display message (from special features) if active
  if (messageTimer > 0) {
    fill(255, 255, 0, map(messageTimer, 0, messageDuration, 0, 255));
    textAlign(CENTER);
    textSize(20);
    text(messageText, width/2, height/2 - 100);
    textAlign(LEFT);
    messageTimer--;
  }
  
  // Aim assist guide lines
  // Replace the existing aim assist code with this:
  if (isDragging && allStopped() && (aimAssist || laserAim)) {
    push();
    stroke(255, 100);
    strokeWeight(2);
    line(striker.pos.x, striker.pos.y, mouseX, mouseY);

    let aimVec = p5.Vector.sub(striker.pos, createVector(mouseX, mouseY));
    let aimLength = constrain(aimVec.mag(), 0, 80);
    aimVec.setMag(aimLength);

    let endPoint;
    if (laserAim) {
      // Extend line across entire screen
      aimVec.normalize();
      aimVec.mult(1000); // Make it very long
      endPoint = p5.Vector.add(striker.pos, aimVec);
      stroke(0,255,136, 100); 
      strokeWeight(3);
    } else {
      endPoint = p5.Vector.add(striker.pos, aimVec);
      stroke(255, 200);
      strokeWeight(3);
    }

    line(striker.pos.x, striker.pos.y, endPoint.x, endPoint.y);
    
    

  //Direction parallel to shot
  let parallel = aimVec.copy()
  parallel.setMag(15); // arrow length

  // Perpendicular to that direction
  let perp = createVector(-parallel.y, parallel.x); //let perp = direction.copy().rotate(HALF_PI).setMag(5); works too
  perp.setMag(5); // half width of arrow base

  // Triangle points (no mutation)
  let p1 = p5.Vector.add(endPoint, perp);
  let p2 = p5.Vector.sub(endPoint, perp);
  let p3 = p5.Vector.add(endPoint, parallel);//have to do this or .copy().add()because otherwise, it mutates original vector endPoint. .copy.add is too much computation, makes it slow and laggy.

  noStroke();
  fill(0,255,0);
  triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);


   
    pop();
  
  } else {
    updatePowerBar(0);
  }

    if (isDragging && allStopped()) {
      let mouseVec = createVector(constrain(mouseX, 0, width), constrain(mouseY, 0, height));
      let force = p5.Vector.sub(striker.pos, mouseVec);
      updatePowerBar(force.mag());
    }
  

  
  // Pocketing function calls
  checkPocketedCoins();
  removePocketedCoins();
  checkDue();
  
  if (waitingForNextTurn && allStopped()) {
    // Handle bomb explosion
    if (bombEnabled && bombCoin && bombMoved) {
      explodeBomb();
    } else if (bombEnabled && bombCoin && !bombMoved) {
      // Bomb didn't move, reset it and select new one for opposite player
      bombCoin.col = bombCoin.originalColour;
      bombCoin.isBomb = false;
      bombCoin = null;
    }
    
    // Determines whose turn it is next based on whether the player pocketed on that turn. The placeStriker() function handles due.
    if (playerHasPocketedCoin == false) {
      switchTurn();
    }
    waitingForNextTurn = false;
    playerHasPocketedCoin = false;
    striker.placeStriker(due);
    
    // Select new bomb coin for the new turn
    if (bombEnabled) {
      selectBombCoin();
    }
  }
  
  updateScores();
  checkWin();
  
    // Draw grey clouds for drunkenness
  if (drunkennessEnabled && drunkClouds.length > 0) {
    push();
    for (let cloud of drunkClouds) {
      // Create soft, blurry cloud effect with multiple layers
      for (let layer = 0; layer < 4; layer++) {
        let layerAlpha = cloud.alpha / (layer+0.5);
        let layerSize = cloud.size + (layer * 25);

        fill(random(60,140), random(60,140), random(60,140), layerAlpha); // Grey colour
        noStroke();

        // Add some randomness to cloud shape
        let offsetX = sin(drunkTime + cloud.x * 0.01) * 5;
        let offsetY = cos(drunkTime + cloud.y * 0.01) * 5;

        ellipse(cloud.x + offsetX, cloud.y + offsetY, random(layerSize-20, layerSize+20), random(layerSize-20, layerSize+20));
      }

      // Add some darker spots within the cloud for more realistic effect
      for (let spot = 0; spot < 3; spot++) {
        fill(70,69,69, cloud.alpha * 0.6);
        let spotX = cloud.x + random(-cloud.size/3, cloud.size/3);
        let spotY = cloud.y + random(-cloud.size/3, cloud.size/3);
        let spotSize = random(cloud.size/4, cloud.size/2);
        ellipse(spotX, spotY, spotSize);
      }
    }
    pop();
  }

}
//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
function showPauseMenu() {
  push()
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  
  // Pause menu background
  fill(30, 30, 50);
  stroke(100);
  strokeWeight(3);
  rect(width/2 - 150, height/2 - 100, 300, 200, 10);
  
  // Pause menu content
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("PAUSED", width/2, height/2 - 70);
  
  textSize(14);
  text("Press P to Resume", width/2, height/2 - 30);
  text("Press R to Restart", width/2, height/2 -5);
  text("Press ESC for Main Menu", width/2, height/2 + 20);
  text("Press G for Greyscale theme", width/2, height/2 + 45);
  
  
  // Pulsing border
  let pulseAlpha = map(sin(millis() * 0.01), -1, 1, 100, 255);
  stroke(100, 200, 255, pulseAlpha);
  strokeWeight(2);
  noFill();
  rect(width/2 - 155, height/2 - 105, 310, 210, 15);
  
  textAlign(LEFT);
  pop()
}
//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
function mousePressed() {

  // console.log(restartButton.hovered)
  // console.log(gameEnded)
  if (gameEnded && restartButton.hovered) {
    //console.log('hi')
    gameEnded = false;
    winner = null;
    resetBoard();
    return;
  }
    if (!gameStarted && startButton.hovered){
    gameStarted = true;
    textAlign(LEFT, TOP);
    textSize(14);
    return;
  }
    
  if (!gameStarted && rulesButton.hovered){
    //console.log('clicked')
    showRules = true;
    showRulesScreen()
  }
  if (showRules==true && onRulesScreen){
    showRules=false
    onRulesScreen=false
    showInfoScreen()
  }
  
  if (!gameStarted && controlsButton.hovered){
    //console.log('cclicked')
    showControls = true;
    showControlsScreen()
  }
  if (showControls==true && onControlsScreen){
    showControls=false
    onControlsScreen=false
    showControlsScreen()
  }
  
  // Nullifies mouse press on pause screen
  if (paused) return;
  
  // Checks if aiming
  if (allStopped() && striker.strikerIsHovered()) {
    isDragging = true;

    aimStartTime = millis();
  }

 for (let i = 0; i < trampolines.length; i++) {
    let t = trampolines[i];
  let halfW = widd / 2;
  let halfH = high / 2;

  // MAKE INTO FUNCTION, trampolineIsHovered()
   // Checks if player is trying to move a bounce pad
  if (
    mouseX > t.x - halfW && // right side past left side
    mouseX < t.x + halfW && // left side past right side
    mouseY > t.y - halfH && // bottom past top
    mouseY < t.y + halfH    // top past bottom
  ) {
    trampolineClicked=true
    tClickedIndex=i
    drawTrampolines()
    
  }
}
}
//-----------------------------------------------------------------------------------------------------------------------------
function mouseReleased() {
  // Nullifies mouse release in pause screen
  if (paused) return;
  
  // Striking mechanics
  if (isDragging && allStopped() && !striker.strikerIsHovered()) {
    let mousex = constrain(mouseX, 0, width);
    let mousey = constrain(mouseY, 0, height);
    let dragEnd = createVector(mousex, mousey);
    let force = p5.Vector.sub(striker.pos, dragEnd);
    
    // Apply inverted controls if enabled
    if (invertedControls) {
      force.x *= -1; // Invert x direction (reflect across y axis)
    }
    //console.log(force.mag())
    let forceMag = force.mag();
    if (forceMag > 100) {
      force.setMag(map(forceMag, 0, 400, 0, 50));
    } else {
      force.setMag(map(forceMag, 0, 100, 0, 50));
    }
    
    striker.applyForce(force);
    
    let shakeAmount = map(forceMag, 0, 400, 2, 8);
    addScreenshake(shakeAmount);
    
    waitingForNextTurn = true;
    isDragging = false;
  
    redGlowIntensity = 0;
  }
  
  // Calls bounce pad drawing function if moved
  if (trampolineClicked){
    trampolineClicked=false
    if (dist(mouseX, mouseY, width/2, height/2) < 100){
      drawTrampolines()
    }else{
      trampolines[tClickedIndex].x=mouseX
    trampolines[tClickedIndex].y=mouseY
    drawTrampolines()
    }
    
  }
  
  // Checks if player has shot on covering turn
  if (coverTurn) {
    sOnCTurn = true;
    coverTurn = true;
  }
}

//-----------------------------------------------------------------------------------------------------------------------------
function keyPressed() {
  // Pause functionality
  if (key === 'p' || key === 'P') {
    if (gameStarted) {
      togglePause();
    }
    return;
  }
  
  if (gameEnded){
    if (keyCode === ESCAPE) {
      gameEnded = false;
      winner=null
      gameStarted = false;
      resetBoard();
      return;
    }
  }
  // Handle pause menu navigation
  if (paused) {
    if (key === 'r' || key === 'R') {
      paused = false;
      resetBoard();
      return;
    }
    if (keyCode === ESCAPE) {
      paused = false;
      
      gameStarted = false;
      resetBoard();
      
      return;
    }
     if (key==='g'||key==='G') {
      greyScale=!greyScale

      
    }
    return; // Nullifies key presses when paused
  }
  
  // Title screen press play to start
  if (!gameStarted && key === ' ') {
    gameStarted = true;
    textAlign(LEFT, TOP);
    textSize(14);
    return;
  }
  
  // Reset shortcut (mainly for ease of development)
  if (key === 'r' || key === 'R') {
    textSize(14);
    textAlign(LEFT, TOP);
    resetBoard();
  }
  
  // Music track changing
  if (key==='0'){
    playTrack(0);
  }
  if (key==='1'){
    playTrack(1);
  }
  if (key==='2'){
    playTrack(2);
  }
  if (key==='3'){
    playTrack(3);
  }
  if (key==='4'){
    playTrack(4);
  }
  if (key==='5'){
    playTrack(5);
  }
  
  // Striker movement left or right before striking
  const moveAmount = 10;
  if (allStopped() && !isDragging) {
    if (keyCode === LEFT_ARROW) {
      striker.pos.x -= moveAmount;
      if (striker.pos.x < 100) {
        striker.pos.x = 100;
      }
    } else if (keyCode === RIGHT_ARROW) {
      striker.pos.x += moveAmount;
      if (striker.pos.x > 500) {
        striker.pos.x = 500;
      }
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function togglePause() {
  if (gameStarted&&!gameEnded) {
    paused = !paused;
    for (let i of tracks){
      if (i.isPlaying()){
        currentTrack=i
      }
    }
    if (currentTrack.isPlaying()){
      currentTrack.pause()
    }else{
      currentTrack.play()
    }
    // Add a little screenshake when pausing/unpausing
    addScreenshake(1);
    let btn = document.getElementById('pauseBtn');
    if (paused) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function drawBoardLines() {
  // Draws board lines and pockets, and draws bounce pads if the mode is enabled
  push()
  stroke(198,255,0)
  if (greyScale){
        stroke(169)
      }
  line(100, 50, 500, 50);
  line(100, 550, 500, 550);
  line(50, 100, 50, 500);
  line(550, 100, 550, 500);
  
  line(100, 100, 250, 250);
  line(500, 100, 350, 250);
  line(100, 500, 250, 350);
  line(500, 500, 350, 350);
  
  fill(198,255,0);
  stroke(255, 20, 147)
  if (greyScale){
        stroke(100)
    fill(149)
      }
  strokeWeight(5)
  // Fixed: Back to original pocket size
  ellipse(0, 0, pocketRadius);
  ellipse(width, 0, pocketRadius);
  ellipse(0, height, pocketRadius);
  ellipse(height, width, pocketRadius);
  
  noFill();
  stroke(198,255,0)
  if (greyScale){
        stroke(169)
      }
  strokeWeight(1)
  ellipse(width/2, height/2, 100);
  ellipse(width/2, height/2, 80);
  ellipse(width/2, height/2, 20);
  
  if (trampolinesEnabled){
    noFill()
    stroke(165,0,255)
    strokeWeight(6)
    rectMode(CORNER)
    rect(0,0,width,height)
  }
  pop()
}
//-----------------------------------------------------------------------------------------------------------------------------
function createCoins() {
  pocket1 = createVector(0, 0);
  pocket2 = createVector(width, 0);
  pocket3 = createVector(0, height);
  pocket4 = createVector(width, height);
  pockets.push(pocket1, pocket2, pocket3, pocket4);
  // This function is for the setup of coins and striker at the start of the game
  let centre = createVector(width / 2, height / 2);
  let radius = coinSize/2; // Fixed: Back to original size
  let spacing = radius*2;
  
  striker = new Striker(400, 550, strikerSize/2, colours.w, strikerMass); // Fixed: Back to original size
  coins.push(striker);
  
  queen = new Coin(centre.x, centre.y, radius, colours.g, coinMass);
  coins.push(queen);
  
  let positions = [];

  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i;
    let x = centre.x + spacing * sin(angle);
    let y = centre.y + spacing * cos(angle);
    positions.push(createVector(x, y));
  }

  for (let i = 0; i < 12; i++) {
    let angle = TWO_PI / 12 * i;
    let x = centre.x + spacing * 2 * sin(angle);
    let y = centre.y + spacing * 2 * cos(angle);
    positions.push(createVector(x, y));
  }

  let toggle = true;
  for (let i = 0; i < positions.length; i++) {
    let col = toggle ? colours.r : colours.b;
    coins.push(new Coin(positions[i].x, positions[i].y, radius, col, coinMass));
    toggle = !toggle;
  }
  //console.log(coins)
}
//-----------------------------------------------------------------------------------------------------------------------------
function allStopped() {
  // Checks if all coins are not moving
  if (striker.vel.mag() > 0.01) return false;
  for (let coin of coins) {
    if (coin.vel.mag() > 0.01) return false;
  }
  return true;
}
//-----------------------------------------------------------------------------------------------------------------------------
function switchTurn() {
  currentPlayer = currentPlayer == 1 ? 2 : 1;
}
//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
function checkPocketedCoins() {
  //checks which coins have been pocketed and stores them to the coinsToRemove array, and they will be removed from the board by the removePocketedCoins() function. Also checks again if the queen can be removed (if it's been covered). The exception is for the striker which is at index 0 in the coins array and is not removed under any circumstance.
  if (coverTurn && sOnCTurn) {

    for (let coin of coins) {
      if (coin.pocketed()) {
        if (!coinsToRemove.includes(coin) && (coins.indexOf(coin)) != 0) {
          coinsToRemove.push(coin);
          // Add screenshake when coin is pocketed
          addScreenshake(3);
          
          if (currentPlayer == 1 && coin.col == (colours.r)) {
            queenCovered = true;
            queenNeedsCovering = false;
            coverTurn = false;
            sOnCTurn = false;
            
            playerHasPocketedCoin = true;
            console.log('Player 1 covered the queen with red coin');
          }
          if (currentPlayer == 2 && coin.col == (colours.b)) {
            queenCovered = true;
            queenNeedsCovering = false;
            coverTurn = false;
            sOnCTurn = false;
            
            playerHasPocketedCoin = true;
            console.log('Player 2 covered the queen with blue coin');
          }
        }
      }
    }
    
    
  } else {
    for (let coin of coins) {
      if (coin.pocketed()) {
        if (!coinsToRemove.includes(coin) && (coins.indexOf(coin)) != 0) {
          coinsToRemove.push(coin);
          // Add screenshake when coin is pocketed
          addScreenshake(3);
          
          if (currentPlayer == 1 && coin.col == (colours.r || colours.g)) {
            playerHasPocketedCoin = true;
          }
          if (currentPlayer == 2 && coin.col == (colours.b || colours.g)) {
            playerHasPocketedCoin = true;
          }
          if (coin.col == colours.g) {
            queenNeedsCovering = true;
            playerHasPocketedCoin = true;
            coverTurn = true;
            // Extra screenshake for queen
            addScreenshake(5);
            console.log("Queen was pocketed!");
            console.log(queenCovered, queenNeedsCovering, coverTurn);
          }
        }
      }
    }
  }
}

//-----------------------------------------------------------------------------------------------------------------------------
function removePocketedCoins() {
  // Removes coins that have been legally pocketed
  for (let coin of coinsToRemove) {
    // Check if this is a bomb coin being removed
    if (coin === bombCoin) {
      bombCoin = null;
    }
    
    // Update counters based on original colour for bomb coins
    let coinColour = coin.originalColour || coin.col;
    
    if (coinColour == colours.r && redLeft > 0) {
      redLeft--;
    }
    if (coinColour == colours.b && blueLeft > 0) {
      blueLeft--;
    }
    
    let index = coins.indexOf(coin);
    if (index !== -1) {
      coins.splice(index, 1);
    }
  }
  coinsToRemove = [];
}
//-----------------------------------------------------------------------------------------------------------------------------
function checkDue() {
  // Checks if player pocketed striker (due)
  if (coins[0].pocketed()) {
    due = true;
    textSize(100);
    fill('white');
    text('DUE', 144, height/2-60);
    textSize(14);
    // Ensures the striker doesnt move after being pocketed
    striker.vel.mult(0)
    if (striker.pos<50 && striker.pos<50){
      striker.pos=(5,5)//THIS DOESNT ACTUALLY DO ANYTHING???
    } else if (striker.pos<50 && striker.pos>height-50){
      striker.pos=(5,height-5)
    } else if (striker.pos>width-50 && striker.pos<50){
      striker.pos=(width-5,5)
    } else if (striker.pos>width-50 && striker.pos>height-50){
      striker.pos=(width-5,height-5)
    }
    striker.vel.mult(0)
    // Add screenshake for due
    addScreenshake(4);
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function checkWin() {
  // Checks if game if player has pocketed all coins - game over 
  if (redLeft == 0) {
    winner = 'RED';
    gameEnded = true;
    return
  } else if (blueLeft == 0) {
    winner = 'BLUE';
    gameEnded = true;
    return
  }
}

//-----------------------------------------------------------------------------------------------------------------------------
function showEndScreen() {
  // Ending screen has background with winner's colour
  // Play ending music
  if (controlVar==true){
    for (let i of tracks){
      if (i.isPlaying()){
        i.stop()
      }
    }
    endTrack.loop()
  }
  controlVar=false
  //push()
  push();
  
  // Create animated gradient background
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let wave = sin(millis() * 0.003 + i * 0.02) * 0.3 + 0.7;
    
    if (winner === 'RED') {
      let c = lerpColor(color(251,46,46), color(240,5,254), inter * wave);
      stroke(c);
    } else {
      let c = lerpColor(color(0, 0, 100), color(50, 50, 255), inter * wave);
      stroke(c);
    }
    line(0, i, width, i);
  }
  
  
  // Main background panel (like pause menu)
  fill(0,0,0);
  stroke(winner === 'RED' ? color(0,255,136) : color(0,255,136));
  strokeWeight(4);
  rect(width/2 - 200, height/2 - 150, 400, 300, 15);
  
  // Pulsing border effect
  let pulseAlpha = map(sin(millis() * 0.008), -1, 1, 200, 255);
  stroke(winner === 'RED' ? color(255, 0, 0, pulseAlpha) : color(0, 0, 255, pulseAlpha));
  strokeWeight(4);
  noFill();
  rect(width/2 - 205, height/2 - 155, 410, 310, 20);
  
  // Winner text
  textAlign(CENTER);
  fill(winner === 'RED' ? color(0) : color(0));
  textSize(48);
  textFont(titleFont);
  
  // Bouncing text effect
  let bounce = sin(millis() * 0.008) * 3;
  push()
  if (winner=='BLUE'){
    textSize(44)
  }
  text(winner + " WINS!", width/2, height/2 - 80 + bounce);
  pop()
  
  // Funny message
  fill(winner === 'RED' ? color(255, 0, 0, pulseAlpha) : color(0, 0, 255, pulseAlpha));
  // noStroke()
  textSize(14);
  let loser = winner === 'RED' ? 'BLUE' : 'RED';
  let funnyMessages = [
    loser + " got smoked!",
    loser + ", get practicing!",
    loser + " got cooked!",
    loser + " got had off!",
    "Back to the drawing board, " + loser,
    loser + " got played!",
    loser + ", try aiming next time",
    loser + " was clearly just playing for vibes",
  ];
  
  // Use a consistent message based on game state
  let messageIndex = int(random(0,7))
  //console.log(messageIndex)
  //console.log(funnyMessages[messageIndex])
  if (changeMessage){
    finalMessage=funnyMessages[messageIndex]
    changeMessage=false
  }
  noStroke()
  text(finalMessage, width/2, height/2 + 20);
  

  
  
  // Check if mouse is over restart button
  restartButton.hovered = (mouseX >= restartButton.x && 
                          mouseX <= restartButton.x + restartButton.width &&
                          mouseY >= restartButton.y && 
                          mouseY <= restartButton.y + restartButton.height);
  
  // Restart button
  if (restartButton.hovered) {
    fill(winner === 'RED' ? color(255, 150, 150) : color(150, 150, 255));
    stroke(255);
    strokeWeight(3);
  } else {
    fill(winner === 'RED' ? color(200, 50, 50) : color(50, 50, 200));
    stroke(winner === 'RED' ? color(255, 100, 100) : color(100, 100, 255));
    strokeWeight(2);
  }
  
  push()
  fill(winner === 'RED' ? color(255, 0,0) : color(0,0, 255));
  rect(restartButton.x, restartButton.y, restartButton.width, restartButton.height, 8);
  pop()
  push()
  noStroke()
  fill(255);
  textSize(14);
  text("RESTART", restartButton.x + restartButton.width/2, restartButton.y + restartButton.height/2-8);
  pop()
  
  // Additional instructions
  fill(winner === 'RED' ? color(255, 0, 0, pulseAlpha) : color(0, 0, 255, pulseAlpha));
  noStroke()
  textSize(14);
  text("Press R to restart or ESC for main menu", width/2, height/2 + 120);
  
  pop();
  //pop()
}


//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
function resetBoard() { 
  // Resets game variables
  coins = [];
  coinsToRemove = [];
  createCoins();
  striker.reset();
  waitingForNextTurn = false;
  playerHasPocketedCoin = false;
  currentPlayer = 1;
  redLeft = 9;
  blueLeft = 9;
  due = false;
  shakeIntensity = 0;

  redGlowIntensity = 0;
  drunkTime = 0;
  bombCoin = null;
  bombMoved = false;
  messageTimer = 0;
  glitchEffects = [];
  lastGlitchTime = 0;
  drunkClouds = [];
  coinFadeOffsets = [];
  stickyZones = [];
  // Reset end screen variables
  gameEnded = false;
  winner = null;
  endScreenAnimation = 0;
  controlVar=true
  
  let btn = document.getElementById('pauseBtn');
  btn.classList.remove('active');
  
  // Resets music
  for (let i of tracks){
    if (i.isPlaying()){
      i.stop()
    }
  }
  if (endTrack.isPlaying()){
    endTrack.stop()
  }
  startTrack.loop()

  
  // Reset coin trails
  for (let i = 0; i < coinTrails.length; i++) {
    coinTrails[i] = [];
  }
}


//-----------------------------------------------------------------------------------------------------------------------------
function showInfoScreen() {
  push()
  textAlign(LEFT, BASELINE)
  
  background(10, 10, 40);
  push();
  push()
  rectMode(CENTER)
  strokeWeight(10)
  noFill()
  stroke(0, 255, 255)
  rect(width/2, height/2, 590,590)
  pop()
  fill(255);
  textAlign(CENTER);

  fill(255, 20, 147);
  textSize(86);
  textFont(titleFont);
  text("CARROM", width / 2, 90);

  strokeWeight(2)
  stroke(255, 20, 147, 100)
  line(29,98,width-29,98)
  textSize(10);
  fill(0, 255, 255);
  
  text('CREATED BY', width/2, 160)
  textSize(24);
  text("Shamal Harave", width / 2, 185);
  push()
  push()
  
  startButton.hovered = (mouseX >= startButton.x && 
                          mouseX <= startButton.x + startButton.width &&
                          mouseY >= startButton.y && 
                          mouseY <= startButton.y + startButton.height);
  if (startButton.hovered) {
    fill(0, 255, 255);
    stroke(255, 20, 147);
    strokeWeight(3);
  } else {
    fill(0, 230, 230);
    strokeWeight(2);
  }
  rect(startButton.x, startButton.y, startButton.width, startButton.height, 8);
  pop()
  push()
  controlsButton.hovered = (mouseX >= controlsButton.x && 
                          mouseX <= controlsButton.x + controlsButton.width &&
                          mouseY >= controlsButton.y && 
                          mouseY <= controlsButton.y + controlsButton.height);
  if (controlsButton.hovered) {
    fill(198,255,0);
    stroke(255, 20, 147);
    strokeWeight(3);
  } else {
    fill(173,230,0);
    strokeWeight(2);
  }
  rect(controlsButton.x, controlsButton.y, controlsButton.width, controlsButton.height, 8);

  pop()
  push()
    rulesButton.hovered = (mouseX >= rulesButton.x && 
                          mouseX <= rulesButton.x + rulesButton.width &&
                          mouseY >= rulesButton.y && 
                          mouseY <= rulesButton.y + rulesButton.height);
  if (rulesButton.hovered) {
    fill(255, 255, 0);
    stroke(255, 20, 147);
    strokeWeight(3);
  } else {
    fill(230, 230, 0);
    strokeWeight(2);
  }
  

  rect(rulesButton.x, rulesButton.y, rulesButton.width, rulesButton.height, 8);
  pop()
  
  noStroke()
  fill(0);
  textSize(14);
  
  text("START", startButton.x + startButton.width/2, startButton.y + startButton.height/2+5);
  text("CONTROLS", controlsButton.x + controlsButton.width/2, controlsButton.y + controlsButton.height/2+5);
  text("RULES", rulesButton.x + rulesButton.width/2, rulesButton.y + rulesButton.height/2+5);
  
  
  pop()

  pop()
  pop()
}
//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------
function playTrack(trackNumber){
  // Handles user music selection
  for (let i of tracks){
    if (i.isPlaying()){
        i.stop();
        }
      }
  switch (trackNumber) {
    case 0:
      tracks[0].loop();
      break;
    case 1:
      tracks[1].loop();
      break;
    case 2:
      tracks[2].loop();
      break;
    case 3:
      tracks[3].loop();
      break;
    case 4:
      tracks[4].loop();
      break;
    case 5:
      tracks[5].loop();   
      break;
}
}
//-----------------------------------------------------------------------------------------------------------------------------
  function showRulesScreen(){
  
  push()
  textAlign(CENTER, BASELINE)
  rectMode(CENTER)
  strokeWeight(10)
  noFill()
  stroke(0, 255, 255)
  rect(width/2, height/2, 500,500)
  fill(255, 20, 147);
  noStroke()
  textSize(40);
  text("Rules:", width / 2, 170);
  textSize(18)
  fill(255, 255, 0);
  text("Pocket all your coins before your opponent!", width / 2, 250, 350);
  text("Cover the Queen (gold) with your own coin or she'll return.", width / 2, 350, 400);
  text("Don't pocket the striker or your opponent's coins!", width / 2, 450, 304);
  fill(255, 20, 147);
  text("Click to return", width/2, 585);
  pop()
}

function showControlsScreen(){
  //console.log('cfunc')
  
  push()
  textAlign(CENTER, BASELINE)
  rectMode(CENTER)
  strokeWeight(10)
  noFill()
  stroke(0, 255, 255)
  rect(width/2, height/2, 500,500)
  fill(255, 20, 147);
  noStroke()
  textSize(40);
  text("Controls:", width / 2, 170);
  textSize(18)
  fill(198,255,0);
  text("L + R Arrow Keys to move striker", width / 2, 250);
  text("Click & Drag to aim", width / 2, 300);
  text("Release to shoot", width / 2, 350);
  text("P - Pause game", width / 2, 400);
  text("R - Reset game", width / 2, 450);
  textSize(13)
  text("0: Track0   1: Track1   2: Track2   3: Track3   4: Track4   5: Track5", width/2, 500, 380)
  fill(255, 20, 147);
  textSize(18)
  text("Click to return", width/2, 585);
  pop()
}

//-----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------