// Utility functions for special features:
//--------------------------------------------------------------------------------------------------
function selectBombCoin() {
  if (!bombEnabled) return;
  
  // Clear previous bomb
  if (bombCoin) {
    bombCoin.isBomb = false;
    bombCoin.originalColour = null;
  }
  
  // Find coins of current player's colour
  let playerCoins = coins.filter(coin => {
    if (currentPlayer == 1) {
      return coin.col == colours.r && coin !== striker;
    } else {
      return coin.col == colours.b && coin !== striker;
    }
  });
  // Select which coin to be the bomb
  if (playerCoins.length > 0) {
    bombCoin = random(playerCoins);
    bombCoin.isBomb = true;
    bombCoin.originalColour = bombCoin.col;
    bombCoin.col = colours.bomb;
    bombMoved = false;
  }
}
//--------------------------------------------------------------------------------------------------

function explodeBomb() {
  if (!bombCoin) return;
  
  let bombPos = createVector(bombCoin.pos.x, bombCoin.pos.y);
  let originalColour = bombCoin.originalColour;
  
  // Remove the bomb coin first
  let bombIndex = coins.indexOf(bombCoin);
  if (bombIndex !== -1) {
    coins.splice(bombIndex, 1);
  }
  
  // Create 3 debris coins with collision checking
  for (let i = 0; i < 3; i++) {
    let angle = (TWO_PI / 3) * i + random(-0.3, 0.3);
    let distance = random(40, 80);
    let x = bombPos.x + cos(angle) * distance;
    let y = bombPos.y + sin(angle) * distance;
    
    // Find valid position that doesn't overlap
    let validPos = findValidPosition(x, y, 12.5); 
    
    let debrisCoin = new Coin(validPos.x, validPos.y, 12.5, originalColour, coinMass);
    coins.push(debrisCoin);
    
    // Update counters (net +2 since we removed bomb coin and added 3)
    if (originalColour == colours.r) {
      redLeft++;
    } else if (originalColour == colours.b) {
      blueLeft++;
    }
  }
  if (originalColour == colours.r) {
      redLeft--;
  } else if (originalColour == colours.b) {
      blueLeft--;
  }  
  
  
  showMessage("BOMB EXPLODED! +2 coins added!");
  addScreenshake(8);
  
  // Reset bomb
  bombCoin = null;
}

//--------------------------------------------------------------------------------------------------

function teleportRandomCoin() {
  // Get all coins except striker
  let teleportableCoin = coins.filter(coin => coin !== striker);
  
  if (teleportableCoin.length === 0){
    return;
  } 
  
  // Select random coin
  let coinToTeleport = random(teleportableCoin);
  let oldPos = createVector(coinToTeleport.pos.x, coinToTeleport.pos.y);
  let newPos = findValidPosition(random(80, width - 80), random(80, height - 80), 12.5);
    
  // Teleport the coin
  coinToTeleport.pos = newPos;
  coinToTeleport.vel.mult(0); // Stop the coin
  
  // Add glitch effects at both old and new positions
  glitchEffects.push({
    x: oldPos.x,
    y: oldPos.y,
    alpha: 255,
    timer: 30
  });
  
  glitchEffects.push({
    x: newPos.x,
    y: newPos.y,
    alpha: 255,
    timer: 30
  });
  
  // Add screenshake for glitch effect
  addScreenshake(3);
  
  //showMessage("GLITCH! Coin teleported!");
}
//--------------------------------------------------------------------------------------------------

function generateStickyZones() {
  stickyZones = [];
  
  for (let i = 0; i < 2; i++) {
    let attempts = 0;
    let validPosition = false;
    let x, y;
    
    while (!validPosition && attempts < 50) {
      x = random(zoneSize/2, width-zoneSize/2);
      y = random(zoneSize/2, height -zoneSize/2);
      
      // Check if position is valid (not too close to center, other zones, or pockets)
      //let distFromCenter = dist(x, y, width/2, height/2);
      let tooCloseToOtherZone = false;
      
      for (let zone of stickyZones) {
        if (dist(x, y, zone.x, zone.y) < zoneSize * 1.5) {
          tooCloseToOtherZone = true;
          break;
        }
      }
      
      // Check distance from pockets
      let tooCloseToCorner = false;
      for (let pocket of pockets) {
        if (dist(x, y, pocket.x, pocket.y) < 120) {
          tooCloseToCorner = true;
          break;
        }
      }
      
      if (!tooCloseToOtherZone && !tooCloseToCorner) {
        validPosition = true;
      }
      attempts++;
    }
    
    if (validPosition) {
      // Generate splodge shape points
      let points = [];
      let numPoints = 10;
      for (let j = 0; j < numPoints; j++) {
        let angle = (TWO_PI / numPoints) * j;
        let radius = zoneSize/2 * random(0.7, 1.3); // Irregular radius
        let px = x + cos(angle) * radius;
        let py = y + sin(angle) * radius;
        points.push({x: px, y: py});
      }
      
      stickyZones.push({
        x: x,
        y: y,
        points: points,
        size: zoneSize
      });
    }
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function generateTrampolines(){
  // This is to generate the bounce pads
  trampolines=[]
  
  for (let i = 0; i < 2; i++) {
    let attempts = 0;
    let validPosition = false;
    let x, y;
    
    while (!validPosition && attempts < 50) {
      x = random(100, width-100);
      y = random(100, height -100);
      
      //Check if position is valid (not too close to center, other trampolines, or pockets)
      let distFromCentre = dist(x, y, width/2, height/2);
      let tooCloseToCentre=false
      if (distFromCentre<100){
        tooCloseToCentre=true
      }
      
      let tooCloseToOtherTrampoline = false;
      
      for (let t of trampolines) {
        if (dist(x, y, t.x, t.y) < currentTrampolineLength * 4) {
          tooCloseToOtherTrampoline = true;
          break;
        }
      }
      

      // Check distance from pockets
      let tooCloseToCorner = false;
      for (let pocket of pockets) {
        if (dist(x, y, pocket.x, pocket.y) < 150) {
          tooCloseToCorner = true;
          break;
        }
      }
      
      if (!tooCloseToOtherTrampoline && !tooCloseToCorner &&!tooCloseToCentre) {
        validPosition = true;
      }
      attempts++;
    }
    
    if (validPosition){
      trampolines.push({
        x: x,
        y: y
      });
    }
  }
}


//--------------------------------------------------------------------------------------------------

function addTimerPenaltyCoin() {
  let newCoinColour;
  if (currentPlayer == 1) {
    newCoinColour = colours.r;
    redLeft++;
  } else {
    newCoinColour = colours.b;
    blueLeft++;
  }
  
  // Add coin with collision checking
  let validPos = findValidPosition(width/2, height/2, 12.5);
  coins.push(new Coin(validPos.x, validPos.y, 12.5, newCoinColour, coinMass));
  
  showMessage("Too slow! +1 coin added!");
  
  // Add screenshake for penalty
  if (screenshakeEnabled) {
    addScreenshake(4);
  }
}
//--------------------------------------------------------------------------------------------------

function drawTrampolines(){// drawing bounce pads
  if (trampolinesEnabled && trampolines.length > 0){
    push();
    for (let t of trampolines){
      fill(241, 0, 255);
      if (trampolineClicked){
        fill(255);
      }
      strokeWeight(3);
      stroke(165, 0, 255);
      rectMode(CENTER);

      if (trampolineClicked){
        // If trampoline would be drawn near center, skip it
        if (dist(mouseX, mouseY, width/2, height/2) < 100){
          continue;  // skip drawing this trampoline, but keep looping others
        } else {
          // Draws trampolines where player has moved it
          rect(mouseX, mouseY, widd, high);
        }
      } else {
        // normal drawing of existing trampolines
        rect(t.x, t.y, widd, high);
      }
    }
    pop();
  }
}

//-----------------------------------------------------------------------------------------------------------------------------
function addScreenshake(intensity) {
  if (screenshakeEnabled) {
    shakeIntensity = max(shakeIntensity, intensity);
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
// Toggle functions:

function toggleScreenshake() {
  screenshakeEnabled = !screenshakeEnabled;
  let btn = document.getElementById('screenshakeBtn');
  if (screenshakeEnabled) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleDrunkenness() {
  drunkennessEnabled = !drunkennessEnabled;
  let btn = document.getElementById('drunkennessBtn');
  if (drunkennessEnabled) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleTimer() {
  timerEnabled = !timerEnabled;
  let btn = document.getElementById('timerBtn');
  if (timerEnabled) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleNoSkill(){
  noSkillModeEnabled=!noSkillModeEnabled;
  // console.log(noSkillModeEnabled)
  let btn = document.getElementById('noSkillBtn');
  if (noSkillModeEnabled) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleBomb() {
  bombEnabled = !bombEnabled;
  if (bombEnabled) {
    selectBombCoin();
  } else if (bombCoin) {
    bombCoin.col = bombCoin.originalColour;
    bombCoin.isBomb = false;
    bombCoin = null;
  }
  let btn = document.getElementById('bombBtn');
  if (bombEnabled) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleLaserAim() {
  laserAim = !laserAim;
  let btn = document.getElementById('laserAimBtn');
  if (laserAim) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleInvertedControls() {
  invertedControls = !invertedControls;
  let btn = document.getElementById('invertedControlsBtn');
  if (invertedControls) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleGlitch() {
  glitchEnabled = !glitchEnabled;
  let btn = document.getElementById('glitchBtn');
  if (glitchEnabled) {
    btn.classList.add('active');
    lastGlitchTime = millis(); // Reset timer when enabled
  } else {
    btn.classList.remove('active');
    glitchEffects = []; // Clear any active glitch effects
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleStickyZones() {
  stickyZonesEnabled = !stickyZonesEnabled;
  if (stickyZonesEnabled) {
    generateStickyZones();
  } else {
    stickyZones = [];
  }
  let btn = document.getElementById('stickyBtn');
  if (stickyZonesEnabled) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleWormholes(){
  wormholesEnabled=!wormholesEnabled
  let btn = document.getElementById('wormholeBtn');
  if (wormholesEnabled) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleWobblyBoard(){
  wobblyBoard=!wobblyBoard
  let btn = document.getElementById('wobblyBoardBtn');
  if (wobblyBoard) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
  
}
//-----------------------------------------------------------------------------------------------------------------------------
function toggleTrampolines() {
  trampolinesEnabled = !trampolinesEnabled;
  if (trampolinesEnabled) {
    showMessage("Click and drag bounce pads to move them\nDon't place them in the centre")
    generateTrampolines();
  } else {
    trampolines = [];
  }
  let btn = document.getElementById('trampolineBtn');
  if (trampolinesEnabled) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}

function toggleAimAssist() {
  aimAssist = !aimAssist;
  let btn = document.getElementById('aimAssistBtn');
  if (aimAssist) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
}