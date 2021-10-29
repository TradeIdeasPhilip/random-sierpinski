import { getById } from "./lib/client-misc.js";
import { pick } from "./lib/misc.js";
const svg = document.querySelector("svg");
const outside = [
    { x: 50, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
];
outside.forEach((center) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", center.x.toString());
    circle.setAttribute("cy", center.y.toString());
    circle.classList.add("outside");
    svg.appendChild(circle);
});
let last = pick(outside);
const circles = [];
let currentHue = 0;
const recentPath = getById("recent", SVGPathElement);
function animateOnce() {
    const moveToward = pick(outside);
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
    svg.appendChild(circle);
    last = next;
    circles.push(circle);
    const toDelete = circles.length - 1000;
    if (toDelete > 0) {
        circles.splice(0, toDelete).forEach(oldCircle => oldCircle.remove());
    }
    // let path = "M";
    // for (let i = Math.max(0, circles.length - 10); i < circles.length; i++) {
    //   const circle = circles[i];
    //   path += " " + circle.cx.baseVal.value + "," + circle.cy.baseVal.value;
    // }
    // recentPath.setAttribute("d", path);
    // recentPath.setAttribute("stroke", "hsl(" + currentHue + ", 100%, 33%)");
}
//(window as any).animateOnce = animateOnce;
setInterval(animateOnce, 10);
