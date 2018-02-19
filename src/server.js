const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/index.html`);

const onRequest = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html ' });
  res.write(index);
  res.end();
};

const app = http.createServer(onRequest).listen(PORT);

const io = socketio(app);

// Join sockets
const onJoined = (sock) => {
  const socket = sock;

  socket.on('join', () => {
    console.log('User has joined.');
    socket.join('room1');
  });
};

// Receive
const onDo = (sock) => {
  const socket = sock;

  // Draw
  socket.on('draw', (data) => {
    io.sockets.in('room1').emit('drawToCanvas', data);
  });
  // Clear
  socket.on('clearCanvas', () => {
    io.sockets.in('room1').emit('clearAll');
  });
};

// Socket leave
const onDisconnect = (sock) => {
  const socket = sock;
    
  console.log('User has left.');

  socket.leave('room1');
};

io.sockets.on('connection', (socket) => {
  onJoined(socket);
  onDo(socket);
  onDisconnect(socket);

  console.log('Server Started.');
});

console.log(`Listening on port ${PORT}`);
