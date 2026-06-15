from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit
from config import SECRET_KEY
from room_manager import RoomManager

app = Flask(__name__)
app.config["SECRET_KEY"] = SECRET_KEY
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

manager = RoomManager()

@app.route("/")
def home():
    return "CanvasSync server is running!"

@app.route("/room/<room_id>")
def room(room_id):
    return render_template("index.html", room_id=room_id)

@socketio.on("join")
def on_join(data):
    room = data["room"]
    join_room(room)
    manager.add_client(room, request.sid)
    history = manager.get_history(room)
    emit("sync_history", {"events": history})
    print(f"[{request.sid}] joined room: {room}")

@socketio.on("disconnect")
def on_disconnect():
    manager.remove_client(None, request.sid)
    print(f"[{request.sid}] disconnected")

@socketio.on("drawing_event")
def on_drawing(data):
    manager.record_event(data["room"], data)
    emit("drawing_event", data, room=data["room"], include_self=False)

@socketio.on("clear_canvas")
def on_clear(data):
    manager.clear_history(data["room"])
    emit("clear_canvas", {}, room=data["room"])

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)