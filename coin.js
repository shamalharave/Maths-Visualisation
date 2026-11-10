class Coin {
  constructor(x, y, r, col, mass) {
    this.pos = createVector(x, y);
    this.vel = createVector(0,0);
    this.r = r;
    this.col = col;
    this.mass = mass;
    this.friction=0.98
    this.isBomb = false;
    this.originalColour = null;
    this.maxSpeed=40
  }
//--------------------------------------------------------------------------------------------------

  show() {
    // Displays coins
    push();

    // Apply drunkenness effect (size variation) to all coins except striker
    let displayRadius = this.r;
    let coinAlpha = 255;

    if (drunkennessEnabled && this !== striker) {
      let sizeVariation = sin(drunkTime + this.pos.x * 0.01 + this.pos.y * 0.01) * 5;
      displayRadius = this.r + sizeVariation;

      // Apply fading effect
      let coinIndex = coins.indexOf(this);
      if (coinIndex !== -1 && coinFadeOffsets[coinIndex]) {
        let fadeAmount = sin(drunkTime * coinFadeOffsets[coinIndex].fadeSpeed + coinFadeOffsets[coinIndex].fadeOffset);
        coinAlpha = map(fadeAmount, -1, 1, 120, 255);
      }
    }

    // Special handling for striker with custom icons
    if (this === striker && currentStrikerIcon > 0 && strikerIcons[currentStrikerIcon]) {
      push();
      imageMode(CENTER);
      //tint(255, coinAlpha);

      // Draw the custom icon, maintaining the striker's size
      let iconSize = displayRadius * 2+8;
      if (currentStrikerIcon==6){
        image(strikerIcons[currentStrikerIcon], this.pos.x, this.pos.y, iconSize+10, iconSize-10);
      }else{
        image(strikerIcons[currentStrikerIcon], this.pos.x, this.pos.y, iconSize, iconSize);
      }
      //image(strikerIcons[currentStrikerIcon], this.pos.x, this.pos.y, iconSize, iconSize);

      
      noFill();
      noStroke()
      ellipse(this.pos.x, this.pos.y, iconSize);

      pop();
    } else {
      // Default coin rendering
      if (Array.isArray(this.col)) {
        fill(this.col[0], this.col[1], this.col[2], coinAlpha);
      } else {
        fill(red(this.col), green(this.col), blue(this.col), coinAlpha);
      }

      stroke(0, coinAlpha);
      if (greyScale) {
        stroke(255);
        if (this.col[0] === 255 && this.col[1] === 0 && this.col[2] === 0) {
          fill(80, 80, 80);  // Dark gray for red coins
        } else if (this.col[0] === 0 && this.col[1] === 0 && this.col[2] === 255) {
          fill(211, 211, 211);  // Light gray for blue coins
        }else if (this.col[0] === 255 && this.col[1] === 215 && this.col[2] === 0) {
          fill(10,10,10);  // Near black for queen
        }
      }
      

      strokeWeight(2);

      // Add pulsing effect for bomb coins
      if (this.isBomb) {
        let pulseSize = sin(millis() * 0.01) * 2;
        displayRadius += pulseSize;
        strokeWeight(3);
        stroke(255, 255, 0, coinAlpha);
        if (greyScale){
          stroke(255, coinAlpha)
        }
      }

      ellipse(this.pos.x, this.pos.y, displayRadius * 2);
    }

    pop();
  }
//--------------------------------------------------------------------------------------------------


  update() {
    // Updates position, velocity, acceleration of coins
    if (trampolinesEnabled){
      this.maxSpeed=22//this is the highest with bounceSpeed set to 2
    }
    //this.vel.setMag(min(this.vel.mag(),this.maxSpeed))
    this.vel.limit(this.maxSpeed)
    this.pos.add(this.vel);
    if (wobblyBoard&&!allStopped()){
      this.pos.add(tiltVector);
      tiltVector.mult(0.9995);
    }
    // Check for sticky zones
    if (stickyZonesEnabled) {
      for (let zone of stickyZones) {
        let distToZone = dist(this.pos.x, this.pos.y, zone.x, zone.y);
        if (distToZone < zone.size/2 +this.r*2) {
          // Apply sticky deceleration
          this.vel.mult(0.9); // Strong deceleration
        }
      }
    }

    // No skill mode reduces friction so it's easier to pocket by luck as coins move for longer
    if (noSkillModeEnabled) {
      this.friction = 0.995;// Less friction
    } else {
      this.friction = 0.98;// Normal friction
    }
    this.vel.mult(this.friction);
    if (this.vel.mag() < 0.05) {
      this.vel.set(0, 0);
    }

    this.checkEdges();
      // Check for collisions
  for (let i = 0; i < coins.length; i++) {
      let a = this;
      let b = coins[i];
      if(a!==b){
        a.collide(b);
      }
      
    }
  
  }
//--------------------------------------------------------------------------------------------------

  checkEdges(){
    // Handles coin collisions with edges of board, and if wraparound board is enabled, it handles coin positions for that
    if (!wormholesEnabled){
      if (trampolinesEnabled){//edge collision made more bouncy when trampolines on board
        if (this.pos.x>width-this.r || this.pos.x<this.r){
      this.vel.x*=-bounceStrength
          
      this.pos.x = constrain(this.pos.x, this.r, width - this.r);
       if (screenshakeEnabled){
            addScreenshake(2)            
          }   
    }
    if (this.pos.y>height-this.r || this.pos.y<this.r){
      this.vel.y*=-bounceStrength
      this.pos.y = constrain(this.pos.y, this.r, height - this.r);
      if (screenshakeEnabled){
                  addScreenshake(2)            
                }
    }
      }else{//normal
        if (this.pos.x>width-this.r || this.pos.x<this.r){
      this.vel.x*=-1
      this.pos.x = constrain(this.pos.x, this.r, width - this.r);
      if (screenshakeEnabled){
                  addScreenshake(2)            
                }
    }
    if (this.pos.y>height-this.r || this.pos.y<this.r){
      this.vel.y*=-1
      this.pos.y = constrain(this.pos.y, this.r, height - this.r);
      if (screenshakeEnabled){
                  addScreenshake(2)            
                }
    }
      }
       
    }else {
      if (this.pos.x>width-this.r){  
      this.pos.x=this.r
      this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    }else if (this.pos.x<this.r){
      this.pos.x=width-this.r
      this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    }
    if (this.pos.y>height-this.r){
      this.pos.y=this.r
      this.pos.y = constrain(this.pos.y, this.r, height - this.r);
    }else if (this.pos.y<this.r){
      this.pos.y=height-this.r
      this.pos.y = constrain(this.pos.y, this.r, height - this.r);
    }
    }

    // Handles trampoline collision, using geometry
  for (let t of trampolines) {
    let halfW = widd / 2;
    let halfH = high / 2;

    // Circle vs rect overlap check
    if (
      this.pos.x + this.r > t.x - halfW && // right side past left side
      this.pos.x - this.r < t.x + halfW && // left side past right side
      this.pos.y + this.r > t.y - halfH && // bottom past top
      this.pos.y - this.r < t.y + halfH    // top past bottom
    ) {
      // Figure out which axis to bounce on; since the trampolines are only vertical or horizontal, only velocity in one direction changes
      let overlapX = Math.min(
        (t.x + halfW) - (this.pos.x - this.r),
        (this.pos.x + this.r) - (t.x - halfW)
      );
      let overlapY = Math.min(
        (t.y + halfH) - (this.pos.y - this.r),
        (this.pos.y + this.r) - (t.y - halfH)
      );

      if (overlapX < overlapY) {
        this.vel.x *= -1;
      } else {
        this.vel.y *= -1;
      }

      this.vel.mult(1.2); // trampoline boost
      //console.log('yes');
    }
  }


}
  
//--------------------------------------------------------------------------------------------------


  collide(other) {
    // Checks collision with other coins, using geometry
    let dis=dist(other.pos.x, other.pos.y, this.pos.x, this.pos.y)
    if (dis<20){
      addScreenshake(5)
    }
    let impactVector = p5.Vector.sub(other.pos, this.pos);
    let d = impactVector.mag();
    if (d < this.r + other.r) {
         //   Add screenshake on collision
       //let x=this.r+other.r-d
       //console.log(x)
      // if (screenshakeEnabled) {
      //   addScreenshake(0.5);
      // }
      // Push the particles out so that they are not overlapping
      let overlap = d - (this.r + other.r);
      let dir = impactVector.copy();
      dir.setMag(overlap * 0.5);
      this.pos.add(dir);
      other.pos.sub(dir);
      

      d = this.r + other.r;
      impactVector.setMag(d);
      
      let mSum = this.mass + other.mass;
      let vDiff = p5.Vector.sub(other.vel, this.vel);
      // Particle A (this)
      let num = vDiff.dot(impactVector);
      let den = mSum * d * d;
      let deltaVA = impactVector.copy();
      deltaVA.mult(2 * other.mass * num / den);
      this.vel.add(deltaVA);
      // Particle B (other)
      let deltaVB = impactVector.copy();
      deltaVB.mult(-2 * this.mass * num / den);
      other.vel.add(deltaVB);
      

    }
      

    }
//--------------------------------------------------------------------------------------------------
  

  pocketed() {
    // Checks if a coin is in the pocket
    for (let pocket of pockets) {
      if (dist(this.pos.x, this.pos.y, pocket.x, pocket.y) < pocketRadius/2) {
        return true;
      }
    }
    return false;
  }


}
//----------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------


class Striker extends Coin{
  constructor(x,y,size,col,mass){
    super(x,y,size,col,mass)
  }
//--------------------------------------------------------------------------------------------------
  setStrikerIcon(iconIndex) {
  // Selects the icon which has been clicked on
  currentStrikerIcon = iconIndex;
    // Update icon states
  let iconItems = document.querySelectorAll('.icon-item');
  iconItems.forEach((item, index) => {
    if (index === iconIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}
//--------------------------------------------------------------------------------------------------
  placeStriker(duee) {
  // Places striker based on whose turn it is. This takes into account whether a player has pocketed, dued and if they had to cover the queen.
  // It is a convenient place to add the redrawing of smaller features like sticky zones, and the selection of new tilt directions, which don't really need their own separate function where some of the logic here would be repeated. This is because the features are designed to change each turn so it's easy to do here as the striker is only placed when another shot is to be made, obviously.
  if (queenCovered == false && queenNeedsCovering && coverTurn && sOnCTurn) {
    coins.push(new Coin(width / 2, height / 2, coinSize/2, colours.g, coinMass));
    console.log("Queen returned to board. Not covered.");
    queenNeedsCovering = false;
    coverTurn = false;
    sOnCTurn = false;
  }
  if (stickyZonesEnabled) {
    generateStickyZones();
  }
  if (trampolinesEnabled){
    //console.log('21')
    currentTrampolineLength=random(trampolineLengths)

    //console.log('reached here') SOLVED- forgot to capitalise l in trampolineLengths
    widd=random([0,1]);
      
      if (widd==1){
        widd=trampolineWidth
        high=currentTrampolineLength
      }else{
        widd=currentTrampolineLength
        high=trampolineWidth        
      }
    generateTrampolines()
  }
  if (wobblyBoard){
    tiltDirection=random(tiltDirections);
    if (tiltDirection=='up'){
      tiltVector=createVector(0,-1);
    }else if (tiltDirection=='down'){
      tiltVector=createVector(0,1);
    }else if (tiltDirection=='left'){
      tiltVector=createVector(-1,0);
    }else if (tiltDirection=='right'){
      tiltVector=createVector(1,0);
    }
  }
  
  if (currentPlayer == 1) {
    striker.pos.x = width/2;
    striker.pos.y = 550;
  } else if (currentPlayer == 2) {
    striker.pos.x = width/2;
    striker.pos.y = 50;
  }
  
  if (duee) {
    if (currentPlayer == 1 && blueLeft < 9) {
      coins.push(new Coin(width/2, height/2, 12.5, colours.b, coinMass));
      blueLeft++;
      due = false;
    } else if (currentPlayer == 2 && redLeft < 9) {
      coins.push(new Coin(width/2, height/2, 12.5, colours.r, coinMass));
      redLeft++;
      due = false;
    }
  }
  due = false;
}
//--------------------------------------------------------------------------------------------------

  strikerIsHovered() {
  return dist(mouseX, mouseY, striker.pos.x, striker.pos.y) < striker.r;
}
//--------------------------------------------------------------------------------------------------
  
    applyForce(force) {
    // Adds force to striker depending on the strength of the player's shot
    this.vel.add(force)
  }
//--------------------------------------------------------------------------------------------------
  
    reset() {
    // Striker starting position
    this.pos = createVector(400, 550); 
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
  }
  
}
