const express = require('express')();
const PORT = process.env.PORT || 3000;
const server = express.listen(PORT);
const io = require('socket.io')(server);
const users = {};
let no_of_users = 0;
io.on('connection', (socket) => {
  no_of_users++;
  socket.broadcast.emit('user-count', { no_of_users: no_of_users });
  socket.emit('user-count', { no_of_users: no_of_users });

  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.emit('account-details', { name: users[socket.id] });
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', (msg) => {
    socket.broadcast.emit('chat-message', { msg: msg, name: users[socket.id] });
  });
  socket.on('disconnect', () => {
    no_of_users--;
    socket.broadcast.emit('user-count', { no_of_users: no_of_users });
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});
