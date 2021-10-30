// I don't remember where I first heard about this.
// But this video does a great job explaining what I'm doing.
// https://youtu.be/5nuYD2M2AX8

import { getById } from "./lib/client-misc.js";
import { pick } from "./lib/misc.js";
import { makeDraggable } from "./lib/svg-drag.js";

const svg = document.querySelector("svg")!;
const svgTopGroup = getById("top", SVGGElement);
const svgBottomGroup = getById("bottom", SVGGElement);

makeDraggable(svg);

const outside = [
  { x: 50, y: 0 },
  { x: 0, y: 100 },
  { x: 100, y: 100 },
];

outside.forEach((center) => {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", center.x.toString());
  circle.setAttribute("cy", center.y.toString());
  circle.classList.add("outside");
  circle.classList.add("draggable");
  svgTopGroup.appendChild(circle);
});

let last = pick(outside);

const circles : SVGCircleElement[] = [];

let currentHue = 0;

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
  svgBottomGroup.appendChild(circle);
  last = next;

  circles.push(circle);
  const toDelete = circles.length - 1000;
  if (toDelete > 0) {
    circles.splice(0, toDelete).forEach(oldCircle => oldCircle.remove());
  }
}

//(window as any).animateOnce = animateOnce;
setInterval(animateOnce, 10);