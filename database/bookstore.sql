CREATE DATABASE bookstore
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE bookstore;

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(45),
    address VARCHAR(255),
    account_status BOOLEAN DEFAULT TRUE,
    warning_count INT DEFAULT 0,
    role ENUM('user','admin') NOT NULL DEFAULT 'user'
);

CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    rating VARCHAR(50),
    sold INT DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    publisher VARCHAR(255),
    author VARCHAR(255),
    cover_type VARCHAR(100),
    description MEDIUMTEXT,
    image VARCHAR(255),
    stock INT DEFAULT 0
);

CREATE TABLE shippers (
    shipper_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    vehicle VARCHAR(100),
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE customer_addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,

    customer_id INT NOT NULL,

    receiver_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,

    province VARCHAR(100),
    district VARCHAR(100),
    ward VARCHAR(100),

    address_detail TEXT NOT NULL,

    is_default BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
);

CREATE TABLE cart (
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,

    PRIMARY KEY (customer_id, product_id),

    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id),

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,

    customer_id INT,

    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),

    address TEXT NOT NULL,
    note TEXT,

    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,

    status ENUM(
        'PENDING',
        'CONFIRMED',
        'PACKING',
        'SHIPPING',
        'DELIVERED',
        'RECEIVED',
        'FAILED',
        'CANCELLED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    payment_method ENUM(
        'COD',
        'MOMO'
    ) DEFAULT 'COD',

    payment_status ENUM(
        'UNPAID',
        'PAID',
        'REFUNDED'
    ) DEFAULT 'UNPAID',

    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    expected_delivery_date DATETIME,
    delivered_at DATETIME,
    confirmed_received_at DATETIME,

    shipper_name VARCHAR(255),
    shipper_phone VARCHAR(20),

    tracking_code VARCHAR(100),

    shipper_id INT,

    momo_order_id VARCHAR(255),
    momo_transaction_id VARCHAR(255),

    payment_time DATETIME,

    cancel_reason TEXT,
    failed_reason TEXT,

    order_code VARCHAR(50),

    address_id INT,

    FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE SET NULL,

    FOREIGN KEY (shipper_id)
        REFERENCES shippers(shipper_id)
);

CREATE TABLE order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,

    order_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity INT NOT NULL,

    price DECIMAL(12,2) NOT NULL,

    title VARCHAR(255),
    author VARCHAR(255),
    image VARCHAR(255),

    subtotal DECIMAL(12,2),

    reviewed BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE
);

CREATE TABLE order_status_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,

    order_id INT NOT NULL,

    status VARCHAR(50) NOT NULL,

    note TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
);

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

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    order_id INT,

    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
);
