// ===== SCRUM-15: CREATE EVENT =====

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const FILE_PATH = path.join(__dirname, '../data/events.json');

function readData() {
    try {
        if (!fs.existsSync(FILE_PATH)) return [];
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) { return []; }
}

function writeData(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
    const events = readData();
    res.json(events);
});
router.post('/', (req, res) => {
    const events = readData();
    const { name, time, endTime, location, description } = req.body;

    if (!name || !time || !endTime) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin thời gian bắt đầu hoặc kết thúc!" });
    }

    const newEvent = {
        id: Date.now().toString(),
        name: name,
        time: time,        
        endTime: endTime,  
        location: location,
        description: description,
        isHidden: false
    };

    events.push(newEvent);
    writeData(events);

    res.json({
        success: true,
        message: "Tạo sự kiện thành công",
        event: newEvent
    });
});

router.put('/:id', (req, res) => {
    let events = readData();
    events = events.map(e =>
        e.id === req.params.id ? { ...e, ...req.body } : e
    );
    writeData(events);
    res.json({ success: true });
});

router.delete('/:id', (req, res) => {
    let events = readData();
    events = events.filter(e => e.id !== req.params.id);
    writeData(events);
    res.json({ success: true });
});

router.put('/:id/toggle-hide', (req, res) => {
    let events = readData();
    events = events.map(e =>
        e.id === req.params.id ? { ...e, isHidden: !e.isHidden } : e
    );
    writeData(events);
    res.json({ success: true });
});

module.exports = router;