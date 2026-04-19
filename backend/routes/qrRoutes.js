const express = require('express');
const router = express.Router();

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const participantsPath = path.join(__dirname, '../data/participants.json');

router.post('/generate-qr', async (req, res) => {
    const { email, eventId, name, mssv } = req.body;

    if (!email || !eventId || !name || !mssv) {
        return res.status(400).json({
            success: false,
            message: "Vui lòng nhập đầy đủ thông tin!"
        });
    }

    try {
        let participants = [];

        if (fs.existsSync(participantsPath)) {
            const rawData = fs.readFileSync(participantsPath);
            participants = JSON.parse(rawData);
        }
        const normalizedEmail = email.toLowerCase().trim();
        const normalizedMssv = String(mssv).trim();
        const emailExist = participants.find(
            p => p.email.toLowerCase().trim() === normalizedEmail
            && p.eventId === eventId
        );

        if (emailExist) {
            return res.status(400).json({
                success: false,
                message: "Email đã đăng ký sự kiện này!"
            });
        }
        const mssvExist = participants.find(
            p => String(p.mssv).trim() === normalizedMssv
            && p.eventId === eventId
        );

        if (mssvExist) {
            return res.status(400).json({
                success: false,
                message: "MSSV đã đăng ký sự kiện này!"
            });
        }
        const ticketCode = `TIK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newParticipant = {
            id: Date.now().toString(),
            name,
            email: normalizedEmail,
            mssv: normalizedMssv,
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
            success: false,
            message: "Lỗi hệ thống khi tạo vé"
        });
    }
});

module.exports = router;