const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');

// Connect to database
connectDB();

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());
app.use(express.static('public'));

const server = http.createServer(app);
const mongoose = require('mongoose');

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/classlinks', require('./routes/classlinks'));
app.use('/api/results', require('./routes/results'));
app.use('/api/users', require('./routes/users'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/tests', require('./routes/testRoutes'));

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

const expressServer = server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} received. Closing http server.`);
  expressServer.close(() => {
    console.log('Http server closed.');
    // Close socket.io server
    io.close(() => {
      console.log('Socket.io server closed.');
      mongoose.connection.close(false, () => {
        console.log('MongoDb connection closed.');
        process.exit(0);
      });
    });
  });
};

// For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('SIGUSR2');
});

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});

// For Heroku app termination
process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});
