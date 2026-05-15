const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3200;

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log(`Socket conectado: ${socket.id}`);

  socket.on('join', (userData) => {
    const user = {
      id: socket.id,
      uid: userData.uid,
      name: userData.name,
      status: userData.status,
      avatar: userData.avatar,
      email: userData.email,
    };

    connectedUsers[socket.id] = user;

    io.emit('userList', Object.values(connectedUsers));

    socket.broadcast.emit('systemMessage', {
      text: `${user.name} se ha unido al chat`,
      type: 'join',
    });
  });

  socket.on('chatMessage', ({ text }) => {
    const user = connectedUsers[socket.id];
    if (!user) return;

    const message = {
      id: `${Date.now()}-${socket.id}`,
      text,
      user,
      timestamp: new Date().toISOString(),
    };

    io.emit('chatMessage', message);
  });

  socket.on('typing', (isTyping) => {
    const user = connectedUsers[socket.id];
    if (!user) return;

    socket.broadcast.emit('typing', { user, isTyping });
  });

  socket.on('disconnect', () => {
    const user = connectedUsers[socket.id];
    if (!user) return;

    delete connectedUsers[socket.id];

    io.emit('userList', Object.values(connectedUsers));
    io.emit('systemMessage', {
      text: `${user.name} ha salido del chat`,
      type: 'leave',
    });
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', users: Object.keys(connectedUsers).length });
});

app.get('/', (_req, res) => {
  res.send('Servidor del chat funcionando');
});

server.listen(PORT, () => {
  console.log(`Servidor WebSocket corriendo en http://localhost:${PORT}`);
});
