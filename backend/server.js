const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
    origin: 'agile-clb-event-management-system.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/checkin', require('./routes/checkinRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/participants', require('./routes/participantRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 Server đang chạy trên Port: ${PORT}`);
    console.log('--------------------------------------------------');
});
