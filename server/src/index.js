const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const logger = require('./utils/logger');
const apiRoutes = require('./routes/api.routes');
const { setupSocket } = require('./jobs/processor');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE', 'PUT']
    }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/storage/clips', express.static(path.join(__dirname, '../../storage/clips')));
app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});

// Socket setup for background jobs
setupSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
