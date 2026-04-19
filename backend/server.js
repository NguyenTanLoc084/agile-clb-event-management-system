const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ===== API =====
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/qr', require('./routes/qrRoutes'));
app.use('/api/checkin', require('./routes/checkinRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/participants', require('./routes/participantRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// ===== STATIC =====
app.use(express.static(path.join(__dirname, '../frontend')));

// ===== ROUTE CHÍNH =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ❗ CHỈ fallback khi KHÔNG phải file tĩnh
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next(); // bỏ qua API
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ===== PORT =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
