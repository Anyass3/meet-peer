export default function makeApi(store) {
  const { state } = store;
  state.rooms = state.rooms || [];
  store.on('hi', () => {
    store.emit('hi');
    console.log('hi event');
  });
  return {
    getRoom(roomId) {
      return state.rooms.find((room) => room.roomId == roomId);
    },
    join({ roomId, peerId, peerName }) {
      const room = this.getRoom(roomId);

      if (room) {
        room.participants = room.participants || [];

        if (!room.participants.find((peer) => peer.peerId == peerId)) {
          room.participants.push({ peerId, peerName });
          store.announceStateChange();
        }
      } else {
        state.rooms.push({ roomId, participants: [{ peerId, peerName }] });
        store.announceStateChange();
      }
    },
    leave({ roomId, peerId }) {
      const room = this.getRoom(roomId);
      if (room && room.participants) {
        room.participants = room.participants.filter((peer) => peer.peerId !== peerId);
        store.announceStateChange();
      }
    },
  };
}
