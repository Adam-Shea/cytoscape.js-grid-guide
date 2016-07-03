module.exports = function (gridSpacing) {


    var getScratch = function (node) {
        if (!node.scratch("_snapToGrid"))
            node.scratch("_snapToGrid", {});

        return node.scratch("_snapToGrid");
    };

    function resizeNode(node) {
        var width = node.width();
        var height = node.height();

        var newWidth = Math.round(width / gridSpacing) * gridSpacing;
        var newHeight = Math.round(height / gridSpacing) * gridSpacing;

        newWidth = newWidth > 0 ? newWidth : gridSpacing;
        newHeight = newHeight > 0 ? newHeight : gridSpacing;

        if (width != newWidth || height != newHeight) {
            node.style({
                "width": newWidth,
                "height": newHeight
            });
            getScratch(node).resize = {
                oldWidth: width,
                oldHeight: height
            };
        }
    }

    function recoverNodeDimensions(node) {
        var oldSizes = getScratch(node);
        if (oldSizes.resize)
            node.style({
                "width": oldWidth,
                "height": oldHeight
            });

    }



    return {
        resizeNode: resizeNode,
        recoverNodeDimensions: recoverNodeDimensions
    };

};