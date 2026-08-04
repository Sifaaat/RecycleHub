-- ==========================================
-- RecycleHub Database
-- ==========================================

CREATE DATABASE recyclehub;

-- PostgreSQL-এ database create করার পর
-- recyclehub database select করে নিচের table গুলো run করবে।

-- ==========================================
-- USERS TABLE
-- ==========================================

CREATE TABLE users (

    id SERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    phone VARCHAR(20) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(20) DEFAULT 'user',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- ==========================================
-- PRODUCTS TABLE
-- ==========================================

CREATE TABLE products (

    id SERIAL PRIMARY KEY,

    product_name VARCHAR(150) NOT NULL,

    category VARCHAR(50) NOT NULL,

    price DECIMAL(10,2) NOT NULL,

    quantity INT NOT NULL,

    location VARCHAR(100),

    description TEXT,

    image VARCHAR(255),

    user_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);

-- ==========================================
-- CONTACT TABLE
-- ==========================================

CREATE TABLE contacts (

    id SERIAL PRIMARY KEY,

    full_name VARCHAR(100),

    email VARCHAR(100),

    subject VARCHAR(150),

    message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);