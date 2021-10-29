console.log("Hello world.");
const svg = document.querySelector("svg");
const outside = [
    { x: 50, y: 0 },
    { x: 0, y: 100 },
    { x: 100, y: 100 },
];
function pick(array) {
    return array[(Math.random() * 3) | 0];
}
outside.forEach((center) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", center.x.toString());
    circle.setAttribute("cy", center.y.toString());
    circle.classList.add("outside");
    svg.appendChild(circle);
});
let last = pick(outside);
const circles = [];
let nextHue = 0;
function animateOnce() {
    const moveToward = pick(outside);
    const next = {
        x: (last.x + moveToward.x) / 2,
        y: (last.y + moveToward.y) / 2,
    };
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", next.x.toString());
    circle.setAttribute("cy", next.y.toString());
    circle.setAttribute("fill", "hsl(" + nextHue + ", 100%, 50%)");
    nextHue++;
    circle.classList.add("internal");
    svg.appendChild(circle);
    last = next;
    circles.push(circle);
    const toDelete = circles.length - 1000;
    if (toDelete > 0) {
        circles.splice(0, toDelete).forEach(oldCircle => oldCircle.remove());
    }
}
//(window as any).animateOnce = animateOnce;
setInterval(animateOnce, 10);
export {};
