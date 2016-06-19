var canvas = new fabric.Canvas('canvas');
var points = [];
var lines = {};
var shiftDown = false;
var startNode = null;
var size = 16;

var position = [0,0];

var placementRect = new fabric.Rect({
    left: 0,
    top: 0,
    fill: '#ccc',
    width: size,
    height: size,
    selectable: false,
    evented: false,
    originX: size/2,
    originY: size/2
  });
canvas.add(placementRect)

var gridWidth = 20;
for(var x=1;x<(canvas.width/gridWidth);x++) {
  canvas.add(new fabric.Line([gridWidth*x, 0, gridWidth*x, canvas.width],{ stroke: "#eee", strokeWidth: 1, selectable:false, evented: false}));
  canvas.add(new fabric.Line([0, gridWidth*x, canvas.height, gridWidth*x],{ stroke: "#eee", strokeWidth: 1, selectable:false, evented: false}));
}

document.addEventListener('keydown', function (e) {
  if (e.ctrlKey) {
    var s = "\n"
    s += "var newPoints = [\n";
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      s += "["+point.left/gridWidth+","+point.top/gridWidth+"],\n";
    }
    s += "]\n";
    s += "var newJoins = ";
    s += JSON.stringify(lines);
    console.log(s)
  }

  checkShift(e.shiftKey);
})

document.addEventListener('keyup', function (e) {
  checkShift(e.shiftKey);
})

function getIndex(element, index, array) {
  return this == array[index];
}

function removeConnectedLines(index) {
}

function rounded(x) {
  return Math.round(x / gridWidth) * gridWidth
}

canvas.on('mouse:move', function(event) {
  position = [ rounded(event.e.x - size/2), rounded(event.e.y - size/2)];
  placementRect.set({'left': position[0], 'top': position[1] });
  placementRect.setCoords();
  canvas.renderAll();
})

canvas.on('mouse:down', function(event) {
  if (event.target) {
    if (shiftDown) {
      var index = points.findIndex(getIndex,event.target);
      points[index].remove();
      points.splice(index,1);
      removeConnectedLines(index);
    }
    if (startNode) {
      addLine(startNode, event.target);
      startNode = null;
    } else {
      startNode = event.target;
    }
  } else {
    startNode = null;
    var pointer = canvas.getPointer(event.e);
    addPoint(position[0], position[1]);
  }
})

function addLine(start,end) {
  var line = new fabric.Line([start.left,start.top,end.left,end.top], {
    stroke: 'purple',
    selectable: false,
    evented: false
  });
  var startIndex = points.findIndex(getIndex,start);
  var endIndex = points.findIndex(getIndex,end);

  try {
    lines[startIndex].push(endIndex);
  } catch(e) {
    lines[startIndex] = [endIndex]
  }

  canvas.add(line);
}

function addPoint(x,y) {
  var rect = new fabric.Rect({
    left: x,
    top: y,
    originX: size/2,
    originY: size/2,
    fill: 'red',
    width: size,
    height: size,
    hasControls: false,
    selectable: false
  });
  points.push(rect)
  canvas.add(rect);
}

function checkShift(key) {
  shiftDown = key;
}
