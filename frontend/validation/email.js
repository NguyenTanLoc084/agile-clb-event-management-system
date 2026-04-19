const API = "/api";
async function sendEmail(email, qrCode) {
    try {
        const res = await fetch(API + "/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                qr: qrCode
            })
        });

        const data = await res.json();

        if (data.success) {
            showMessage("📧 Đã gửi QR qua email!", "success");
        } else {
            showMessage("❌ Gửi email thất bại!", "error");
        }

    } catch (err) {
        showMessage("❌ Không kết nối được server!", "error");
    }
}
function showMessage(text, type) {
    const msg = document.getElementById("msg");
    if (!msg) return;

    msg.innerText = text;
    msg.className = type;
}
