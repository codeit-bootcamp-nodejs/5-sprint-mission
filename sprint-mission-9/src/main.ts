import { createServer } from 'http';
import socketService from './services/socketService';
import { createApp } from './app';
import { PORT } from './lib/constants';

const app = createApp()
const server = createServer(app);
socketService.initialize(server);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
