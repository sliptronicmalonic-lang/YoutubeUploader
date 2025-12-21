const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const img = new Image();
img.src = "assets/wheel.png";

let angle = 0;

img.onload = () => draw();

function draw() {
  ctx.clearRect(0,0,300,300);
  ctx.save();
  ctx.translate(150,150);
  ctx.rotate(angle);
  ctx.drawImage(img,-150,-150,300,300);
  ctx.restore();
}

function spin() {
  let speed = 0.4;
  const interval = setInterval(() => {
    angle += speed;
    speed *= 0.97;
    draw();
    if (speed < 0.01) clearInterval(interval);
  }, 16);
}

async function enter() {
  document.getElementById("msg").innerText = "Waiting for draw...";
  spin();
}