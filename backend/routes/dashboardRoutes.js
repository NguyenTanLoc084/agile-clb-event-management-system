// ===== SCRUM-19: DASHBOARD STATS (CONNECTED) =====

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const EVENTS_FILE = path.join(__dirname, '../data/events.json');
const PARTICIPANTS_FILE = path.join(__dirname, '../data/participants.json');
const STUDENTS_FILE = path.join(__dirname, '../data/students.json'); 

function read(file) {
    try {
        if (!fs.existsSync(file)) return [];
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error(`Lỗi đọc file ${file}:`, err);
        return [];
    }
}

router.get('/dashboard-stats', (req, res) => {
    const events = read(EVENTS_FILE);
    const participants = read(PARTICIPANTS_FILE);
    const students = read(STUDENTS_FILE);

    const totalEvents = events.length;
    const totalParticipants = participants.length;
    const totalCheckedIn = participants.filter(p => p.checkedIn === true).length;

    const attendanceRate = totalParticipants > 0 
        ? ((totalCheckedIn / totalParticipants) * 100).toFixed(1) 
        : 0;

    res.json({
        success: true,
        totalEvents,          
        totalParticipants,   
        totalCheckedIn,     
        totalStudents: students.length,
        attendanceRate      
    });
});

module.exports = router;