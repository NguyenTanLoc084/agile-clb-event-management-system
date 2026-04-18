const API = "https://agile-clb-event-management-system.onrender.com";

let events = [];

async function loadEvents() {
    try {
        console.log("🚀 Loading events...");

        const res = await fetch(API + "/events");
        events = await res.json();

        console.log("📦 DATA:", events);

        renderEvents(events);

    } catch (err) {
        console.error("❌ Lỗi load events:", err);

        const container = document.getElementById("eventList");
        if (container) {
            container.innerHTML = "❌ Không load được dữ liệu";
        }
    }
}

function renderEvents(data) {
    const container = document.getElementById("eventList");

    if (!container) {
        console.error("❌ Không tìm thấy #eventList");
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <h5>Hiện chưa có sự kiện nào</h5>
            </div>
        `;
        return;
    }

    container.innerHTML = data.map(e => `
        <div class="col-md-4">
            <div class="card mb-3 p-3 shadow-sm">

                <h5 class="text-primary fw-bold">${e.name}</h5>

                <p>📍 ${e.location || "Chưa cập nhật"}</p>
                <p>⏱ ${formatTime(e.time)}</p>

                <button class="btn btn-primary w-100"
                    onclick="goRegister('${e.id}')">
                    Đăng ký
                </button>

            </div>
        </div>
    `).join('');
}

function formatTime(time) {
    if (!time) return "Chưa cập nhật";
    return new Date(time).toLocaleString("vi-VN");
}

function goRegister(eventId) {
    window.location.href = `register.html?eventId=${eventId}`;
}

function searchEvents() {
    const keyword = document.getElementById("search")?.value.toLowerCase();

    if (!keyword) {
        renderEvents(events);
        return;
    }

    const filtered = events.filter(e =>
        e.name.toLowerCase().includes(keyword) ||
        (e.location && e.location.toLowerCase().includes(keyword))
    );

    renderEvents(filtered);
}

document.getElementById("search")?.addEventListener("input", searchEvents);

window.onload = loadEvents;
