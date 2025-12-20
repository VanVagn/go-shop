CREATE TABLE products (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          price DECIMAL(10,2) NOT NULL,
                          image_url VARCHAR(500),
                          description TEXT,
                          stock_quantity INTEGER DEFAULT 0
);

CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL
);