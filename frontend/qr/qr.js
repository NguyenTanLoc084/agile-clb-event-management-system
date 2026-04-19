const API = "/api";
const params = new URLSearchParams(window.location.search);
const eventId = params.get("eventId"); 

async function generateQR(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const emailInput = document.getElementById("email");
    const nameInput = document.getElementById("name");
    const mssvInput = document.getElementById("mssv");
    const msg = document.getElementById("msg");
    const img = document.getElementById("img");
    const ticketCodeDisplay = document.getElementById("ticket-code");
    const qrResult = document.getElementById("qr-result");
    const qrActions = document.getElementById("qr-actions");
    const placeholder = document.getElementById("placeholder");
    const formSection = document.getElementById("form-section");

    const email = emailInput?.value.trim();
    const name = nameInput?.value.trim() || "Sinh viên";
    const mssv = mssvInput?.value.trim() || "N/A";

    if (!email || !eventId) {
        alert("❌ Thiếu email hoặc thông tin sự kiện!");
        return false;
    }

    try {
        const res = await fetch(API + "/qr/generate-qr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, mssv, email, eventId })
        });

        const data = await res.json();

        if (data.success && data.qr) {
            img.src = data.qr;
            ticketCodeDisplay.innerText = data.code;
            if (placeholder) placeholder.style.display = "none";
            qrResult.classList.remove("d-none");
            qrActions.classList.remove("d-none");
            qrResult.scrollIntoView({ behavior: 'smooth' });
            document.getElementById("download-btn").onclick = () => {
                const link = document.createElement('a');
                link.href = data.qr;
                link.download = `Ve_${data.code}.png`;
                link.click();
            };

            console.log("✅ Vé đã hiển thị thành công!");
        } else {
            alert("❌ " + (data.message || "Không tạo được QR!"));
        }

    } catch (err) {
        console.error("Fetch Error:", err);
        alert("❌ Lỗi kết nối server!");
    }
    return false;
}

function copyCode() {
    const code = document.getElementById("ticket-code").innerText;
    navigator.clipboard.writeText(code).then(() => {
        alert("Đã sao chép: " + code);
    });
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") generateQR(e);
    });
});
