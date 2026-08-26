import { io } from 'socket.io-client';

const serverUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3001';
const socket = io(serverUrl);

export default socket;
