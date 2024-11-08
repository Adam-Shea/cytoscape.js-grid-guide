module.exports = function(cy, snap) {

  var snapToGridDuringDrag = {};

  var attachedNode;
  var draggedNodes;

  var startPos;
  var endPos;

  snapToGridDuringDrag.onTapStartNode = function(e) {
    // If user intends to do box selection, then return. Related issue #28
    if (e.originalEvent.altKey || e.originalEvent.ctrlKey
      || e.originalEvent.metaKey || e.originalEvent.shiftKey) {
      return;
    }

    var cyTarget = e.target || e.cyTarget;
    if (cyTarget.selected())
      draggedNodes = e.cy.$(":selected");
    else
      draggedNodes = cyTarget;

    startPos = e.position || e.cyPosition;

    if (cyTarget.grabbable() && !cyTarget.locked()) {
      attachedNode = cyTarget;
      attachedNode.lock();
      //attachedNode.trigger("grab");
      cy.on("tapdrag", onTapDrag);
      cy.on("tapend", onTapEndNode);
    }
  };

  var onTapEndNode = function(e) {
    //attachedNode.trigger("free");
    cy.off("tapdrag", onTapDrag);
    cy.off("tapend", onTapEndNode);
    attachedNode.unlock();
    e.preventDefault();
  };

  var getDist = function() {
    return {
      x: endPos.x - startPos.x,
      y: endPos.y - startPos.y
    }
  };

  var onTapDrag = function(e) {

    var nodePos = attachedNode.position();
    var nodes = draggedNodes.union(draggedNodes.descendants());
    let largestWidth = 0;
    let largestHeight = 0;
    endPos = e.position || e.cyPosition;
    nodes.forEach(node => {
      if (node.outerWidth() > largestWidth) {
        largestWidth = node.outerWidth()
      }
      if (node.outerHeight() > largestHeight) {
        largestHeight = node.outerHeight()
      }
    })

    endPos.x -= (largestWidth / 2)
    endPos.y -= (largestHeight / 2)

    endPos = snap.snapPos(endPos, largestWidth, largestHeight);
    var dist = getDist();
    if (dist.x != 0 || dist.y != 0) {
      attachedNode.unlock();

      nodes.filter(":childless").positions(function(node, i) {
        if (typeof node === "number") {
          node = i;
        }
        var pos = node.position();
        pos.x -= (node.outerWidth() / 2)
        pos.y -= (node.outerHeight() / 2)
        return snap.snapPos({
          x: pos.x + dist.x,
          y: pos.y + dist.y
        }, node.outerWidth(), node.outerHeight());
      });

      startPos = endPos;
      attachedNode.lock();
      attachedNode.trigger("drag");
    }

  };

  return snapToGridDuringDrag;


};
