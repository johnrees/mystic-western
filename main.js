if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = ( function() {
    return  window.requestAnimationFrame     ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame  ||
      window.oRequestAnimationFrame    ||
      window.msRequestAnimationFrame   ||
      function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
  })();
}

var spacing = 20;
var padding = 80;
var showLines = false;
var current = 1;

var newPoints = [[
  [5,2],
  [3,3],
  [6,14],
  [8,15],
  [7,19],
  [6,21],
  [4,22],
  [3,26],
  [4,28],
  [12,30],
  [20,28],
  [21,26],
  [20,22],
  [18,21],
  [17,19],
  [16,15],
  [17,14],
  [21,3],
  [19,2],
  [7,3],
  [9,13],
  [11,12],
  [15,13],
  [13,12],
  [11,23],
  [12,25],
  [13,23],
  [10,30],
  [11,33],
  [13,33],
  [14,30],
  [12,33],
  [17,3],
  [12,20],
  [9,20],
  [15,20]
], [
  [1,0],
  [2,9],
  [9,5],
  [0,17],
  [7,13],
  [11,21],
  [12,24],
  [13,24],
  [13,4]
]];


var newJoins = [
{"0":[19,33],"1":[0,2],"3":[2,4],"4":[34],"5":[4,33],"6":[5],"7":[6],"8":[7,27,25],"9":[30],"10":[11],"11":[12],"12":[13],"13":[14],"14":[15],"15":[16],"16":[17],"18":[17],"20":[19],"21":[20],"22":[23],"23":[21],"24":[25,5,33,7],"25":[26,10],"26":[24,13,11],"27":[28,9,25],"28":[29],"29":[30],"30":[10,25],"31":[9],"32":[18,22],"33":[15,3,35,13,26,18],"34":[33],"35":[14]},
{
  "0": [1,2],
  "1": [2,3],
  "2": [8],
  "3": [4,5],
  "4": [1,5],
  "5": [6],
  "6": [2,7]
}];



var ColorUtils = (function() {

  function randomRange(min, max) {
    return ((Math.random() * (max - min)) + min);
  }
  function hexToR(h) {
    return parseInt((cutHex(h)).substring(0,2),16);
  }
  function hexToG(h) {
    return parseInt((cutHex(h)).substring(2,4),16);
  }
  function hexToB(h) {
    return parseInt((cutHex(h)).substring(4,6),16);
  }
  function cutHex(h) {
    return (h.charAt(0)=="#") ? h.substring(1,7):h;
  }

  return {
    randomRange: randomRange,
    hexToR: hexToR,
    hexToG: hexToG,
    hexToB: hexToB,
    cutHex: cutHex
  };

}());

var ConnectedPoints = (function(){

  var backColor = '#111';
  var lineColor = 'pink';
  var canvas;
  var c;
  var particleArray = [];

  function init(){
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;
  }

  function onWindowResize() {
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  var clicked = false;

  function onWindowClick(event) {
    var rect = canvas.getBoundingClientRect();
    // particleArray.push(Particle.get( event.clientX - rect.left, event.clientY - rect.top));

    if (!clicked) {

      for(var i=0; i<newPoints[current].length;i++){
        particleArray.push(Particle.get( newPoints[current][i][0] * spacing + padding * 3, newPoints[current][i][1] * spacing + padding, i ));
      }

      if (true) {
        for(var i=0; i<newPoints[current].length;i++){
          particleArray.push(Particle.get( Math.abs(newPoints[current][i][0]-26) * spacing + padding* 3, newPoints[current][i][1] * spacing + padding, i ));
        }
      }

      for(var i=0; i<particleArray.length;i++){
        var particle = particleArray[i];
        for (var p = 0; p < 2; p++) {
          var joins = newJoins[current][ (i - (newPoints[current].length*p)).toString() ];
          if (joins) {
            for(var j=0; j<joins.length; j++){
              particle.joins.push( particleArray[joins[j] + (newPoints[current].length)*p]);
            }
            console.log(particle.joins)
          }
        }
      }

      clicked = true;

    } else {
      clicked = false;
      for(var i=0; i<particleArray.length;i++){
        TweenLite.to(particleArray[i], Math.min(Math.random() + 2, 2), {x:particleArray[i].foxX, y:particleArray[i].foxY, ease:Elastic.easeOut});
        setTimeout(showLinesMethod, 900);
      }
    }
  }

  function hideLinesMethod() {
    showLines = false;
    current++;
  }

  function showLinesMethod() {
      showLines = true;
      setTimeout(hideLinesMethod, 1500);
  }

  function draw(){

    context.clearRect(0,0,window.innerWidth,window.innerHeight);
    // context.fillStyle = backColor;
    // context.fillRect(0,0,window.innerWidth,window.innerHeight);

    for(var i=0; i<particleArray.length;i++){

      var particle = particleArray[i];

      context.beginPath();
      context.fillStyle = "#FFF";//"rgba("+ColorUtils.hexToR(particle.color)+", "+ColorUtils.hexToG(particle.color)+", "+ColorUtils.hexToB(particle.color)+", "+particle.opacity+")";

      var radius = particle.size/2;
      context.arc(particle.x, particle.y, radius, 0, 2 * Math.PI, false);
      context.fill();
      context.closePath();

      particle.x = particle.x + particle.xSpeed;
      particle.y = particle.y + particle.ySpeed;

      // for(var j=0; j<particleArray.length;j++){
      //   if(j!=i){
      //     var particleFriend = particleArray[j];
      //     context.lineWidth = 1;
      //     context.beginPath();
      //     context.moveTo(particle.x,particle.y);
      //     context.lineTo(particleFriend.x ,particleFriend.y);
      //     context.strokeStyle = lineColor;
      //     context.stroke();
      //   }
      // }
      if (showLines) {
        for(var k=0; k<particle.joins.length;k++){
          var particleFriend = particle.joins[k];
          context.lineWidth = 1 + Math.random() * 3;
          context.beginPath();
          context.moveTo(particle.x,particle.y);
          context.lineTo(particleFriend.x ,particleFriend.y);
          context.strokeStyle = lineColor;
          context.stroke();

          context.globalAlpha = 0.3;

          context.lineWidth = 10 + Math.random() * 10;
          context.lineTo(particle.x,particle.y);
          context.strokeStyle = 'red';
          context.stroke();
          context.globalAlpha =1;
        }
      }

      if(particle.x > window.innerWidth+particle.size ||
        particle.y > window.innerHeight+particle.size ||
        particle.x < 0 ||
        particle.y < 0
      ){
        // particleArray.splice(i,1);
        particle.x = ColorUtils.randomRange(0,window.innerWidth);
        particle.y = ColorUtils.randomRange(0,window.innerHeight);
      }
    }
  }

  return {
    init: init,
    draw: draw,
    onWindowResize: onWindowResize,
    onWindowClick: onWindowClick
  }

}());

var Particle = (function(){

  var velocity = 0.04;
  var opacity = Math.random();
  var size = 2 + Math.random() * 6;
  var color = "yelow";
  var id;
  var joins;

  var foxX;
  var foxY;

  function get(x, y, id){
    var particle = {};
    particle.joins = [];
    particle.id = id;
    particle.x = ColorUtils.randomRange(0,window.innerWidth);
    particle.y = ColorUtils.randomRange(0,window.innerHeight);
    particle.foxX = x;
    particle.foxY = y;
    particle.xSpeed = ColorUtils.randomRange( (-1) * velocity , velocity);
    particle.ySpeed = ColorUtils.randomRange( (-1) * velocity , velocity);
    particle.color = color;
    particle.opacity = opacity;
    particle.size  = size;
    return particle;
  }

  return {
    get: get
  }

}());

window.onload = function() {
  ConnectedPoints.init();
  animate();
};

window.addEventListener('resize', ConnectedPoints.onWindowResize, false );
window.addEventListener('click', ConnectedPoints.onWindowClick, false );

function animate(){
  requestAnimationFrame(animate);
  ConnectedPoints.draw();
}
