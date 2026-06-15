const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let lastX = 0, lastY = 0;

function drawLine(x1, y1, x2, y2, color, size) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
}

canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    lastX = e.clientX;
    lastY = e.clientY;
});

canvas.addEventListener("mouseup", () => {
    drawing = false;
});

canvas.addEventListener("mousemove", draw);

function draw(event) {
    if (!drawing) return;

    const data = {
        room: roomId,
        x1: lastX,
        y1: lastY,
        x2: event.clientX,
        y2: event.clientY,
        color: "#000000",
        size: 3
    };

    drawLine(data.x1, data.y1, data.x2, data.y2, data.color, data.size);
    socket.emit("drawing_event", data);

    lastX = event.clientX;
    lastY = event.clientY;
}

const roomId = window.location.pathname.split("/").pop();
const socket = io();

socket.on("connect", () => {
    socket.emit("join", { room: roomId });
    console.log("Connected and joined room:", roomId);
});

socket.on("drawing_event", (data) => {
    drawLine(data.x1, data.y1, data.x2, data.y2, data.color, data.size);
});