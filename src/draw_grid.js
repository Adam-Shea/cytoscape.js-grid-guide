module.exports = function(opts, cy, debounce) {

  var options = opts;

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
    var canvasWidth = cy.width();
    var canvasHeight = cy.height();
    var increment = options.gridSpacing * zoom;
    var incrementSmall = options.gridSpacingSmall * zoom;
    var pan = cy.pan();
    var initialValueX = pan.x % increment;
    var initialValueY = pan.y % increment;

    ctx.strokeStyle = options.gridColor;
    ctx.lineWidth = options.lineWidth;


    clearDrawing();
    for (var y = initialValueY; y < canvasHeight; y += increment) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Draw large vertical grid lines
    for (var x = initialValueX; x < canvasWidth; x += increment) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    if (options.gridSpacingSmall > 0 && options.gridColorSmall) {
      ctx.strokeStyle = options.gridColorSmall;
      ctx.lineWidth = options.lineWidthSmall;

      // Draw small horizontal grid lines
      for (var y = initialValueY; y < canvasHeight; y += incrementSmall) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }

      // Draw small vertical grid lines
      for (var x = initialValueX; x < canvasWidth; x += incrementSmall) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasHeight);
        ctx.stroke();
      }
    }
  };

  var clearDrawing = function() {
    var width = cy.width();
    var height = cy.height();

    ctx.clearRect(0, 0, width, height);
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
