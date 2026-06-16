const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let lastX = 0, lastY = 0;
let color = "#000000";
let brushSize = 3;

function drawLine(x1, y1, x2, y2, col, size) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = col;
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

canvas.addEventListener("mouseleave", () => {
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
        color: color,
        size: brushSize
    };

    drawLine(data.x1, data.y1, data.x2, data.y2, data.color, data.size);
    socket.emit("drawing_event", data);

    lastX = event.clientX;
    lastY = event.clientY;
}

document.getElementById("colorPicker").addEventListener("input", (e) => {
    color = e.target.value;
});

document.getElementById("brushSize").addEventListener("input", (e) => {
    brushSize = parseInt(e.target.value);
});

function setEraser() {
    color = "#ffffff";
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear_canvas", { room: roomId });
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

socket.on("sync_history", (data) => {
    console.log(`Replaying ${data.events.length} events from history`);
    data.events.forEach(e => {
        drawLine(e.x1, e.y1, e.x2, e.y2, e.color, e.size);
    });
});

socket.on("clear_canvas", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    drawing = true;
    lastX = touch.clientX;
    lastY = touch.clientY;
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!drawing) return;
    const touch = e.touches[0];
    const data = {
        room: roomId,
        x1: lastX,
        y1: lastY,
        x2: touch.clientX,
        y2: touch.clientY,
        color: color,
        size: brushSize
    };
    drawLine(data.x1, data.y1, data.x2, data.y2, data.color, data.size);
    socket.emit("drawing_event", data);
    lastX = touch.clientX;
    lastY = touch.clientY;
}, { passive: false });

canvas.addEventListener("touchend", () => {
    drawing = false;
});