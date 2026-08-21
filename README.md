# Kaminguyen Independent Website

Đây là website tĩnh độc lập, không cần tài khoản AI, gói thuê bao, cơ sở dữ liệu
hay hệ thống build riêng. Chỉ cần giữ nguyên thư mục này và tải toàn bộ lên một
dịch vụ static hosting là website hoạt động.

## Các tệp quan trọng

- `content.js`: thông tin họa sĩ, social media, email, giá commission, sự kiện
  và danh sách tác phẩm.
- `index.html`: cấu trúc và nội dung dự phòng của trang.
- `styles.css`: màu sắc, font, bố cục desktop/mobile và hiệu ứng.
- `app.js`: gallery, lightbox, menu mobile và các phần tự động.
- `assets/`: toàn bộ ảnh tác phẩm, avatar và ảnh thanh toán.

Tên tháng trong trạng thái nhận commission được lấy tự động theo múi giờ Việt
Nam trong `app.js`. Hai dòng August trong `content.js` và `index.html` chỉ là
nội dung dự phòng khi JavaScript chưa tải.

## Chỉnh nội dung

1. Mở `content.js` bằng VS Code, Notepad++ hoặc bất kỳ ứng dụng AI viết code nào.
2. Sửa nội dung nằm giữa dấu ngoặc kép.
3. Giữ nguyên dấu phẩy, dấu ngoặc và tên trường.
4. Lưu tệp rồi mở lại `index.html` để kiểm tra.

Để thêm tranh, chép ảnh vào `assets/art/` rồi thêm một mục vào mảng `artworks`
trong `content.js`. Có thể dùng cùng một ảnh cho `file` và `thumb`:

```js
{
  sourceIndex: 35,
  title: "Tên tác phẩm",
  category: "illustration",
  year: "2026",
  file: "assets/art/ten-anh.webp",
  thumb: "assets/art/ten-anh.webp",
  width: 1600,
  height: 1200,
},
```

Các category hợp lệ là `illustration`, `comics` và `design`.

## Dùng một ứng dụng AI khác để sửa

Gửi cả thư mục này cho ứng dụng đó và dùng yêu cầu mẫu:

> Hãy chỉnh website tĩnh trong thư mục này. Nội dung nằm trong content.js,
> giao diện nằm trong styles.css, tương tác nằm trong app.js. Giữ nguyên đường
> dẫn assets và không chuyển website sang framework khác nếu không cần thiết.

Sau khi AI sửa, chỉ cần thay các tệp đã sửa trên hosting. Không cần tài khoản AI
đã dùng để tạo phiên bản trước.

## Mở trên máy tính

Nhấp đúp `index.html`. Nếu trình duyệt hoặc ứng dụng chỉnh code yêu cầu web
server, dùng tính năng Live Server của trình soạn thảo và chọn thư mục này.

## Đưa lên hosting độc lập

Website tương thích với mọi dịch vụ static hosting thông thường.

- Build command: để trống.
- Publish/output directory: thư mục gốc (`.`).
- Tải lên toàn bộ `index.html`, `styles.css`, `app.js`, `content.js` và `assets/`.

Khi chuyển tên miền, giữ website cũ hoạt động cho đến khi hosting mới cung cấp
DNS record. Sau đó thay DNS cũ bằng record của hosting mới và chờ SSL chuyển
sang trạng thái active.

## Sao lưu và chuyển máy

Chỉ cần sao chép toàn bộ thư mục hoặc tệp ZIP đi kèm. Website không lưu dữ liệu
quan trọng ở tài khoản hoặc máy tính đã tạo ra nó.
