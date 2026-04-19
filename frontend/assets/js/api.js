const API_URL = "/api";

async function request(endpoint, method = "GET", body = null) {
    try {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const res = await fetch(API_URL + endpoint, options);
        return await res.json();

    } catch (err) {
        console.error("API error:", err);
        return { error: "Không kết nối được server" };
    }
}

export const loginAPI = (data) => request("/login", "POST", data);

export const changePasswordAPI = (data) =>
    request("/change-password", "POST", data);

export const getEvents = () => request("/events");

export const createEventAPI = (data) =>
    request("/events", "POST", data);

export const deleteEventAPI = (id) =>
    request(`/events/${id}`, "DELETE");

export const toggleEventAPI = (id) =>
    request(`/events/${id}/toggle-hide`, "PUT");

export const updateEventAPI = (id, data) =>
    request(`/events/${id}`, "PUT", data);

export const getParticipants = () =>
    request("/participants");

export const getStudents = () =>
    request("/students");

export const toggleStudentCheckin = (id) =>
    request(`/students/${id}/checkin`, "PUT");

export const generateQR = (data) =>
    request("/generate-qr", "POST", data);


export const checkTicket = (data) =>
    request("/check-ticket", "POST", data);

export const getDashboardStats = () =>
    request("/dashboard-stats");
