const API_BASE = "http://localhost:3000/api";
const params = new URLSearchParams(window.location.search);
const eventId = params.get("eventId");

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(text, type) {
    const msg = document.getElementById("msg");
    if (msg) msg.innerHTML = `<div class="alert alert-${type} py-2">${text}</div>`;
}

async function register(e) {
    // 1. Chặn đứng hành động Reload trang ngay lập tức
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const btn = document.getElementById("btn-submit");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const mssvInput = document.getElementById("mssv");

    if (!nameInput || !emailInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const mssv = mssvInput ? mssvInput.value.trim() : "N/A";

    if (!name || !email || !eventId) {
        alert("Vui lòng nhập đủ thông tin và chọn sự kiện!");
        return false;
    }

    try {
        // 2. Trạng thái đang xử lý
        btn.disabled = true;
        btn.innerText = "⏳ Đang xử lý...";
        showMessage("Đang gửi thông tin...", "info");

        const res = await fetch(`${API_BASE}/qr/generate-qr`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, mssv, email, eventId })
        });

        const data = await res.json();

        if (data.success) {
            // 3. HIỂN THỊ VÉ (Khóa chặt giao diện)
            const qrImg = document.getElementById("qr-img") || document.getElementById("img");
            const ticketCode = document.getElementById("ticket-code");
            const resultSection = document.getElementById("result-section") || document.getElementById("qr-result");
            const formSection = document.getElementById("form-section");
            const qrActions = document.getElementById("qr-actions");
            const placeholder = document.getElementById("placeholder");

            if (qrImg) qrImg.src = data.qr;
            if (ticketCode) ticketCode.innerText = data.code;

            if (formSection) formSection.style.setProperty("display", "none", "important");
            
            if (resultSection) {
                resultSection.style.setProperty("display", "block", "important");
                resultSection.classList.remove("d-none");
                resultSection.scrollIntoView({ behavior: 'smooth' });
            }

            if (qrActions) qrActions.classList.remove("d-none");
            if (placeholder) placeholder.style.display = "none";

            const downloadBtn = document.getElementById("download-btn");
            if (downloadBtn) {
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = data.qr;
                    link.download = `Ticket_${data.code}.png`;
                    link.click();
                };
            }
            
            showMessage("🎉 Đăng ký thành công!", "success");
            console.log("Vé đã hiển thị cố định.");
        } else {
            showMessage("❌ " + (data.message || "Đăng ký thất bại"), "danger");
        }
    } catch (err) {
        console.error("Lỗi script:", err);
        showMessage("❌ Lỗi kết nối máy chủ!", "danger");
    } finally {
        btn.disabled = false;
        btn.innerText = "ĐĂNG KÝ & NHẬN VÉ";
    }
    return false;
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            register(e); 
        }
    });
});