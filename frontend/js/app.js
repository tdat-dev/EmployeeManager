import {navigateTo} from "./router.js";

// Lấy các element mà app.js cần (chỉ là các nút menu)
const menuItems = document.querySelectorAll(".menu-item[data-route]");

// Attach Event Listener to all menu items
menuItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        const route = item.dataset.route;
        navigateTo(route);
    });
});

navigateTo("dashboard");
console.log("app.js đã khởi động và lắng nghe sự kiện!");
