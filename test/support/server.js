import SocketIO from 'socket.io';

export default (port) => {
  const io = SocketIO(port);
  io.on('connection', (socket) => {
    socket.on('message', (msg) => {
      io.emit('message', msg);
    });

    socket.on('message2', (msg) => {
      io.emit('message2', msg);
    });


    socket.on('disconnect', () => {
      io.emit('disconnected');
    });
  });

  return io;
};
