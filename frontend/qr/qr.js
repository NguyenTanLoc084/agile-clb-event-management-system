const API = "http://localhost:3000/api";
async function generateQR() {
    const emailInput = document.getElementById("email");
    const eventInput = document.getElementById("eventId");
    const img = document.getElementById("qrImage");
    const msg = document.getElementById("msg");

    const email = emailInput?.value.trim();
    const eventId = eventInput?.value.trim();
    if (msg) {
        msg.innerText = "";
        msg.className = "";
    }
    if (!email || !eventId) {
        showMessage("❌ Thiếu email hoặc event!", "error");
        return;
    }

    if (!validateEmail(email)) {
        showMessage("❌ Email không hợp lệ!", "error");
        return;
    }

    try {
        const res = await fetch(API + "/generate-qr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, eventId })
        });

        const data = await res.json();

        if (data.qr) {
            img.src = data.qr;
            showMessage("✅ Tạo QR thành công!", "success");
            localStorage.setItem("lastQR", data.code);
        } else {
            showMessage("❌ Không tạo được QR!", "error");
        }

    } catch (err) {
        showMessage("❌ Lỗi kết nối server!", "error");
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(text, type) {
    const msg = document.getElementById("msg");
    if (!msg) return;

    msg.innerText = text;
    msg.className = type;
}
document.getElementById("email")?.addEventListener("keypress", function(e) {
    if (e.key === "Enter") generateQR();
});

document.getElementById("eventId")?.addEventListener("keypress", function(e) {
    if (e.key === "Enter") generateQR();
});