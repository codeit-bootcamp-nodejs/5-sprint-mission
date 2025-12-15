import { ExtendedError, Server, Socket } from 'socket.io';
import http from 'http';
import { Notification } from '../types/Notification';
import User from '../types/User';
import { authenticate } from './authService';

const io = new Server();
const auth = async (socket:Socket, next:(err? :ExtendedError) => void) => {
  let user: User;
  try{
    const accessToken = socket.handshake.auth.accessToken;
    user = await authenticate(accessToken);
  }catch(err){
    console.error(err);
    next(err as ExtendedError);
    return;
  }

  socket.join(user.id.toString());
  next();
}

io.use(auth);

export const sendNotification = (notification: Notification) => {
  const userId = notification.userId;
  io.to(userId.toString()).emit('notification', notification);
};

export const init = (httpServer: http.Server) => {
  io.attach(httpServer);
};
