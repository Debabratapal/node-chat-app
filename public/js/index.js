var socket = io();

socket.on('connect', function() {
  console.log("connected to server");
});


socket.on('disconnect', function() {
  console.log('disconnected from server ');
});

socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createAt).format('h:mm a');
  console.log("newMessage", message);
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}  --${formattedTime}`);
  jQuery('#message').append(li);
})

  socket.on('newLocationMessage', function(message) {

    var formattedTime = moment(message.createAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}:  --${formattedTime}`);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#message').append(li);

  });


socket.emit('createMessage', {
  from: 'Frank',
  text: 'hi!'
}, function(data) {
  console.log('Got it', data);
});

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();

  var textBox = jQuery('[name=message]');

  socket.emit('createMessage',{
    from: 'User',
    text: textBox.val()
  }, function() {
    textBox.val('');
  })
})

var locationButton = jQuery('#send-location');

locationButton.on('click', function() {
  if(!navigator.geolocation){
    return alert('Geolocation not supported on your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position) {
    locationButton.removeAttr('disabled').text("Send Location");
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location');
  })
})
