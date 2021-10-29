// Copied from view-source:https://raw.githubusercontent.com/petercollingridge/code-for-blog/master/svg-interaction/draggable/draggable_restricted.svg

/*
    onload="makeDraggable(evt)">
    
    <style>
      .static {
        cursor: not-allowed;
      }
      .draggable {
        cursor: move;
      }
    </style>
*/

function makeDraggable(evt) {
    var svg = evt.target;

    svg.addEventListener('mousedown', startDrag);
    svg.addEventListener('mousemove', drag);
    svg.addEventListener('mouseup', endDrag);
    svg.addEventListener('mouseleave', endDrag);
    svg.addEventListener('touchstart', startDrag);
    svg.addEventListener('touchmove', drag);
    svg.addEventListener('touchend', endDrag);
    svg.addEventListener('touchleave', endDrag);
    svg.addEventListener('touchcancel', endDrag);

    var selectedElement, offset, transform,
        bbox, minX, maxX, minY, maxY, confined;

    var boundaryX1 = 10.5;
    var boundaryX2 = 30;
    var boundaryY1 = 2.2;
    var boundaryY2 = 19.2;

    function getMousePosition(evt) {
      var CTM = svg.getScreenCTM();
      if (evt.touches) { evt = evt.touches[0]; }
      return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
      };
    }

    function startDrag(evt) {
      if (evt.target.classList.contains('draggable')) {
        selectedElement = evt.target;
        offset = getMousePosition(evt);

        // Make sure the first transform on the element is a translate transform
        var transforms = selectedElement.transform.baseVal;

        if (transforms.length === 0 || transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
          // Create an transform that translates by (0, 0)
          var translate = svg.createSVGTransform();
          translate.setTranslate(0, 0);
          selectedElement.transform.baseVal.insertItemBefore(translate, 0);
        }

        // Get initial translation
        transform = transforms.getItem(0);
        offset.x -= transform.matrix.e;
        offset.y -= transform.matrix.f;

        confined = evt.target.classList.contains('confine');
        if (confined) {
            bbox = selectedElement.getBBox();
            minX = boundaryX1 - bbox.x;
            maxX = boundaryX2 - bbox.x - bbox.width;
            minY = boundaryY1 - bbox.y;
            maxY = boundaryY2 - bbox.y - bbox.height;
        }
      }
    }

    function drag(evt) {
      if (selectedElement) {
        evt.preventDefault();

        var coord = getMousePosition(evt);
        var dx = coord.x - offset.x;
        var dy = coord.y - offset.y;

        if (confined) {
            if (dx < minX) { dx = minX; }
            else if (dx > maxX) { dx = maxX; }
            if (dy < minY) { dy = minY; }
            else if (dy > maxY) { dy = maxY; }
        }

        transform.setTranslate(dx, dy);
      }
    }

    function endDrag(evt) {
      selectedElement = false;
    }
  }
