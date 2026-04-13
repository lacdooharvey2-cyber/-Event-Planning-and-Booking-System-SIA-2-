-- Evora Events — reference schema for the Next.js app (MySQL / MariaDB, phpMyAdmin).
-- Run in phpMyAdmin on database `evora_events` if your tables are missing columns
-- or you are starting fresh. If you already have data, compare and ALTER instead of DROP.

SET NAMES utf8mb4;

-- ---------------------------------------------------------------------------
-- users (optional; app auth may still use localStorage — orders use string user_id)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('customer', 'venue_owner', 'service_provider', 'admin') NOT NULL DEFAULT 'customer',
  phone VARCHAR(50) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------------
-- themes & venue_themes (venue can have multiple themes; app uses first linked)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS themes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS venues (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(120) NULL,
  location VARCHAR(255) NULL,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  capacity INT UNSIGNED NOT NULL DEFAULT 0,
  image_url TEXT NULL,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
  reviews INT UNSIGNED NOT NULL DEFAULT 0,
  description TEXT NULL,
  amenities JSON NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS venue_themes (
  venue_id INT UNSIGNED NOT NULL,
  theme_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (venue_id, theme_id),
  CONSTRAINT fk_vt_venue FOREIGN KEY (venue_id) REFERENCES venues (id) ON DELETE CASCADE,
  CONSTRAINT fk_vt_theme FOREIGN KEY (theme_id) REFERENCES themes (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS services (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(120) NULL,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  description TEXT NULL,
  image_url TEXT NULL,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
  provider VARCHAR(255) NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------------
-- orders / order_items (bookings from checkout — user_id matches AuthContext string ids)
-- ---------------------------------------------------------------------------
  CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    event_date DATE NULL,
    guest_count INT UNSIGNED NOT NULL DEFAULT 0,
    location VARCHAR(500) NULL,
    customer_name VARCHAR(255) NULL,
    customer_email VARCHAR(255) NULL,
    customer_phone VARCHAR(100) NULL,
    payment_method VARCHAR(120) NULL,
    card_last4 VARCHAR(16) NULL,
    transaction_id VARCHAR(128) NULL,
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    KEY idx_orders_user (user_id),
    KEY idx_orders_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id VARCHAR(64) NOT NULL,
  item_type ENUM('venue', 'service') NOT NULL,
  catalog_id VARCHAR(64) NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  event_item_date DATE NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------------
-- payments (detailed payment tracking for orders)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(64) NOT NULL,
  order_id VARCHAR(64) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'PHP',
  payment_method ENUM('credit_card', 'debit_card', 'bank_transfer', 'cash', 'paypal', 'gcash', 'maya', 'other') NOT NULL,
  payment_gateway VARCHAR(50) NULL COMMENT 'e.g., stripe, paypal, paymongo',
  gateway_transaction_id VARCHAR(128) NULL,
  gateway_payment_id VARCHAR(128) NULL,
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'pending',
  card_brand VARCHAR(20) NULL COMMENT 'visa, mastercard, amex, etc.',
  card_last4 VARCHAR(4) NULL,
  card_country VARCHAR(2) NULL,
  failure_reason TEXT NULL,
  refunded_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  refund_reason TEXT NULL,
  metadata JSON NULL COMMENT 'Additional payment data from gateway',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  completed_at DATETIME NULL,
  PRIMARY KEY (id),
  KEY idx_payments_order (order_id),
  KEY idx_payments_status (status),
  KEY idx_payments_gateway (payment_gateway),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
