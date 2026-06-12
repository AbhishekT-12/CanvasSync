const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;

canvas.addEventListener("mousedown", () => {
    drawing = true;
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
    ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!drawing) return;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
}

const roomId = window.location.pathname.split("/").pop();
const socket = io();
socket.on("connect", () => {
    socket.emit("join", { room: roomId });
    console.log("Connected and joined room:", roomId);
});