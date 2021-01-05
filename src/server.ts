import sirv from 'sirv';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const express = require('express');

const app = express();

const { v4: uid } = require('uuid');

const MAX_PEERS = 100; // this is the max number allowed for chat room.

const Rooms = {};
const peerRoom = {};

const server = require('http').createServer(app);
const io = require('socket.io')(server);
app
  .get('/new-room', (req, res) => {
    res.redirect(`room/${uid()}`);
    console.log('redirected to new room');
  })
  .use(compression({ threshold: 0 }), sirv('static', { dev }), sapper.middleware());

server.listen(PORT);

io.on('connection', (socket) => {
  // console.log('socket connected', socket.id);

  socket.on('join-room', ({ roomId, name }) => {
    if (Rooms[roomId]) {
      const len = Rooms[roomId].length;
      // console.log(len)
      // console.log('checking for whether room is full')
      if (len >= MAX_PEERS) {
        // console.log('room is full')
        socket.emit('room-full');
        Rooms[roomId].forEach((s) => io.to(s.id).emit('notAllowed-room-full', name));
        return;
      }
      Rooms[roomId].push({ id: socket.id, name });
    } else Rooms[roomId] = [{ id: socket.id, name }];
    peerRoom[socket.id] = roomId;
    const peers = Rooms[roomId].filter((i) => i.id !== socket.id);
    // console.log(peers)
    socket.emit('joined-in-room', peers);
    // socket.join(roomId)
    // socket.to(roomId).broadcast.emit('user-connected', {userId, data})
    // console.log(userId)
  });
  socket.on('signaling-peer', (payload) => {
    const signaledPeer = io.to(payload.peerId);
    // console.log('signaling-peer')
    if (payload.signal.type === 'offer')
      signaledPeer.emit('user-joined', {
        signal: payload.signal,
        peerId: socket.id,
        name: payload.name,
      });
    else
      signaledPeer.emit('receiving-candidate', {
        peerId: socket.id,
        signal: payload.signal,
      });
  });
  socket.on('returning-signal', (payload) => {
    // console.log('returning-signal', payload.userId);
    io.to(payload.peerId).emit('receiving-returned-signal', {
      signal: payload.signal,
      id: socket.id,
      name: payload.name,
    });
  });
  socket.on('disconnect', () => {
    const roomId = peerRoom[socket.id];
    const room = Rooms[roomId];
    if (room) {
      Rooms[roomId] = room.filter((i) => i.id !== socket.id);
      Rooms[roomId].forEach((s) => io.to(s.id).emit('peer-left', socket.id));
    }
    // console.log(socket.id, 'disconnected');
  });
});
