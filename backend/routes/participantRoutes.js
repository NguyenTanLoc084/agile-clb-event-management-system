// ===== SCRUM-29: PARTICIPANTS LIST =====

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const FILE_PATH = path.join(__dirname, '../data/participants.json');
function readData() {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch {
        return [];
    }
}
router.get('/participants', (req, res) => {
    const participants = readData();

    const { event } = req.query;
    if (event) {
        const filtered = participants.filter(p => p.event === event);
        return res.json(filtered);
    }

    res.json(participants);
});

module.exports = router;