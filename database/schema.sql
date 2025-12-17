CREATE DATABASE IF NOT EXISTS msingi_gym_local;
USE msingi_gym_local;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    membership_id VARCHAR(20) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    membership_type ENUM('standard', 'premium', 'vip') DEFAULT 'standard',
    mpesa_receipt VARCHAR(50),
    payment_date DATETIME,
    membership_start DATETIME,
    membership_end DATETIME,
    status ENUM('pending_payment', 'active', 'expired', 'cancelled') DEFAULT 'pending_payment',
    rfid_card VARCHAR(20),
    axtrax_user_id VARCHAR(50),
    payment_method ENUM('mpesa', 'cash', 'card') DEFAULT 'mpesa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_phone (phone),
    INDEX idx_membership_id (membership_id),
    INDEX idx_status (status),
    INDEX idx_membership_end (membership_end)
);

CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    membership_id VARCHAR(20) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    mpesa_receipt VARCHAR(50),
    phone VARCHAR(15) NOT NULL,
    transaction_date DATETIME,
    checkout_request_id VARCHAR(50),
    merchant_request_id VARCHAR(50),
    result_code INT,
    result_desc VARCHAR(255),
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_membership_id (membership_id),
    INDEX idx_phone (phone),
    INDEX idx_status (status)
);

-- Test data
INSERT INTO users (name, phone, membership_id, amount, status, membership_start, membership_end) VALUES
('Test User', '254712345678', 'GYM001A1B2C', 2.00, 'active', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY));