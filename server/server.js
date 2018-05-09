const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
var server = http.createServer(app);
const port =process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, '../public')))
var io = socketIO(server);

io.on('connection', (socket) => {
  console.log('new User connected');


  socket.emit('newMessage',{
    from: 'Admin',
    text: 'welcome to chat app',
    createAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'new user joined',
    createAt: new Date().getTime()
  });

  socket.on('createMessage' ,(message) => {
    console.log('createMessage', message);
    io.emit('newMessage',{
      from: message.from,
      text: message.text,
      createAt: new Date().getTime()
    })
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
