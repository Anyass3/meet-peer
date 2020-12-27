const express = require('express');

const app = express();

// const App = require("./dist/App.js");
const server = require('http').Server(app);

const io = require('socket.io')(server);
// console.log(io.client,server)
const { v4: uid } = require('uuid');
app.set('view engine', 'ejs');
app.use(express.static('public'));

const MAX_PEERS = 10; // this is the max number allowed for chat room.

const Rooms = {};
const peerRoom = {};

// const html=(code)=>`
// <!DOCTYPE html><html lang="en"><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>
// 	<title>Svelte app</title><link rel='icon' type='image/png' href='/favicon.png'>
// 	<link rel='stylesheet' href='/global.css'><link rel='stylesheet' href='/build/bundle.css'>
//     <script>${code}</script><script defer src='/build/bundle.js'></script></head><body></body></html>
// `

// app.get('*', (req, res) => {
//     const { html } = App.render({ url: req.url });

//   res.write(`
// `);

// res.end();
// })

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/new-room', (req, res) => {
  console.log('about creating to a new room');
  res.redirect(`room/${uid()}`);
  console.log('creating to a new room');
});

app.get('/room/:room', (req, res) => {
  res.render('room', { roomID: req.params.room });
  res.end();
});

io.on('connection', (socket) => {
  socket.on('join-room', ({ roomID, name }) => {
    // console.log('Rooms',Rooms)
    if (Rooms[roomID]) {
      const len = Rooms[roomID].length;
      // console.log(len)
      // console.log('checking for whether room is full')
      if (len >= MAX_PEERS) {
        // console.log('room is full')
        socket.emit('room-full');
        return;
      }
      Rooms[roomID].push({ id: socket.id, name });
    } else Rooms[roomID] = [{ id: socket.id, name }];
    peerRoom[socket.id] = roomID;
    const peers = Rooms[roomID].filter((i) => i.id !== socket.id);
    // console.log(peers)
    socket.emit('joined-in-room', peers);
    // socket.join(roomID)
    // socket.to(roomID).broadcast.emit('user-connected', {userID, data})
    // console.log(userID)
  });
  socket.on('signaling-peer', (payload) => {
    // console.log('signaling-peer')
    io.to(payload.peerID).emit('user-joined', {
      signal: payload.signal,
      userID: payload.userID,
      name: payload.name,
    });
  });
  socket.on('returning-signal', (payload) => {
    console.log('returning-signal', payload.userID);
    io.to(payload.userID).emit('receiving-returned-signal', {
      signal: payload.signal,
      id: socket.id,
      name: payload.name,
    });
  });
  socket.on('disconnect', () => {
    // console.log(socket.id,'disconnected')
    const roomID = peerRoom[socket.id];
    const room = Rooms[roomID];
    if (room) {
      Rooms[roomID] = room.filter((i) => i.id !== socket.id);
      Rooms[roomID].forEach((s) => io.to(s.id).emit('peer-left', socket.id));
    }
  });
  console.log('new socket connection');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server stated at port ${port}`);
});
