const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

/// Load http module
let http = require("http");
let PORT = 3000;

// Load express module
let app = express();

// Create server
// Hook it up to listen to the correct PORT
let server = http.createServer(app).listen(PORT);

// Load the socket.io functionality
// Hook it up to the web server
let io = require("socket.io")(server);

let firstTime = true;

const urlencoded = require('body-parser').urlencoded;
app.use(urlencoded({ extended: false }));

io.on('connection', (socket) => {
    console.log('a user connected');
  });

app.use(express.static('public'));

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
app.post('/voice', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  const gather = twiml.gather({ numDigits: 1 });


  if(firstTime){
    gather.say('Hello and welcome to the music box - please start typing in numbers.');
    firstTime = false;
}
  // If the user entered digits, process their request
  if (request.body.Digits) {
    switch (request.body.Digits) {
      case '1':
       io.emit("playSound", 'a');
       twiml.redirect('/voice');
        break;
      case '2':
        io.emit("playSound", 'b');
        twiml.redirect('/voice');
        break;
      case '3':
        io.emit("playSound", 'c');
        twiml.redirect('/voice');
        break;
    case '4':
        io.emit("playSound", 'd');
        twiml.redirect('/voice');
        break;
    case '5':
        io.emit("playSound", 'e');
        twiml.redirect('/voice');
        break;
    case '6':
        io.emit("playSound", 'f');
        twiml.redirect('/voice');
        break;
    case '7':
        io.emit("playSound", 'g');
        twiml.redirect('/voice');
        break;
    case '8':
        io.emit("playSound", 'h');
        twiml.redirect('/voice');
        break;
    case '9':
        io.emit("playSound", 'i');
        twiml.redirect('/voice');
        break;
    }
  } else {
    // If no input was sent, use the <Gather> verb to collect user input
    twiml.redirect('/voice');
  }

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
  twiml.redirect('/voice');
});

// Clients in the output namespace
io.on(
  "connection",
  // Callback function on connection
  // Comes back with a socket object
  function(socket) {
    console.log("HELLO", socket.id);
    
    // This connected socket listens for incoming messages called 'data'
    socket.on('data', function(data){
      
      // Send it back out to everyone
      io.emit('data', data);
    });
    
  }
);
