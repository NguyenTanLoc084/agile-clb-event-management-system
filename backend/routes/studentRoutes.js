// ===== SCRUM-31: STUDENT CHECK-IN (ADMIN TOGGLE) =====

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const FILE_PATH = path.join(__dirname, '../data/students.json');

function readData() {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        return JSON.parse(data || '[]');
    } catch {
        return [];
    }
}

function writeData(data) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
}

router.get('/students', (req, res) => {
    const students = readData();
    res.json(students);
});

router.put('/students/:id/checkin', (req, res) => {
    let students = readData();

    const index = students.findIndex(s => s.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "Không tìm thấy sinh viên"
        });
    }
    students[index].isAttended = !students[index].isAttended;

    writeData(students);

    res.json({
        success: true,
        student: students[index]
    });
});

module.exports = router;