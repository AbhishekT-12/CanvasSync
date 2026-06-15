class RoomManager:
    def __init__(self):
        self._rooms = {}
        self._history = {}

    def add_client(self, room_id, sid):
        self._rooms.setdefault(room_id, set()).add(sid)
        self._history.setdefault(room_id, [])

    def remove_client(self, room_id, sid):
        for room_id in list(self._rooms):
            self._rooms[room_id].discard(sid)

    def get_clients(self, room_id):
        return self._rooms.get(room_id, set())

    def list_rooms(self):
        return list(self._rooms.keys())

    def record_event(self, room_id, event):
        history = self._history.setdefault(room_id, [])
        if len(history) < 2000:
            history.append(event)

    def get_history(self, room_id):
        return self._history.get(room_id, [])

    def clear_history(self, room_id):
        self._history[room_id] = []