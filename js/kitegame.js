var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    raiseSpeed = 0;
    currentLevel = 1,
    maxLevel = 3,
    backgroundWidth = 714,
    backgroundHeight = 502,
    spritesheet = new Image(),
    backgroundImg  = new Image(),
    ssp = new SpriteSheetPainter(),
 
    
    //Runner.............................................   
    
    runnerCellsRight = [
      { left: 398, top: 382, width: 70, height: 123 },
      { left: 305, top: 382, width: 71, height: 123 },
      { left: 213, top: 382, width: 69, height: 123 },
      { left: 138, top: 382, width: 52, height: 123 },
      { left: 63,  top: 382, width: 53, height: 123 }
    ],
    
   runnerCellsLeft = [
      { left: 416, top: 540, width: 56, height: 111 },
      { left: 339, top: 540, width: 53, height: 111 },
      { left: 247, top: 540, width: 72, height: 111 },
      { left: 155, top: 540, width: 72, height: 111 },
      { left: 63,  top: 540, width: 70, height: 111 }
    ],
    
    runnerCellsStop = [
    	{ left: 63,  top: 540, width: 70, height: 111 },
    	{ left: 63,  top: 540, width: 70, height: 111 },
    	{ left: 63,  top: 540, width: 70, height: 111 },
    	{ left: 63,  top: 540, width: 70, height: 111 },
    	{ left: 63,  top: 540, width: 70, height: 111 }
	],
	
	
	//Coins.............................................
	
	coinData = [
      { left: 170,  top: 359 - 40 }, 
      { left: 371,  top: 286 - 40 }, 
      { left: 509,  top: 388 - 40 }, 
      { left: 664,  top: 253 - 40 },  
      { left: 884, top: 341 - 40 } 
   ],
   
	//Birds.............................................
	
   	birdData = [
      { left: 76,  top: 359 - 40 }, 
      { left: 256,  top: 286 - 40 }, 
      { left: 499,  top: 388 - 40 }, 
      { left: 748,  top: 253 - 40 },  
      { left: 889, top: 341 - 40 } 
   ],

    
   // Spritesheet cells................................................
    
    coinCells = [
      { left: 303,  top: 313, width: 32, height: 32}, 
      { left: 469,  top: 313, width: 32, height: 32}, 
      { left: 600,  top: 313, width: 32, height: 32} 
    ],
    
    birdCellsRight = [
      { left: 236,  top: 75, width: 81, height: 35 }, 
      { left: 148,  top: 75, width: 70, height: 35 }, 
      { left: 60,   top: 75, width: 67, height: 35 }
    ],
    
    birdCellsLeft = [
      { left: 239,  top: 200, width: 79, height: 37 }, 
      { left: 149,  top: 200, width: 72, height: 37 }, 
      { left: 60,   top: 200, width: 67, height: 37 }
    ],
    
     // Sprites...........................................................  

    coins   = [],  
    birds   = [],
   
    // Kite.............................................................    
    
    ball = new Ball(),
    ball.y = 300;
    spring = 0.03,
    friction = 0.95,
    vx = 0,
    vy = 0;
    
var kiteImg = new Image;
    kiteImg.src = "images/kite.png";
    backgroundImg.src = "images/bg.jpg";
    
    
    // Runner's run behavior.................................................
    
    runInPlace = {
       lastAdvance: 0,
       PAGEFLIP_INTERVAL: 150,

       execute: function (sprite, context, time) {
          if (time - this.lastAdvance > this.PAGEFLIP_INTERVAL) {
             sprite.painter.advance();
             this.lastAdvance = time;
          }
       }
    },

    moveLeftToRight = {
       lastMove: 0,
       execute: function (sprite, context, time) {
         if (this.lastMove !== 0) {
         	if (sprite.velocityX > 0) {
         		ssp.cells = runnerCellsLeft;
         	} else if (sprite.velocityX < 0) {
         		ssp.cells = runnerCellsRight;
         	} else {
         		ssp.cells = runnerCellsStop;
         	}
           sprite.left += sprite.velocityX  * ((time - this.lastMove) / 1000); 
           //console.log("sprite.velocityX " + sprite.velocityX);
            //console.log("moveLeftToRight!");
			if (sprite.left > canvas.width) {
				sprite.left=-41;
			}
			            
			if (sprite.left < -41) {
				sprite.left=canvas.width;
				//console.log(canvas.width);
			}
	   } //end if
     if(currentLevel > 1)
     {
      sprite.visible = false;
     }     
     
     //draw the kite......................................
     
     var dx = sprite.left - ball.x,
         dy = raiseSpeed;
          	//dy = mouse.y - ball.y,
         if(Math.round(ball.y) < -900 && currentLevel == 3)
         {
             dy = 0;
             if(Math.round(ball.x) < 360 && Math.round(ball.x) > 250)
             {
               dx = 0;
             }
         }  
       
         ax = dx * spring,
         ay = dy * spring;

        vx += ax;
        vy += ay;
        vx *= friction;
        vy *= friction;
        ball.x += vx;
        ball.y += vy;
        $('#msg').text("Kite is ball.x!" + Math.round(ball.x) +" ball.y"+Math.round(ball.y) + 'currentLevel:' + currentLevel);
        //ball.draw(context);
        context.drawImage(kiteImg,ball.x, ball.y + ((currentLevel-1) * backgroundHeight));
        this.lastMove = time;
         //console.log(this.lastMove);
       }
    },


    // Sprite....................................................
    //var ssp = new SpriteSheetPainter(runnerCellsRight),
    ssp.cells=runnerCellsLeft;
	 sprite = new Sprite('runner',
    		ssp,
            [ runInPlace, moveLeftToRight ]);

    console.log(ssp.cells);
    /*sprite = new Sprite('runner',
                        new SpriteSheetPainter(runnerCellsRight),
                        [ runInPlace, moveLeftToRight ]);*/
                        
    

    // kite collide behavior.................................

   this.collideBehavior = {
      execute: function (sprite, time, fps, context) {
         var otherSprite;

         for (var i=0; i < bird.sprites.length; ++i) { 
            otherSprite = bird.sprites[i];

            if (this.isCandidateForCollision(sprite, otherSprite)) {
               if (this.didCollide(sprite, otherSprite, context)) { 
                  this.processCollision(sprite, otherSprite);
               }
            }
         }
      },

      isCandidateForCollision: function (sprite, otherSprite) {
         return sprite !== otherSprite &&
                sprite.visible && otherSprite.visible &&
                !sprite.exploding && !otherSprite.exploding &&
                otherSprite.left - otherSprite.offset <
                   sprite.left - sprite.offset + sprite.width;
      }, 

      didBirdCollideWithBall: function (left, top, right, bottom,
                                         snailBomb, context) {
         // Determine if the center of the snail bomb lies within
         // the kite bounding box  

         context.beginPath();
         context.rect(left, top, right - left, bottom - top);

         return context.isPointInPath(
                       snailBomb.left - snailBomb.offset + snailBomb.width/2,
                       snailBomb.top + snailBomb.height/2);
      },

      didBallCollideWithOtherSprite: function (left, top, right, bottom,
                                                 centerX, centerY,
                                                 otherSprite, context) {
         // Determine if either of the runner's four corners or its
         // center lie within the other sprite's bounding box. 

         context.beginPath();
         context.rect(otherSprite.left - otherSprite.offset, otherSprite.top,
                      otherSprite.width, otherSprite.height);
         
         return context.isPointInPath(left,    top)     ||
                context.isPointInPath(right,   top)     ||

                context.isPointInPath(centerX, centerY) ||

                context.isPointInPath(left,    bottom)  ||
                context.isPointInPath(right,   bottom);
      },
     
      didCollide: function (sprite, otherSprite, context) {
         var MARGIN_TOP = 10,
             MARGIN_LEFT = 10,
             MARGIN_RIGHT = 10,
             MARGIN_BOTTOM = 0,
             left = sprite.left + sprite.offset + MARGIN_LEFT,
             right = sprite.left + sprite.offset + sprite.width - MARGIN_RIGHT,
             top = sprite.top + MARGIN_TOP,
             bottom = sprite.top + sprite.height - MARGIN_BOTTOM,
             centerX = left + sprite.width/2,
             centerY = sprite.top + sprite.height/2;

         if (otherSprite.type === 'snail bomb') {
            return this.didSnailBombCollideWithBall(left, top, right, bottom,
                                                otherSprite, context);
         }
         else {
            return this.didBallCollideWithOtherSprite(left, top, right, bottom,
                                                  centerX, centerY,
                                                  otherSprite, context);
         }
      },

      processCollision: function (sprite, otherSprite) {
         if (otherSprite.value) { // Modify Snail Bait sprites so they have values
            // Keep score...
         }

         if ('coin'  === otherSprite.type    || 
             'snail bomb' === otherSprite.type) {
            otherSprite.visible = false;
         }

         if ('bird' === otherSprite.type   ||
             'ball' === otherSprite.type || 
             'snail bomb' === otherSprite.type) {
            ball.explode(sprite);
         }
         
   };
    
    
    

// Functions.....................................................

// Animation.....................................................

function animate(time) {
   context.clearRect(0,0,canvas.width,canvas.height);
  
   setTranslationOffsets();
   drawBackground();
   sprite.update(context, time);
   sprite.paint(context); 
   
   window.requestNextAnimationFrame(animate);
}

// Initialization................................................


spritesheet.src = 'images/spritesheet.png';


spritesheet.onload = function(e) {
   context.drawImage(spritesheet, 0, 0);
};


speed = 100;
//sprite.velocityX = speed;  // pixels/second
vector = 0;
sprite.left = 100;
sprite.top = 350;

context.strokeStyle = 'lightgray';
context.lineWidth = 0.5;

function drawBackground()
{
     context.save();
     context.drawImage(backgroundImg, 0, (maxLevel-currentLevel) * backgroundHeight,
         backgroundWidth, backgroundHeight,
         0,0, backgroundWidth, backgroundHeight
         );
      context.restore();   
      //console.log("draw background!");
}

function setTranslationOffsets()
{
  if (Math.round(ball.y) < -124 && Math.round(ball.y) < -124)
  {
      currentLevel = 2;
      context.save(); // Save the current state of the context
      context.translate(0, -(currentLevel * backgroundHeight)); 
      console.log("ball y is  "+ ball.y);
      context.restore();   
  }
  if(Math.round(ball.y) < -626)
  {
      currentLevel = 3;
      context.save(); // Save the current state of the context
      context.translate(0, -(currentLevel * backgroundHeight)); 
      console.log("ball y is  "+ ball.y);
      context.restore();
  }
}

  initializeSprites: function() {  
      for (var i=0; i < snailBait.sprites.length; ++i) { 
         Bird.sprites[i].offset = 0;
      }

      positionSprites(birds,       birdsData);
      positionSprites(coins,       coinData);

      armBirds();
   },
//function 

// Launch game.........................................................
window.requestNextAnimationFrame(animate);

console.log("requestNextAnimationFrame!");

$(window).on("deviceorientation", function(e) {
			//var outputValue = window.orientation;
			//alert("Hello!");
			var eventData = e.originalEvent,
				//tiltLR = Math.round(eventData.gamma);
				tiltFB = Math.round(eventData.beta);
				if (tiltFB < -5) {
					vector = -1;
          raiseSpeed = -1;
			    } else if (tiltFB > 5) {
					vector = 1;
          raiseSpeed = -1;
				} else {
					vector = 0;
          raiseSpeed = 0;
				}
				sprite.velocityX = speed * vector;
				console.log(sprite.velocityX);
				//direction = Math.round(eventData.alpha);
			//$('#alpha').text(direction);
			$('#beta').text(tiltFB);
			//$('#gamma').text(tiltLR);
			$('#velocity').text(vector + " " + sprite.velocityX);
			console.log("Girl is animating!");
		//});
});	//end requestNextAnimationFrame	
    
window.onkeydown = function (e) {
   var key = e.keyCode;

   if (key === 68 || key === 37) { // 'd' or left arrow
      vector = -1;
   }
   else if (key === 75 || key === 39) { // 'k' or right arrow
      vector = 1;
   }else {
     vector = 0;
   }
   sprite.velocityX = speed * vector;
	 console.log(sprite.velocityX);
};    
		