class RoomManager:
    def __init__(self):
        self._rooms = {}

    def add_client(self, room_id, sid):
        self._rooms.setdefault(room_id, set()).add(sid)

    def remove_client(self, room_id, sid):
        for room_id in list(self._rooms):
            self._rooms[room_id].discard(sid)

    def get_clients(self, room_id):
        return self._rooms.get(room_id, set())

    def list_rooms(self):
        return list(self._rooms.keys())