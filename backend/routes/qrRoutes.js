// ===== SCRUM-27 & SCRUM-97: GENERATE QR & SAVE PARTICIPANT =====

const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const participantsPath = path.join(__dirname, '../data/participants.json');

router.post('/generate-qr', async (req, res) => {
    const { email, eventId, name, mssv } = req.body;

    if (!email || !eventId || !name) {
        return res.status(400).json({
            message: "Vui lòng nhập đầy đủ Họ tên, Email và EventId"
        });
    }

    try {
        let participants = [];
        if (fs.existsSync(participantsPath)) {
            const rawData = fs.readFileSync(participantsPath);
            participants = JSON.parse(rawData);
        }
        const isExist = participants.find(p => p.email === email && p.eventId === eventId);
        if (isExist) {
            return res.json({
                success: true,
                message: "Bạn đã đăng ký sự kiện này rồi!",
                qr: isExist.qrImage,
                code: isExist.ticketCode
            });
        }
        const ticketCode = `TIK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newParticipant = {
            id: Date.now().toString(),
            name,
            email,
            mssv: mssv || "N/A",
            eventId,
            ticketCode,
            checkedIn: false,
            createdAt: new Date().toISOString()
        };

        const qrImage = await QRCode.toDataURL(ticketCode);
        newParticipant.qrImage = qrImage; 
        participants.push(newParticipant);
        fs.writeFileSync(participantsPath, JSON.stringify(participants, null, 2));
        res.json({
            success: true,
            message: "Đăng ký thành công!",
            qr: qrImage,
            code: ticketCode
        });

    } catch (err) {
        console.error("Lỗi server:", err);
        res.status(500).json({
            message: "Lỗi hệ thống khi tạo vé"
        });
    }
});

module.exports = router;