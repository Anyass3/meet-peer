export default function rooms() {
  return [
    { roomId: 'RoomA', participants: [] },
    { roomId: 'RoomB', participants: [] }
  ];
}

// example api on frontend:

// const apiName = 'dmtapp:meet:rooms';

// function joinRoom({ roomId, peerId }) {
//   api(apiName).call('join', { roomId, peerId });
// }
