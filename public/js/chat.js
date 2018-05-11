var socket = io();

  function scrollToButton() {
    //selectors
    var messages = jQuery('#message');
    var newMessage = messages.children('li:last-child');
    //height
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
  }

socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if(err) {
      alert(err)
      window.location.href = '/';
    } else {
      console.log('no err');
    }

  })
});


socket.on('disconnect', function() {
  console.log('disconnected from server ');
});


socket.on('updateUserList', function(users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#user').html(ol);
});

socket.on('newMessage', function(message) {
  var formattedTime = moment(message.createAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template , {
    text: message.text,
    from: message.from,
    createAt: formattedTime
  });

  jQuery('#message').append(html);
  scrollToButton();
  // console.log("newMessage", message);
  // var li = jQuery('<li></li>');
  // li.text(`${message.from}: ${message.text}  --${formattedTime}`);
  // jQuery('#message').append(li);
})

  socket.on('newLocationMessage', function(message) {

    var formattedTime = moment(message.createAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createAt: formattedTime
    });

    jQuery('#message').append(html);
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
    //
    // li.text(`${message.from}:  --${formattedTime}`);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#message').append(li);
    scrollToButton();
  });


// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'hi!'
// }, function(data) {
//   console.log('Got it', data);
// });

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
