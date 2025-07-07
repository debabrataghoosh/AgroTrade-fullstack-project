import { NextApiRequest } from 'next';
import { Server } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    io.on('connection', (socket) => {
      // You can add your custom event handlers here
      socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
      });
    });
  }
  res.end();
} 