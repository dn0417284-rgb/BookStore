-- Customers table (nguoi_dung)
CREATE TABLE customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
   password VARCHAR(255) NOT NULL,
  phone VARCHAR(45),
  address VARCHAR(255),
  account_status BOOLEAN DEFAULT TRUE,
  warning_count INT DEFAULT 0
);

-- Books information (thong_tin_sach)
CREATE TABLE books (
  book_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  rating VARCHAR(50),
  sold INT DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  publisher VARCHAR(255),
  author VARCHAR(255),
  cover_type VARCHAR(100),
  description MEDIUMTEXT,
  image VARCHAR(255)
);

-- Cart (gio_hang)
CREATE TABLE cart (
  customer_id INT,
  book_id INT,
  quantity INT DEFAULT 1,
  PRIMARY KEY (customer_id, book_id),
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (book_id) REFERENCES books(book_id)
);

-- Payment (thanh_toan)
CREATE TABLE payments (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  receiver_name VARCHAR(255),
  receiver_phone VARCHAR(45),
  receiver_address VARCHAR(255),
  book_title VARCHAR(255),
  quantity INT,
  total_amount DECIMAL(15,2),
  payment_method VARCHAR(100),
  bill_image VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admin (admin)
CREATE TABLE admin (
  admin_id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL
);
