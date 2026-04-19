const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/checkin', require('./routes/checkinRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/participants', require('./routes/participantRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`🌍 Deploy URL sẽ là: https://your-app.onrender.com`);
    console.log('--------------------------------------------------');
});
