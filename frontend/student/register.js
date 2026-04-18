const API = "https://agile-clb-event-management-system.onrender.com";
const params = new URLSearchParams(window.location.search);
const eventId = params.get("eventId");

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function register() {
    const nameInput = document.getElementById("name");
    const mssvInput = document.getElementById("mssv");
    const emailInput = document.getElementById("email");
    
    const qrSection = document.getElementById("result-section");
    const formSection = document.getElementById("form-section"); 
    const img = document.getElementById("qr-img");
    const ticketCodeDisplay = document.getElementById("ticket-code");
    const msg = document.getElementById("msg");

    const name = nameInput?.value.trim();
    const mssv = mssvInput?.value.trim();
    const email = emailInput.value.trim();
    if (!name || !email) {
        showMessage("❌ Vui lòng nhập đầy đủ Họ tên và Email!", "error");
        return;
    }

    if (!validateEmail(email)) {
        showMessage("❌ Email không hợp lệ!", "error");
        return;
    }

    if (!eventId) {
        showMessage("❌ Lỗi: Không xác định được sự kiện tham gia!", "error");
        return;
    }

    try {
        showMessage("⏳ Đang xử lý đăng ký...", "info");

        const res = await fetch(API + "/generate-qr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name, 
                mssv: mssv || "N/A", 
                email, 
                eventId 
            })
        });

        const data = await res.json();

        if (data.success && data.qr) {
            img.src = data.qr;
            if (ticketCodeDisplay) ticketCodeDisplay.innerText = data.code;
            if (formSection) formSection.style.display = "none";
            if (qrSection) qrSection.style.display = "block";

            localStorage.setItem("myTicket", data.code);
            showMessage("🎉 Đăng ký thành công!", "success");

        } else {
            showMessage("❌ " + (data.message || "Đăng ký thất bại!"), "error");
        }

    } catch (err) {
        console.error("Fetch Error:", err);
        showMessage("❌ Lỗi kết nối server!", "error");
    }
}

function showMessage(text, type) {
    const msg = document.getElementById("msg");
    if (!msg) return;
    msg.innerText = text;
    msg.className = "alert alert-" + (type === "error" ? "danger" : type === "success" ? "success" : "info");
}
[document.getElementById("name"), document.getElementById("mssv"), document.getElementById("email")].forEach(el => {
    el?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") register();
    });
});

window.onload = () => {
    document.getElementById("name")?.focus();
};
