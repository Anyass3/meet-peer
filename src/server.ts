import sirv from 'sirv';
// import express from "express";
import compression from 'compression';
import * as sapper from '@sapper/server';
import { emit } from 'process';
// import http from 'http'
// import * as socketio from 'socket.io';
// import polka from 'polka';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const express = require('express');

const app = express();

// const App = require("./dist/App.js");
const server = require('http').Server(app);

const io = require('socket.io')(server);

app // You can also use Express

  .get('/new-room', (req, res) => {
    res.redirect(`room/${uid()}`);
    console.log('redirected to new room');
  })
  .use(compression({ threshold: 0 }), sirv('static', { dev }), sapper.middleware());

server.listen(PORT);
const { v4: uid } = require('uuid');

const MAX_PEERS = 100; // this is the max number allowed for chat room.

const Rooms = {};
const peerRoom = {};

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  socket.on('join-room', ({ roomId, name }) => {
    // console.log('Rooms',Rooms)
    if (Rooms[roomId]) {
      const len = Rooms[roomId].length;
      // console.log(len)
      // console.log('checking for whether room is full')
      if (len >= MAX_PEERS) {
        // console.log('room is full')
        socket.emit('room-full');
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
    // console.log('signaling-peer')
    io.to(payload.peerId).emit('user-joined', {
      signal: payload.signal,
      userId: payload.userId,
      name: payload.name,
    });
  });
  socket.on('returning-signal', (payload) => {
    // console.log('returning-signal')
    io.to(payload.userId).emit('receiving-returned-signal', {
      signal: payload.signal,
      id: socket.id,
      name: payload.name,
    });
  });
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
    const roomId = peerRoom[socket.id];
    const room = Rooms[roomId];
    if (room) {
      Rooms[roomId] = room.filter((i) => i.id !== socket.id);
      Rooms[roomId].forEach((s) => io.to(s.id).emit('peer-left', socket.id));
    }
  });
  console.log('new socket connection');
});

// app.get('/', (req, res) =>{
//     res.render('home')
// })

// app.get('/new-room',(req, res)=>{
//     console.log('creating a new room')
//     res.redirect(`room/${uid()}`)
//     console.log('redirected to new room')
// })

// app.get('/room/:room',(req, res)=>{
//     res.render('room',{roomId: req.params.room})
//     res.end()
// })
