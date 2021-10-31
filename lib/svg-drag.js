// Copied from view-source: https://raw.githubusercontent.com/petercollingridge/code-for-blog/master/svg-interaction/draggable/draggable_restricted.svg
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
/**
 * Checks if the target is draggable.  We set the event listener for the entire SVG
 * object.  evt will often point to an object inside the SVG.  Some of these items
 * will be draggable and others won't.  Currently we are checking if the target
 * has the class draggable, but this test seems like it should be easy to override.
 * @param evt The event that started this.  E.g. the mousedown or touchstart event.
 * @returns The item to be dragged, or undefined if user was not clicking on a
 * valid item.
 */
function getDraggableTarget(evt) {
    const target = evt.target;
    if ((target instanceof SVGGraphicsElement) && (target.classList.contains("draggable"))) {
        return target;
    }
    else {
        return undefined;
    }
}
/**
 * This is another place where the library should let the main program put in a hook.
 * This function is somewhat arbitrary now.  It was part of an example.  The default,
 * in case the main program does not override this, should always return undefined.
 * @param target The item the user is dragging.
 * @returns The boundary the item should be confined to, or undefined to say there are no boundaries.
 */
function getConfinement(target) {
    const confined = target.classList.contains("confine");
    if (confined) {
        return {
            x1: 10.5,
            x2: 30,
            y1: 2.2,
            y2: 19.2,
        };
    }
    else {
        return undefined;
    }
}
export function makeDraggable(svg) {
    svg.addEventListener("mousedown", startDrag);
    svg.addEventListener("mousemove", drag);
    svg.addEventListener("mouseup", endDrag);
    svg.addEventListener("mouseleave", endDrag);
    svg.addEventListener("touchstart", startDrag);
    svg.addEventListener("touchmove", drag);
    svg.addEventListener("touchend", endDrag);
    svg.addEventListener("touchleave", endDrag);
    svg.addEventListener("touchcancel", endDrag);
    let selectedElement;
    let offset;
    let transform;
    let bBox;
    let minX = -1;
    let maxX = -1;
    let minY = -1;
    let maxY = -1;
    let confined = false;
    function getMousePosition(evt) {
        const CTM = svg.getScreenCTM();
        const locationHolder = ("touches" in evt) ? evt.touches[0] : evt;
        return {
            x: (locationHolder.clientX - CTM.e) / CTM.a,
            y: (locationHolder.clientY - CTM.f) / CTM.d,
        };
    }
    function startDrag(evt) {
        const target = getDraggableTarget(evt);
        if (target) {
            selectedElement = target;
            offset = getMousePosition(evt);
            // Make sure the first transform on the element is a translate transform
            const transforms = selectedElement.transform.baseVal;
            if (transforms.length === 0 ||
                transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                // Create an transform that translates by (0, 0)
                const translate = svg.createSVGTransform();
                translate.setTranslate(0, 0);
                selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }
            // Get initial translation
            transform = transforms.getItem(0);
            offset.x -= transform.matrix.e;
            offset.y -= transform.matrix.f;
            const boundaries = getConfinement(target);
            if (boundaries) {
                confined = true;
                bBox = selectedElement.getBBox();
                minX = boundaries.x1 - bBox.x;
                maxX = boundaries.x2 - bBox.x - bBox.width;
                minY = boundaries.y1 - bBox.y;
                maxY = boundaries.y2 - bBox.y - bBox.height;
            }
            else {
                confined = false;
            }
        }
    }
    function drag(evt) {
        if (selectedElement) {
            evt.preventDefault();
            const coord = getMousePosition(evt);
            let dx = coord.x - offset.x;
            let dy = coord.y - offset.y;
            if (confined) {
                if (dx < minX) {
                    dx = minX;
                }
                else if (dx > maxX) {
                    dx = maxX;
                }
                if (dy < minY) {
                    dy = minY;
                }
                else if (dy > maxY) {
                    dy = maxY;
                }
            }
            transform.setTranslate(dx, dy);
            //console.log({dx, dy, selectedElement, evt});
        }
    }
    function endDrag(evt) {
        selectedElement = undefined;
    }
}
