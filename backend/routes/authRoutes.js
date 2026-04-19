const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const router = express.Router();
const SECRET_KEY = "secret_key";
const ADMIN_FILE = path.join(__dirname, '../data/admins.json');

function readAdmins() {
    try {
        if (!fs.existsSync(ADMIN_FILE)) return [];
        const data = fs.readFileSync(ADMIN_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error("Lỗi đọc file admin:", err);
        return [];
    }
}

function writeAdmins(data) {
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(data, null, 2));
}
let otpStore = {}; 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'agileteam782@gmail.com', 
        pass: 'ljey prco vfgm uflo'          
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const admins = readAdmins();
    const admin = admins.find(a => a.username === username && a.password === password);

    if (admin) {
        const token = jwt.sign(
            { username: admin.username, role: admin.role },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        return res.json({ success: true, message: "Đăng nhập thành công", token });
    }
    res.status(401).json({ success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
});
router.get('/verify-token', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ success: false, message: "Token hết hạn" });
        res.json({ success: true, user: decoded });
    });
});
router.post('/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body; 
    let admins = readAdmins();
    const adminIndex = admins.findIndex(a => a.username === username);

    if (adminIndex === -1) return res.status(404).json({ error: "Không tìm thấy tài khoản" });
    if (admins[adminIndex].password !== oldPassword) return res.status(400).json({ error: "Mật khẩu cũ không đúng" });
    if (newPassword.length < 6) return res.status(400).json({ error: "Mật khẩu mới phải từ 6 ký tự trở lên" });

    admins[adminIndex].password = newPassword;
    writeAdmins(admins);
    res.json({ success: true, message: "Mật khẩu đã được cập nhật" });
});
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const admins = readAdmins();
    const admin = admins.find(a => a.email === email);

    if (!admin) return res.status(404).json({ message: "Email không tồn tại trên hệ thống!" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; 

    try {
        await transporter.sendMail({
            from: '"Hệ thống Sự kiện ✨" <noreply@eventsystem.com>',
            to: email,
            subject: "Mã OTP khôi phục mật khẩu",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4e73df;">Yêu cầu khôi phục mật khẩu</h2>
                    <p>Mã xác thực của bạn là: <b style="font-size: 24px; color: #e03131;">${otp}</b></p>
                    <p style="color: #666; font-size: 12px;">Mã này sẽ hết hạn sau 5 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>
                </div>
            `
        });
        res.json({ success: true });
    } catch (err) {
        console.error("Gửi mail thất bại:", err);
        res.status(500).json({ message: "Không thể gửi email!" });
    }
});
router.post('/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    const record = otpStore[email];

    if (!record || record.otp !== otp || Date.now() > record.expires) {
        return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn!" });
    }

    let admins = readAdmins();
    const index = admins.findIndex(a => a.email === email);
    
    if (index !== -1) {
        admins[index].password = newPassword; 
        writeAdmins(admins); 
        delete otpStore[email]; 
        res.json({ success: true });
    } else {
        res.status(404).json({ message: "Lỗi hệ thống!" });
    }
});

module.exports = router;