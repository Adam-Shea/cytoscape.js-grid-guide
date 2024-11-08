module.exports = function(gridSpacing) {


  var changeOptions = function(opts) {
    gridSpacing = Number(opts.gridSpacingSmall);
  };

  var getScratch = function(node) {
    if (!node.scratch("_gridGuide"))
      node.scratch("_gridGuide", {});

    return node.scratch("_gridGuide");
  };

  function resizeNode(node) {
    var width = node.outerWidth();
    var height = node.outerHeight();
    var widthDif = node.outerWidth() - node.width();
    var heightDif = node.outerHeight() - node.height();

    var newWidth = Math.ceil((width - gridSpacing) / (gridSpacing * 2)) * (gridSpacing * 2);
    var newHeight = Math.ceil((height - gridSpacing) / (gridSpacing * 2)) * (gridSpacing * 2);
    newWidth = newWidth > 0 ? newWidth + gridSpacing : gridSpacing;
    newHeight = newHeight > 0 ? newHeight + gridSpacing : gridSpacing;

    if (width != newWidth || height != newHeight) {
      console.log("--------------------")
      console.log("id", node.id())
      console.log("width", width)
      console.log("widthDif", widthDif)
      console.log("newWidth", newWidth)
      console.log("children", node.children().length)
      if (node.children().length > 0) {
        console.log("-> update width")
        node.style({
          "min-width": newWidth - widthDif,
          "min-height": newHeight - heightDif
        });
      } else {
        node.style({
          "width": newWidth - widthDif,
          "height": newHeight - heightDif
        });
      }
      console.log("outer", node.outerWidth())
      getScratch(node).resize = {
        oldWidth: width - widthDif,
        oldHeight: height - heightDif
      };
    }
  }

  function recoverNodeDimensions(node) {
    var oldSizes = getScratch(node).resize;
    if (oldSizes)
      if (node.children) {
        node.style({
          "min-width": newWidth,
          "min-height": newHeight
        });
      } else {
        node.style({
          "width": newWidth,
          "height": newHeight
        });
      }


  }


  return {
    resizeNode: resizeNode,
    recoverNodeDimensions: recoverNodeDimensions,
    changeOptions: changeOptions
  };

};
