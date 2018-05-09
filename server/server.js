const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const app = express();
var server = http.createServer(app);
const port =process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../public')))
var io = socketIO(server);

io.on('connection', (socket) => {
  console.log('new User connected');


  socket.emit('newMessage', generateMessage('Admin', 'Welcome to new Chat App'));

  socket.broadcast.emit('newMessage', generateMessage('Admin','New user joined'));

  socket.on('createMessage' ,(message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('this is from the server');
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createAt: new Date().getTime()
    // });
  });


  socket.on('disconnect', () => {
    console.log('user is disconnected');
  });
});



server.listen(port, () => {
  console.log(`server is up @ ${port}`);
})
