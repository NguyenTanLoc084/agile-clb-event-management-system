// ===== SCRUM-26: CHECK-IN API  =====

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const PARTICIPANTS_FILE = path.join(__dirname, '../data/participants.json');
const EVENTS_FILE = path.join(__dirname, '../data/events.json');

function readJSON(filePath) {
    try {
        if (!fs.existsSync(filePath)) return [];
        return JSON.parse(fs.readFileSync(filePath, 'utf8') || '[]');
    } catch (err) { return []; }
}

router.post('/check-ticket', (req, res) => {
    let { code } = req.body;
    if (code) code = code.trim();

    if (!code) return res.status(400).json({ message: "Vui lòng cung cấp mã vé" });

    const participants = readJSON(PARTICIPANTS_FILE);
    const events = readJSON(EVENTS_FILE);

    const index = participants.findIndex(p => p.ticketCode === code || p.id === code);
    if (index === -1) {
        return res.status(404).json({ message: "Mã vé không tồn tại trên hệ thống" });
    }

    const user = participants[index];
    const event = events.find(e => e.id === user.eventId);
    if (!event) {
        return res.status(404).json({ message: "Không tìm thấy thông tin sự kiện đi kèm" });
    }
    const now = new Date();
    const startTime = new Date(event.time); 
    const endTime = new Date(event.endTime);
    if (now < startTime) {
        return res.status(403).json({ 
            message: `Chưa đến giờ check-in. Sự kiện bắt đầu lúc: ${startTime.toLocaleString('vi-VN')}`,
            user: { name: user.name }
        });
    }
    if (now > endTime) {
        return res.status(403).json({ 
            message: `Sự kiện đã kết thúc vào lúc: ${endTime.toLocaleString('vi-VN')}. Không thể điểm danh!`,
            user: { name: user.name }
        });
    }
    if (user.checkedIn) {
        return res.status(409).json({ 
            message: `Sinh viên này đã điểm danh lúc ${user.checkinTime}`,
            user: { name: user.name, mssv: user.mssv }
        });
    }
    user.checkedIn = true;
    user.checkinTime = now.toLocaleString('vi-VN');

    participants[index] = user;
    fs.writeFileSync(PARTICIPANTS_FILE, JSON.stringify(participants, null, 2));
    res.json({
        success: true,
        message: "Điểm danh thành công!",
        user: {
            name: user.name,
            email: user.email,
            mssv: user.mssv,
            eventName: event.name,
            checkinTime: user.checkinTime
        }
    });
});

module.exports = router;