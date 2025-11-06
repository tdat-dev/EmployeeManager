// Lấy các element mà router cần
const view = document.getElementById("view");
const pageTitle = document.getElementById("pageTitle");
const menuItems = document.querySelectorAll(".menu-item[data-route]");

// Hàm chính để điều hướng
export function navigateTo(route) {
  // Check route running?
  console.log(`Đang điều hướng đến: ${route}`);

  // Cập nhật class 'active' cho menu
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });
  const activeItem = document.querySelector(
    `.menu-item[data-route="${route}"]`
  );
  if (activeItem) {
    activeItem.classList.add("active");
  }

  // Tải nội dung (View) dựa trên route
  switch (route) {
    case "dashboard":
      pageTitle.textContent = "Dashboard";
      view.innerHTML = `
    <div class = "card">
        <h2>Chào mừng đến với dashboard</h2>
        <p>Đây là trang tổng quan của hệ thống quản lý nhân sự</p>
    </div>
    `;
      break;

    case "employee-db":
      pageTitle.textContent = "Danh sách nhân viên";
      view.innerHTML = `
      <div class="card">
        <h2>Quản lý Nhân viên</h2>
        <p>Đây là nơi hiển thị bảng (table) danh sách nhân viên.</p>
      </div>
      `;
      break;
    case "employees-add":
      pageTitle.textContent = "Thêm nhân viên";
      view.innerHTML = `
        <div class="card">
            <h2>Thêm Nhân viên mới</h2>
            <p>Đây là nơi hiển thị form để thêm nhân viên.</p>
        </div>
            `;
      break;
    case "departments":
      pageTitle.textContent = "Quản lý Phòng ban";
      view.innerHTML = `
        <div class="card">
            <h2>Quản lý Phòng ban</h2>
            <p>Nội dung của module phòng ban.</p>
        </div>
            `;
      break;

    // If no matching route is found
    default:
      pageTitle.textContent = "Lỗi 404";
      view.innerHTML = `
        <div class="card">
            <h2>Trang không tìm thấy!</h2>
            <p>Route '${route}' không hợp lệ.</p>
        </div>
    `;
  }
}
