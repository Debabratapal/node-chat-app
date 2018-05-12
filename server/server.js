const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/user');

 const app = express();
var server = http.createServer(app);
const port =process.env.PORT || 8080;
app.use(express.static(path.join(__dirname, '../public')))
var io = socketIO(server);
var users = new Users();

io.on('connection', (socket) => {
  console.log('new User connected');


  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
       return callback('Name and Room name are require.')
    }

    socket.join(params.room);
    //socket.leave('the office fan');

    // io.emin -> io.to('the office fan').emit;
    // socket.broadcast.emit -> socket.broadcast.to('the office fan').emit()
    // socket.emit
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to new Chat App'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback();
  });

  socket.on('createMessage' , (message, callback) => {
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });


  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });
});



server.listen(port, () => {
  console.log(`server is up @ ${port}`);
})
