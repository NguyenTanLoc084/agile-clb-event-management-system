const express = require('express');
const cors = require('cors');

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log('--------------------------------------------------');
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`🔐 API Auth: http://localhost:${PORT}/api/auth/login`);
    console.log(`📧 API Quên mật khẩu: http://localhost:${PORT}/api/auth/send-otp`);
    console.log('--------------------------------------------------');
});