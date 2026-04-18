function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    return regex.test(password);
}

function isValidPhone(phone) {
    const regex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    return regex.test(phone);
}

function isValidName(name) {
    const regex = /^[a-zA-ZÀ-ỹ\s]+$/;
    return regex.test(name);
}
function isValidEventName(name) {
    return name.trim().length >= 3;
}
function isNotEmpty(value) {
    return value && value.trim() !== "";
}