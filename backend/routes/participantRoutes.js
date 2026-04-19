// ===== SCRUM-29: PARTICIPANTS LIST =====

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PARTICIPANTS_FILE = path.join(__dirname, '../data/participants.json');

router.get('/', (req, res) => {
    try {
        if (!fs.existsSync(PARTICIPANTS_FILE)) {
            return res.json([]);
        }
        const data = fs.readFileSync(PARTICIPANTS_FILE, 'utf8');
        res.json(JSON.parse(data || '[]'));
    } catch (err) {
        res.status(500).json({ message: "Lỗi đọc dữ liệu" });
    }
});

module.exports = router;