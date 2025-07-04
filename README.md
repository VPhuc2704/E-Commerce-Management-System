# E-Commerce Management System

## Giới thiệu
Dự án **E-Commerce Management System** là một hệ thống quản lý thương mại điện tử toàn diện, được xây dựng với mục tiêu cung cấp giải pháp quản lý bán hàng, đơn hàng, sản phẩm, khách hàng và phân tích kinh doanh cho doanh nghiệp vừa và nhỏ. Dự án được phát triển hoàn chỉnh cả Backend (BE) và Frontend (FE).

## Tính năng nổi bật
- Quản lý sản phẩm, danh mục
- Quản lý đơn hàng, trạng thái vận chuyển, thanh toán
- Quản lý người dùng, phân quyền (Admin, User)
- Dashboard phân tích doanh thu, sản phẩm bán chạy, báo cáo động
- Tìm kiếm, lọc, phân trang, xuất báo cáo CSV
- Thông báo trạng thái, xác thực bảo mật JWT
- UI hiện đại, responsive, tối ưu trải nghiệm người dùng

## Kiến trúc hệ thống
- **Backend:** Java Spring Boot, RESTful API, phân tầng rõ ràng (Controller, Service, Repository), ORM Hibernate, truy vấn qua JPARepository
- **Frontend:** ReactJS, phân tách component, sử dụng hooks, tối ưu hiệu năng
- **Database:** MySQL, thiết kế chuẩn hóa, tối ưu truy vấn, hỗ trợ mở rộng
- **Bảo mật:** Xác thực JWT, phân quyền, kiểm soát lỗi, chống tấn công phổ biến

## Công nghệ sử dụng
- **Backend:** Java 8, Spring Boot, Spring Data JPA (Hibernate), MySQL, Spring Security (JWT), Model Mapper, Maven
- **Frontend:** ReactJS, TailwindCSS, Chart.js, Fetch

## Hướng dẫn cài đặt & chạy thử
1. **Clone dự án:**
   ```bash
   git clone https://github.com/VPhuc2704/E-Commerce-Management-System.git
   cd E-Commerce-Management-System
   ```
2. **Cài đặt Backend (Java Spring Boot):**
   ```bash
   cd BE
   mvn clean install
   mvn spring-boot:run
   ```

3. **Cài đặt Frontend:**
   ```bash
   cd FE/my-app
   npm install
   npm start
   ```
4. **Cấu hình:**
   - Sửa file `application.properties`  cho BE (DB_URI, JWT_SECRET, PORT...)
   - FE cấu hình endpoint API nếu cần

## Điểm nhấn kỹ thuật & chất lượng
- **Kiến trúc rõ ràng, dễ mở rộng:** Áp dụng best practices, tách lớp, dễ bảo trì
- **Bảo mật:** Xác thực, phân quyền, kiểm soát lỗi, bảo vệ dữ liệu người dùng
- **Hiệu năng:** Tối ưu truy vấn, cache, phân trang, lazy loading
- **Code sạch, chuẩn hóa:** Theo chuẩn ESLint, Prettier, đặt tên rõ ràng, có comment giải thích
- **UI/UX hiện đại:** Responsive, hiệu ứng đẹp, trải nghiệm mượt mà
- **Tài liệu đầy đủ:** Hướng dẫn sử dụng, cấu trúc code, API docs (Swagger nếu có)
