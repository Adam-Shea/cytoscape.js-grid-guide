module.exports = function(opts, cy, debounce) {

  var options = opts;
  var oldSmallestX = 0;
  var oldLargestX = 0;
  var oldSmallestY = 0;
  var oldLargestY = 0;

  var changeOptions = function(opts) {
    options = opts;
  };

  var offset = function(elt) {
    var rect = elt.getBoundingClientRect();

    return {
      top: rect.top + document.documentElement.scrollTop,
      left: rect.left + document.documentElement.scrollLeft
    }
  };

  var $canvas = document.createElement('canvas');
  var $container = cy.container();
  var ctx = $canvas.getContext('2d');
  $container.appendChild($canvas);

  var resetCanvas = function() {
    $canvas.height = 0;
    $canvas.width = 0;
    $canvas.style.position = 'absolute';
    $canvas.style.top = 0;
    $canvas.style.left = 0;
    $canvas.style.zIndex = options.gridStackOrder;
  };

  resetCanvas();

  var drawGrid = function() {
    var zoom = cy.zoom();
    var pan = cy.pan()
    var smallestX = 0;
    var largestX = 0;
    var smallestY = 0;
    var largestY = 0;
    cy.nodes().forEach((node, index) => {
      var width = node.outerWidth() / 2
      var x = node.position("x")
      var height = node.outerHeight() / 2
      var y = node.position("y")

      if (index === 0) {
        smallestX = (x - (width))
        largestX = (x + (width))
        smallestY = (y - (height))
        largestY = (y + (height))
      }

      if (smallestX > (x - (width))) {
        smallestX = (x - (width))
      } else if (largestX < (x + (width))) {
        largestX = (x + (width))
      }
      if (smallestY > (y - (height))) {
        smallestY = (y - (height))
      } else if (largestY < (y + (height))) {
        largestY = (y + (height))
      }
    })
    var increment = options.gridSpacing * zoom;
    var incrementSmall = options.gridSpacingSmall * zoom;
    var pageSize = options.pageSize ?? 200;

    largestX += (pageSize - (largestX % pageSize))
    largestY += (pageSize - (largestY % pageSize))
    smallestX -= (pageSize + smallestX % pageSize)
    smallestY -= (pageSize + smallestY % pageSize)

    largestX = largestX * zoom + pan.x
    smallestX = smallestX * zoom + pan.x
    largestY = largestY * zoom + pan.y
    smallestY = smallestY * zoom + pan.y

    ctx.strokeStyle = options.gridColor;
    ctx.lineWidth = options.lineWidth;

    var width = cy.width();
    var height = cy.height();

    ctx.clearRect(0, 0, width, height);

    oldSmallestX = smallestX;
    oldLargestX = largestX;
    oldSmallestY = smallestY;
    oldLargestY = largestY;

    for (var y = smallestY; y < largestY; y += increment) {
      ctx.beginPath();
      ctx.moveTo(smallestX, y);
      ctx.lineTo(largestX, y);
      ctx.stroke();
    }

    // Draw large vertical grid lines
    for (var x = smallestX; x < largestX; x += increment) {
      ctx.beginPath();
      ctx.moveTo(x, smallestY);
      ctx.lineTo(x, largestY);
      ctx.stroke();
    }

    if (options.gridSpacingSmall > 0 && options.gridColorSmall) {
      ctx.strokeStyle = options.gridColorSmall;
      ctx.lineWidth = options.lineWidthSmall;

      // Draw small horizontal grid lines
      for (var y = smallestY; y < largestY; y += incrementSmall) {
        ctx.beginPath();
        ctx.moveTo(smallestX, y);
        ctx.lineTo(largestX, y);
        ctx.stroke();
      }

      // Draw small vertical grid lines
      for (var x = smallestX; x < largestX; x += incrementSmall) {
        ctx.beginPath();
        ctx.moveTo(x, smallestY);
        ctx.lineTo(x, largestY);
        ctx.stroke();
      }
    }
  };

  var clearDrawing = function() {
    // var width = cy.width();
    // var height = cy.height();

    // console.log("cleared")
    // ctx.clearRect(0, 0, width, height);
  };

  var resizeCanvas = debounce(function() {
    $canvas.height = cy.height();
    $canvas.width = cy.width();
    $canvas.style.position = 'absolute';
    $canvas.style.top = 0;
    $canvas.style.left = 0;
    $canvas.style.zIndex = options.gridStackOrder;

    setTimeout(function() {
      $canvas.height = cy.height();
      $canvas.width = cy.width();

      var canvasBb = offset($canvas);
      var containerBb = offset($container);
      $canvas.style.top = -(canvasBb.top - containerBb.top);
      $canvas.style.left = -(canvasBb.left - containerBb.left);
      drawGrid();
    }, 0);

  }, 250);




  return {
    initCanvas: resizeCanvas,
    resizeCanvas: resizeCanvas,
    resetCanvas: resetCanvas,
    clearCanvas: clearDrawing,
    drawGrid: drawGrid,
    changeOptions: changeOptions,
    sizeCanvas: drawGrid
  };
};
