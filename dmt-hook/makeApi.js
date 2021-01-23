export default function makeApi(store) {
  return {
    join({ roomId, peerId }) {
      const { state } = store;

      if (state.rooms) {
        const room = state.rooms.find(room => room.roomId == roomId);

        room.participants = room.participants || [];

        if (room) {
          if (!room.participants.find(peerName => peerId == peerName)) {
            room.participants.push(peerId);
            store.announceStateChange();
          }
        }
      }
    }
  };
}
