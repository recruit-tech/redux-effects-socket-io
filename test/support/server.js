import SocketIO from 'socket.io';
module.exports = (port) => {
  const io = SocketIO(port);
  io.on('connection', (socket) => {
    socket.on('message', (msg) => {
      io.emit('message', msg);
    });
  
    socket.on('disconnect', () => {
      io.emit('disconnected');
    });
  });

  return io;
}

