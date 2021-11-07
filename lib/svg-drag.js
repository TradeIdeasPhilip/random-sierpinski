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
export class MakeDraggable {
    svg;
    selectedElement;
    offset = { x: -1, y: -1 };
    transform;
    bBox = new DOMRect();
    minX = -1;
    maxX = -1;
    minY = -1;
    maxY = -1;
    confined = false;
    getSelectedElement() {
        return this.selectedElement;
    }
    constructor(svg) {
        this.svg = svg;
        svg.addEventListener("mousedown", this.startDragEH.bind(this));
        svg.addEventListener("mousemove", this.dragEH.bind(this));
        svg.addEventListener("mouseup", this.endDragEH.bind(this));
        svg.addEventListener("mouseleave", this.endDragEH.bind(this));
        svg.addEventListener("touchstart", this.startDragEH.bind(this));
        svg.addEventListener("touchmove", this.dragEH.bind(this));
        svg.addEventListener("touchend", this.endDragEH.bind(this));
        svg.addEventListener("touchleave", this.endDragEH.bind(this));
        svg.addEventListener("touchcancel", this.endDragEH.bind(this));
    }
    getMousePosition(evt) {
        const CTM = this.svg.getScreenCTM();
        const locationHolder = "touches" in evt ? evt.touches[0] : evt;
        return {
            x: (locationHolder.clientX - CTM.e) / CTM.a,
            y: (locationHolder.clientY - CTM.f) / CTM.d,
        };
    }
    startDragEH(evt) {
        const target = this.getDraggableTarget(evt);
        if (target) {
            this.selectedElement = target;
            this.offset = this.getMousePosition(evt);
            const transforms = this.selectedElement.transform.baseVal;
            if (transforms.length === 0 ||
                transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
                const translate = this.svg.createSVGTransform();
                translate.setTranslate(0, 0);
                this.selectedElement.transform.baseVal.insertItemBefore(translate, 0);
            }
            this.transform = transforms.getItem(0);
            this.offset.x -= this.transform.matrix.e;
            this.offset.y -= this.transform.matrix.f;
            const boundaries = getConfinement(target);
            if (boundaries) {
                this.confined = true;
                this.bBox = this.selectedElement.getBBox();
                this.minX = boundaries.x1 - this.bBox.x;
                this.maxX = boundaries.x2 - this.bBox.x - this.bBox.width;
                this.minY = boundaries.y1 - this.bBox.y;
                this.maxY = boundaries.y2 - this.bBox.y - this.bBox.height;
            }
            else {
                this.confined = false;
            }
        }
    }
    dragEH(evt) {
        if (this.selectedElement) {
            evt.preventDefault();
            const coord = this.getMousePosition(evt);
            let dx = coord.x - this.offset.x;
            let dy = coord.y - this.offset.y;
            if (this.confined) {
                if (dx < this.minX) {
                    dx = this.minX;
                }
                else if (dx > this.maxX) {
                    dx = this.maxX;
                }
                if (dy < this.minY) {
                    dy = this.minY;
                }
                else if (dy > this.maxY) {
                    dy = this.maxY;
                }
            }
            this.transform.setTranslate(dx, dy);
            try {
                this.drag(dx, dy);
            }
            catch (ex) {
                console.error(ex);
            }
        }
    }
    endDragEH(evt) {
        if (this.selectedElement) {
            try {
                this.endDrag();
            }
            catch (ex) {
                console.error(ex);
            }
            this.selectedElement = undefined;
        }
    }
    endDrag() { }
    drag(dx, dy) { }
    getDraggableTarget(evt) {
        const target = evt.target;
        if (target instanceof SVGGraphicsElement &&
            target.classList.contains("draggable")) {
            return target;
        }
        else {
            return undefined;
        }
    }
}
//# sourceMappingURL=svg-drag.js.map