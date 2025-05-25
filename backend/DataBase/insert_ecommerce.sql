Use use ecommerce_db;
CREATE TABLE role (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    fullname VARCHAR(255),
    numberphone VARCHAR(10),
    address VARCHAR(255)
);

CREATE TABLE user_role (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE category (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    description TEXT,
    price DOUBLE,
    quantity INT,
    image VARCHAR(255),
    type VARCHAR(255),
    status VARCHAR(50),
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    totalAmount DOUBLE,
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE payment (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    paymentmethod VARCHAR(255),
    amount DOUBLE,
    status VARCHAR(50),
    order_id BIGINT UNIQUE,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE orderitem (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT,
    product_id BIGINT,
    quantity INT,
    price DOUBLE,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE cartitem (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT,
    product_id BIGINT,
    quantity INT,
    price DOUBLE,
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE shippinginfo (
    id INT PRIMARY KEY AUTO_INCREMENT
);
-- RELATIONSHIP SQL FOR ENTITY TABLES

-- User - Role (ManyToMany)
ALTER TABLE user_role
    ADD CONSTRAINT fk_userrole_user FOREIGN KEY (user_id) REFERENCES user(id),
ADD CONSTRAINT fk_userrole_role FOREIGN KEY (role_id) REFERENCES role(id);

-- Product - Category (ManyToOne)
ALTER TABLE products
    ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES category(id);

-- Order - User (ManyToOne)
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES user(id);

-- Payment - Order (OneToOne)
ALTER TABLE payment
    ADD CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(id);

-- OrderItem - Order (ManyToOne)
ALTER TABLE orderitem
    ADD CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) REFERENCES orders(id);

-- OrderItem - Product (ManyToOne)
ALTER TABLE orderitem
    ADD CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) REFERENCES products(id);

-- Cart - User (ManyToOne)
ALTER TABLE cart
    ADD CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES user(id);

-- CartItem - Cart (ManyToOne)
ALTER TABLE cartitem
    ADD CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) REFERENCES cart(id);

-- CartItem - Product (ManyToOne)
ALTER TABLE cartitem
    ADD CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id) REFERENCES products(id);

