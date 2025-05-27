# 🎬 Website Bán Vé Xem Phim

Đây là một website đặt vé xem phim hiện đại, được xây dựng với **Next.js**, **Tailwind CSS**, **Prisma**, **NextAuth** và nhiều thư viện mạnh mẽ khác. Ứng dụng cho phép người dùng duyệt phim, chọn suất chiếu, chọn ghế và đặt vé một cách nhanh chóng, mượt mà và thân thiện với thiết bị di động.

---

## 🚀 Tính năng nổi bật

- 🔐 Đăng nhập bằng tài khoản hoặc Google (NextAuth)
- 🗓️ Quản lý suất chiếu, loại ghế, giá vé
- 🎟️ Đặt vé theo thời gian thực với Pusher
- 🪑 Lựa chọn ghế trực quan
- 📅 Chọn ngày giờ bằng giao diện hiện đại
- 🖼️ Tải ảnh qua Cloudinary, tối ưu hình ảnh
- 💬 Viết bài đánh giá bằng trình soạn thảo Tiptap
- 🔄 Tự động hủy đơn đặt vé quá hạn với Redis + BullMQ
- 📱 Giao diện responsive, tối ưu cho thiết bị di động

---

## 🛠️ Công nghệ sử dụng

| Công nghệ          | Mô tả                                              |
|--------------------|----------------------------------------------------|
| **Next.js**        | Framework React hỗ trợ SSR, routing                |
| **Tailwind CSS**   | Thư viện CSS utility hiện đại                      |
| **Prisma**         | ORM kết nối cơ sở dữ liệu                           |
| **NextAuth**       | Xác thực người dùng và quản lý phiên đăng nhập     |
| **BullMQ + Redis** | Xử lý hàng đợi, tự động hủy vé                     |
| **Cloudinary**     | Quản lý và tối ưu hình ảnh                          |
| **Zod + RHF**      | Xử lý form và xác thực dữ liệu                     |
| **Pusher**         | Truyền dữ liệu thời gian thực (chọn ghế)           |
| **Tiptap**         | Trình soạn thảo văn bản phong phú                   |

---

## 📦 Thư viện chính đã cài đặt

> Xem đầy đủ tại `package.json`. Một số thư viện nổi bật gồm:

- **UI & Styling**: `tailwindcss`, `clsx`, `lucide-react`, `tw-animate-css`
- **Forms**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Xác thực**: `next-auth`, `@auth/prisma-adapter`
- **Quản lý trạng thái**: `jotai`
- **Trình soạn thảo**: `@tiptap/*`
- **Carousel**: `embla-carousel-react`, `embla-carousel-autoplay`
- **Thời gian**: `date-fns`, `moment`, `react-day-picker`
- **Khác**: `cloudinary`, `uuid`, `qs`, `remove-accents`, `reading-time`

---

## 🗂️ Cấu trúc thư mục

💳 Tích hợp thanh toán
Tài khoản Test thanh toán:Ngân hàng NCB Số thẻ: 9704198526191432198; Tên chủ thẻ: NGUYEN VAN A; Ngày phát hành: 07/15; Mật khẩu OTP: 123456