
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),

    sky = new Image(),
    nav = new Image(),

    lastTime = 0,
    lastFpsUpdate = { time: 0, value: 0 },
    fps=60,

    skyOffset = 0,


    SKY_VELOCITY = 8,
    NAV_VELOCITY = 75;
    //ROTATION = .17;

// Functions.....................................................

function erase() {
   context.clearRect(0,0,canvas.width,canvas.height);
}
function draw() {
	//ANYTHING YOU WANT TO DRAW THAT ISN'T SUPPOSED TO MOVE GOES HERE
	context.drawImage(nav,0,400);
	
	//END
   context.save();

   skyOffset = skyOffset < canvas.width ?
               skyOffset + SKY_VELOCITY/fps : 0;

	
   context.save();
   context.translate(-skyOffset, 100);
   //ROTATION += .01;
   //context.rotate(ROTATION);
   context.drawImage(sky, 0, 100);
   context.drawImage(sky, sky.width-2, 100);
   
   context.restore();

}

function calculateFps(now) {
   var fps = 1000 / (now - lastTime);
   lastTime = now;
   return fps; 
}

function animate(now) {
   if (now === undefined) {
      now = -new Date;
   }

   fps = calculateFps(now);

   //if (!paused) {
      erase();
	   draw();

   window.requestNextAnimationFrame(animate);
   //}
}

// Event handlers................................................

/*animateButton.onclick = function (e) {
   paused = paused ? false : true;
   if (paused) {
      animateButton.value = 'Animate';
   }
   else {
      animateButton.value = 'Pause';
   }
};*/

// Initialization................................................


sky.src = 'images/Making/sky.png';
nav.src = 'images/Making/nav.png';

sky.onload = function (e) {
   draw();
};

nav.onload = function (e) {
    context.drawImage(nav,200,100);

};

requestNextAnimationFrame(animate);