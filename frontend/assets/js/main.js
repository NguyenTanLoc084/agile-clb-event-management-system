function loadComponent(id, path) {
    fetch(path)
        .then(res => res.text())
        .then(data => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = data;
        })
        .catch(err => console.error("❌ Load lỗi:", err));
}
loadComponent("navbar", "/components/navbar.html");
loadComponent("sidebar", "/components/sidebar.html");
