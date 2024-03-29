import { getById } from "./lib/client-misc.js";
import { pick } from "./lib/misc.js";
import { MakeDraggable } from "./lib/svg-drag.js";
const svg = document.querySelector("svg");
const svgTopGroup = getById("top", SVGGElement);
const svgBottomGroup = getById("bottom", SVGGElement);
class Corner {
    initialPosition;
    translation = { x: 0, y: 0 };
    element;
    constructor(initialPosition) {
        this.initialPosition = { ...initialPosition };
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", initialPosition.x.toString());
        circle.setAttribute("cy", initialPosition.y.toString());
        circle.classList.add("outside");
        circle.classList.add("draggable");
        svgTopGroup.appendChild(circle);
        this.element = circle;
        Corner.all.set(circle, this);
    }
    get x() {
        return this.initialPosition.x + this.translation.x;
    }
    get y() {
        return this.initialPosition.y + this.translation.y;
    }
    get position() {
        return { x: this.x, y: this.y };
    }
    updateTranslation(x, y) {
        this.translation.x = x;
        this.translation.y = y;
    }
    static all = new Map();
    static find(possibleElement) {
        return this.all.get(possibleElement);
    }
}
class CornerDragger extends MakeDraggable {
    current;
    getDraggableTarget(evt) {
        const target = evt.target;
        this.current = Corner.find(target);
        return this.current?.element;
    }
    drag(dx, dy) {
        this.current?.updateTranslation(dx, dy);
    }
    endDrag() {
        this.current = undefined;
        circles.forEach(circle => circle.classList.add("obsolete"));
    }
}
new CornerDragger(svg);
const corners = [
    { x: 50, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
].map((center) => new Corner(center));
let last = pick(corners).position;
const circles = [];
let currentHue = 0;
function animateOnce() {
    const moveToward = pick(corners).position;
    const next = {
        x: (last.x + moveToward.x) / 2,
        y: (last.y + moveToward.y) / 2,
    };
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", next.x.toString());
    circle.setAttribute("cy", next.y.toString());
    currentHue++;
    circle.setAttribute("fill", "hsl(" + currentHue + ", 100%, 50%)");
    circle.classList.add("internal");
    svgBottomGroup.appendChild(circle);
    last = next;
    circles.push(circle);
    const toDelete = circles.length - 1000;
    if (toDelete > 0) {
        circles.splice(0, toDelete).forEach((oldCircle) => oldCircle.remove());
    }
}
setInterval(animateOnce, 10);
//# sourceMappingURL=index.js.map