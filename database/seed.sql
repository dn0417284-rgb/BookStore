
-- customers
INSERT INTO customers 
(email, full_name, password, phone, address, account_status, warning_count) 
VALUES
('vana@gmail.com', 'Nguyễn Văn A', '123456', '0901111111', '123 Lê Lợi, Hà Nội', TRUE, 0),
('thib@gmail.com', 'Trần Thị B', '123456', '0902222222', '45 Nguyễn Huệ, TP.HCM', TRUE, 1),
('vanc@gmail.com', 'Lê Văn C', '123456', '0903333333', '78 Trần Phú, Đà Nẵng', TRUE, 0),
('thid@gmail.com', 'Phạm Thị D', '123456', '0904444444', '12 Hai Bà Trưng, Huế', FALSE, 3),
('vane@gmail.com', 'Hoàng Văn E', '123456', '0905555555', '56 Lý Thường Kiệt, Hải Phòng', TRUE, 0),
('lanf@gmail.com', '123456', 'Phạm Lan F', '0906666666', '89 Nguyễn Trãi, Hà Nội', TRUE, 2),
('minhg@gmail.com', 'Ngô Minh G', '123456', '0907777777', '34 Võ Văn Kiệt, TP.HCM', TRUE, 0),
('huongh@gmail.com', 'Đỗ Thị Hương H', '123456', '0908888888', '67 Bạch Đằng, Đà Nẵng', FALSE, 4),
('khoii@gmail.com', 'Phan Văn Khôi I', '123456', '0909999999', '22 Nguyễn Văn Linh, Cần Thơ', TRUE, 1),
('trangj@gmail.com', 'Nguyễn Thị Trang J', '123456', '0910000000', '11 Lê Duẩn, Nha Trang', TRUE, 0),

--products
INSERT INTO products (title, rating, sold, price, publisher, author, cover_type, description, image)
VALUES
('Clean Code', '4.9', 1200, 189000.00, 'NXB Trẻ', 'Robert C. Martin', 'Bìa mềm', 'Cuốn sách hướng dẫn viết code sạch và dễ bảo trì dành cho lập trình viên.', 'https://salt.tikicdn.com/cache/750x750/ts/product/75/6a/4d/9e2d5a55c8c7d42f20d67d7f9b56d9e2.jpg'),
('Atomic Habits', '4.8', 980, 145000.00, 'NXB Lao Động', 'James Clear', 'Bìa cứng', 'Sách phát triển bản thân giúp xây dựng thói quen tích cực mỗi ngày.', 'https://salt.tikicdn.com/cache/750x750/ts/product/57/66/3b/7e98e65ce42928d0b9230e6505d1bd7d.jpg'),
('Lập Trình Java', '4.5', 430, 99000.00, 'NXB Giáo Dục', 'Nguyễn Văn A', 'Bìa mềm', 'Tài liệu học Java từ cơ bản đến nâng cao cho sinh viên CNTT.', 'https://salt.tikicdn.com/cache/750x750/ts/product/13/7c/6d/1d2f4cfe4cb8c00b9f44b84cb68a4e58.jpg'),
('Design Patterns', '4.7', 760, 210000.00, 'NXB Công Nghệ', 'Erich Gamma', 'Bìa cứng', 'Cuốn sách kinh điển về các mẫu thiết kế phần mềm phổ biến.', 'https://salt.tikicdn.com/cache/750x750/ts/product/2e/52/9f/37df7f59b4cb84ce8b063a492819e939.jpg'),
('Deep Work', '4.6', 620, 159000.00, 'NXB Thanh Niên', 'Cal Newport', 'Bìa mềm', 'Giúp nâng cao khả năng tập trung và hiệu suất làm việc sâu.', 'https://salt.tikicdn.com/cache/750x750/ts/product/5c/2d/54/f7a98e0fca7a91ac2f3f3dbfc0a76cc1.jpg'),
('Refactoring', '4.9', 550, 250000.00, 'NXB CNTT', 'Martin Fowler', 'Bìa cứng', 'Hướng dẫn cải tiến cấu trúc code mà không làm thay đổi chức năng.', 'https://salt.tikicdn.com/cache/750x750/ts/product/f5/0d/57/d08b1f2f1fc64989d4804040d3ba9390.jpg'),
('The Pragmatic Programmer', '4.8', 870, 199000.00, 'NXB Công Nghệ', 'Andrew Hunt & David Thomas', 'Bìa mềm', 'Cuốn sách kinh điển về tư duy và kỹ năng lập trình.', 'https://example.com/pragmatic.jpg'),
('Introduction to Algorithms', '4.7', 1100, 320000.00, 'NXB Giáo Dục', 'Thomas H. Cormen', 'Bìa cứng', 'Sách thuật toán nổi tiếng, thường gọi là CLRS.', 'https://example.com/algorithms.jpg'),
('Effective Java', '4.8', 900, 220000.00, 'NXB CNTT', 'Joshua Bloch', 'Bìa cứng', 'Hướng dẫn viết Java hiệu quả với best practices.', 'https://example.com/effectivejava.jpg'),
('You Don’t Know JS', '4.6', 750, 180000.00, 'NXB CNTT', 'Kyle Simpson', 'Bìa mềm', 'Bộ sách chuyên sâu về JavaScript.', 'https://example.com/ydkjs.jpg');
