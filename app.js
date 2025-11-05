// import { AuthModule } from "./modules/";
// import { EmployeeDb } from "./modules";

const viewEl = document.getElementById("view");
const pageTitleEl = document.getElementById("pageTitle");
const logoutBtn = document.getElementById("logoutBtn");

const routes = {
  dashboard: () => {
    pageTitleEl.textContent = "Dashboard";
    viewEl.innerHTML = "<h2>Chào mừng đến với HRM System</h2>";
  },

  "employees-add": () => {
    pageTitleEl.textContent = "Thêm nhân viên";
    viewEl.innerHTML = `
            <div class="card">
                <h3>Form thêm nhân viên</h3>
                <form id="addForm">
                    <label>Tên:</label>
                    <input id="name" required />
                    
                    <label>Email:</label>
                    <input id="email" type="email" required />
                    
                    <button type="submit" class="primary">Thêm</button>
                </form>
            </div>
    `;

    document
      .getElementById("addForm")
      .addEventListener("submit", (eventSubmit) => {
        eventSubmit.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        console.log("Thêm: ", { name, email });
      });
  },
};

function navigate(route) {
  const fn = routes[route] || routes.dashboard;
  fn();
  setActive(route);
}

function setActive(route) {
  document.querySelectorAll(".menu [data-route]").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-route") === route);
  });
}

function registerMenuHandles() {
  document.querySelectorAll(".menu [data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigate(btn.getAttribute("data-route"));
    });
  });
}

function init() {
  registerMenuHandles();
  navigate("dashboard");
}

init();
