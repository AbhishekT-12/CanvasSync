\# CanvasSync



A real-time collaborative whiteboard built with Flask-SocketIO and the HTML5 Canvas API. Multiple users can join a shared room and draw together live, with every stroke synced instantly across all connected browsers.



\## 🌐 Live Demo



\[https://web-production-f4fc5.up.railway.app](https://web-production-f4fc5.up.railway.app)



Open a room by visiting `/room/<any-name>` — share that URL with others to draw together.



```

https://web-production-f4fc5.up.railway.app/room/team-sync

```



\## Features



\- \*\*Real-time drawing sync\*\* — strokes appear on every connected client instantly via WebSockets

\- \*\*Room-based sessions\*\* — each room is isolated; only people with the same room link see the same canvas

\- \*\*Late-joiner history sync\*\* — anyone who joins an in-progress session sees everything drawn so far

\- \*\*Color picker \& brush size\*\* — customize stroke color and thickness

\- \*\*Eraser tool\*\*

\- \*\*Clear canvas\*\* — synced across all clients in the room

\- \*\*Touch support\*\* — works on mobile and tablet browsers

\- \*\*Responsive canvas\*\* — adapts to window resizing



\## Tech Stack



| Layer | Technology |

|---|---|

| Backend | Python, Flask, Flask-SocketIO |

| Async server | Eventlet |

| Frontend | HTML5 Canvas, vanilla JavaScript |

| Real-time protocol | WebSockets (Socket.IO) |

| Deployment | Railway (Gunicorn) |



\## Project Structure



```

canvassync/

├── app.py                 # Flask app, routes, Socket.IO event handlers

├── config.py               # Environment-based configuration

├── room\_manager.py         # Tracks clients and drawing history per room

├── requirements.txt        # Python dependencies

├── Procfile                 # Production start command (Gunicorn)

├── runtime.txt              # Python version for deployment

├── .env.example              # Sample environment variables

├── templates/

│   └── index.html           # Canvas UI and toolbar

└── static/

&#x20;   ├── script.js             # Drawing logic, Socket.IO client

&#x20;   └── socket.io.min.js      # Socket.IO client library (bundled locally)

```



\## How It Works



1\. A user opens `/room/<room\_id>` and the browser establishes a WebSocket connection.

2\. On connect, the client emits a `join` event with the room name.

3\. The server adds the client to that room and immediately sends back the room's full drawing history via `sync\_history`.

4\. As the user draws, the client emits `drawing\_event` messages containing line coordinates, color, and brush size.

5\. The server records each event in that room's history and broadcasts it to every other client in the room.

6\. Clicking \*\*Clear All\*\* emits a `clear\_canvas` event, which wipes the server-side history and tells every client to clear their canvas.



\## Local Setup



\### Prerequisites

\- Python 3.11+

\- pip



\### Installation



```bash

git clone https://github.com/AbhishekT-12/CanvasSync.git

cd CanvasSync



python -m venv venv

venv\\Scripts\\activate        # Windows

\# source venv/bin/activate   # macOS/Linux



pip install -r requirements.txt

```



\### Configuration



Copy the example environment file and adjust if needed:



```bash

copy .env.example .env       # Windows

\# cp .env.example .env       # macOS/Linux

```



```

SECRET\_KEY=devsecretkey123

DEBUG=true

PORT=5000

```



\### Run



```bash

python app.py

```



Open `http://localhost:5000/room/test` in multiple browser tabs to see the sync in action.



\## Deployment



This project deploys to \[Railway](https://railway.app) using Gunicorn with the eventlet worker class, configured via the `Procfile`:



```

web: gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT app:app

```



> \*\*Note:\*\* Only 1 worker (`-w 1`) is used intentionally. Room and history state is stored in memory, so multiple worker processes would each have their own disconnected copy of the data, breaking real-time sync across users connected to different workers.



Set the following environment variables on your deployment platform:



| Variable | Description |

|---|---|

| `SECRET\_KEY` | Flask session secret |

| `DEBUG` | Set to `false` in production |

| `PORT` | Usually injected automatically by the platform |



\## Known Limitations



\- Drawing history is stored in memory and capped at 2,000 strokes per room; it resets if the server restarts.

\- Canvas content outside the visible area is lost if the browser window is resized smaller and then made larger again.

\- No authentication — anyone with a room link can join and draw.



\## Future Improvements



\- Persistent storage (Redis or a database) for drawing history

\- Undo/redo support

\- Shape tools (rectangle, circle, line)

\- User cursors showing who's drawing where

\- Room expiry and cleanup for inactive sessions



\## Contributors



\- Abhishek

\- Ardra A Nair

\- Rakhi Morankar



\## License



This project was built for educational/internship purposes.



