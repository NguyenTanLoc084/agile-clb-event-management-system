// ===== CHECKIN.JS (OPTIMIZED) =====

const API = "/api";

async function check() {
    const input = document.getElementById("code");
    const msg = document.getElementById("msg");
    const btn = document.getElementById("btn-check"); 

    const code = input.value.trim();
    msg.className = ""; 
    msg.innerText = "Đang kiểm tra...";
    msg.style.display = "block";
    if (!code) {
        showResponse(msg, "❌ Vui lòng nhập mã hoặc quét QR!", "msg-error");
        return;
    }

    try {
        if (btn) btn.disabled = true;

        const res = await fetch(`${API}/check-ticket`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
        });

        const data = await res.json();
        const responseMsg = data.message || data.error || "Có lỗi xảy ra!";
        if (res.ok && (responseMsg.toLowerCase().includes("thành công") || responseMsg.toLowerCase().includes("ok"))) {
            showResponse(msg, `✅ ${responseMsg}`, "msg-success");
            input.value = ""; 
        } 
        else if (responseMsg.includes("Đã") || responseMsg.includes("từng")) {
            showResponse(msg, `⚠️ ${responseMsg}`, "msg-error"); 
        } 
        else {
            showResponse(msg, `❌ ${responseMsg}`, "msg-error");
        }

    } catch (err) {
        console.error("Fetch error:", err);
        showResponse(msg, "❌ Không kết nối được server!", "msg-error");
    } finally {
        if (btn) btn.disabled = false;
        input.focus();
    }
}

function showResponse(element, text, className) {
    element.innerText = text;
    element.className = className;
}
document.getElementById("code")?.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        check();
    }
});
