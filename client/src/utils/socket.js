import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: false,
});

socket.on('connect_error', (err) => {
  console.error(`connect_error due to ${err.message}`);
});
