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

-- Insert roles
INSERT INTO role (name, code) VALUES
                                  ('ROLE_ADMIN', 'ADMIN'),
                                  ('ROLE_USER', 'USER');

-- Insert users (password: 123456 đã được mã hóa bằng BCrypt)
INSERT INTO user (email, password, fullname, numberphone, address, isverified) VALUES
    ('admin@gmail.com', '$2a$10$7UBKsdIhIJk/z.KbpsrQqe5IgbpF5dWfz0oU1yR2d4FHhzuwzAFd2', 'admin User', '0369852147', 'Đà Nẵng', 1);

-- Liên kết user với role
INSERT INTO user_role (user_id, role_id) VALUES
    (1, 1); -- admin@gmail.com -> ROLE_ADMIN



INSERT INTO category (id, name) VALUES (1, 'Khai Vị');
INSERT INTO category (id, name) VALUES (2, 'Món Chính');
INSERT INTO category (id, name) VALUES (3, 'Đồ Ăn Nhanh');
INSERT INTO category (id, name) VALUES (4, 'Đồ Nướng');
INSERT INTO category (id, name) VALUES (5, 'Món Chay');
INSERT INTO category (id, name) VALUES (6, 'Đồ Uống');
INSERT INTO category (id, name) VALUES (7, 'Tráng Miệng');


-- Khai Vị (category_id = 1)
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (1, 'Gỏi cuốn tươi ngon', 'Món khai vị nhẹ nhàng và ngon miệng', 25000, 100, '/img/goi_cuon_1.jpg', 'Khai Vị', 'Con_Hang', 1);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (2, 'Chả giò truyền thống', 'Chả giò giòn tan', 28000, 120, '/img/cha_gio_2.jpg', 'Khai Vị', 'Con_Hang', 1);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (3, 'Súp bí đỏ thơm ngon', 'Súp bí đỏ thơm mịn', 30000, 80, '/img/sup_3.jpg', 'Khai Vị', 'Con_Hang', 1);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (4, 'Salad trộn rau củ', 'Salad tươi mát', 27000, 90, '/img/salad_4.jpg', 'Khai Vị', 'Con_Hang', 1);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (5, 'Gỏi cuốn tôm thịt', 'Gỏi cuốn đậm đà', 26000, 100, '/img/goi_cuon_5.jpg', 'Khai Vị', 'Con_Hang', 1);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (6, 'Chả giò hải sản', 'Chả giò hải sản hấp dẫn', 32000, 110, '/img/cha_gio_6.jpg', 'Khai Vị', 'Con_Hang', 1);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (7, 'Súp gà thượng hạng', 'Súp gà ngon lành', 35000, 70, '/img/sup_7.jpg', 'Khai Vị', 'Con_Hang', 1);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (8, 'Salad cá ngừ', 'Salad cá ngừ tươi', 29000, 85, '/img/salad_8.jpg', 'Khai Vị', 'Con_Hang', 1);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (9, 'Gỏi cuốn chay', 'Gỏi cuốn chay thanh đạm', 24000, 95, '/img/goi_cuon_9.jpg', 'Khai Vị', 'Con_Hang', 1);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (10, 'Chả giò thịt heo', 'Chả giò thịt heo thơm ngon', 28000, 100, '/img/cha_gio_10.jpg', 'Khai Vị', 'Con_Hang', 1);

-- Món Chính (category_id = 2)
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (11, 'Cơm gà xối mỡ', 'Cơm gà thơm ngon', 50000, 150, '/img/com_1.jpg', 'Món Chính', 'Con_Hang', 2);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (12, 'Bún bò Huế', 'Bún bò cay đậm đà', 55000, 140, '/img/bun_2.jpg', 'Món Chính', 'Con_Hang', 2);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (13, 'Phở tái nạm', 'Phở bò truyền thống', 60000, 160, '/img/pho_3.jpg', 'Món Chính', 'Con_Hang', 2);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (14, 'Mì xào hải sản', 'Mì xào thơm ngon', 52000, 130, '/img/mi_4.jpg', 'Món Chính', 'Con_Hang', 2);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (15, 'Lẩu thập cẩm', 'Lẩu ngon bổ dưỡng', 90000, 100, '/img/lau_5.jpg', 'Món Chính', 'Con_Hang', 2);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (16, 'Cơm sườn nướng', 'Cơm sườn mềm thơm', 52000, 140, '/img/com_6.jpg', 'Món Chính', 'Con_Hang', 2);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (17, 'Bún riêu cua', 'Bún riêu đậm đà', 48000, 130, '/img/bun_7.jpg', 'Món Chính', 'Con_Hang', 2);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (18, 'Phở gà', 'Phở gà thơm ngon', 55000, 150, '/img/pho_8.jpg', 'Món Chính', 'Con_Hang', 2);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (19, 'Mì hoành thánh', 'Mì hoành thánh ngon', 52000, 120, '/img/mi_9.jpg', 'Món Chính', 'Con_Hang', 2);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (20, 'Lẩu hải sản', 'Lẩu hải sản tươi ngon', 95000, 90, '/img/lau_10.jpg', 'Món Chính', 'Con_Hang', 2);

-- Đồ Ăn Nhanh (category_id = 3)
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (21, 'Hamburger bò', 'Hamburger thơm ngon', 45000, 200, '/img/hamburger_1.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (22, 'Gà rán giòn', 'Gà rán giòn tan', 47000, 180, '/img/ga_ran_2.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (23, 'Pizza phô mai', 'Pizza phô mai béo ngậy', 65000, 160, '/img/pizza_3.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (24, 'Sandwich gà', 'Sandwich thịt gà ngon', 40000, 170, '/img/sandwich_4.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (25, 'Hamburger phô mai', 'Hamburger phô mai béo', 48000, 190, '/img/hamburger_5.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (26, 'Gà rán cay', 'Gà rán cay nóng', 47000, 180, '/img/ga_ran_6.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (27, 'Pizza hải sản', 'Pizza hải sản tươi ngon', 70000, 150, '/img/pizza_7.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (28, 'Sandwich chay', 'Sandwich rau củ', 38000, 160, '/img/sandwich_8.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (29, 'Hamburger gà', 'Hamburger thịt gà', 46000, 170, '/img/hamburger_9.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (30, 'Gà rán truyền thống', 'Gà rán đặc biệt', 45000, 180, '/img/ga_ran_10.jpg', 'Đồ Ăn Nhanh', 'Con_Hang', 3);

-- Đồ Nướng (category_id = 4)
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (31, 'Bò nướng sốt BBQ', 'Bò nướng mềm thơm', 80000, 120, '/img/bo_nuong_1.jpg', 'Đồ Nướng', 'Con_Hang', 4);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (32, 'Gà nướng mật ong', 'Gà nướng ngọt dịu', 75000, 110, '/img/ga_nuong_2.jpg', 'Đồ Nướng', 'Con_Hang', 4);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (33, 'BBQ heo', 'Heo nướng BBQ thơm ngon', 70000, 130, '/img/bbq_3.jpg', 'Đồ Nướng', 'Con_Hang', 4);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (34, 'Bò nướng lá lốt', 'Bò nướng lá lốt đậm đà', 80000, 120, '/img/bo_nuong_4.jpg', 'Đồ Nướng', 'Con_Hang', 4);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (35, 'Gà nướng tiêu', 'Gà nướng vị tiêu đặc biệt', 75000, 115, '/img/ga_nuong_5.jpg', 'Đồ Nướng', 'Con_Hang', 4);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (36, 'BBQ sườn heo', 'Sườn heo BBQ đậm đà', 72000, 130, '/img/bbq_6.jpg', 'Đồ Nướng', 'Con_Hang', 4);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (37, 'Bò nướng sa tế', 'Bò nướng cay thơm', 82000, 125, '/img/bo_nuong_7.jpg', 'Đồ Nướng', 'Con_Hang', 4);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (38, 'Gà nướng hành', 'Gà nướng hành thơm ngon', 74000, 120, '/img/ga_nuong_8.jpg', 'Đồ Nướng', 'Con_Hang', 4);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (39, 'BBQ cá hồi', 'Cá hồi BBQ ngon', 90000, 110, '/img/bbq_9.jpg', 'Đồ Nướng', 'Con_Hang', 4);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (40, 'Bò nướng chảo', 'Bò nướng chảo ngon', 85000, 130, '/img/bo_nuong_10.jpg', 'Đồ Nướng', 'Con_Hang', 4);

-- Món Chay (category_id = 5)
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (41, 'Cơm chay thập cẩm', 'Cơm chay nhiều món', 45000, 100, '/img/com_chay_1.jpg', 'Món Chay', 'Con_Hang', 5);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (42, 'Bún chay rau củ', 'Bún chay thanh đạm', 42000, 90, '/img/bun_chay_2.jpg', 'Món Chay', 'Con_Hang', 5);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (43, 'Nấm xào tỏi', 'Nấm xào thơm ngon', 35000, 80, '/img/nam_xao_3.jpg', 'Món Chay', 'Con_Hang', 5);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (44, 'Đậu hũ chiên giòn', 'Đậu hũ chiên giòn rụm', 32000, 85, '/img/dau_hu_4.jpg', 'Món Chay', 'Con_Hang', 5);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (45, 'Cơm chay rau củ', 'Cơm chay nhẹ nhàng', 40000, 95, '/img/com_chay_5.jpg', 'Món Chay', 'Con_Hang', 5);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (46, 'Bún chay đậu hũ', 'Bún chay đậu hũ ngon', 43000, 100, '/img/bun_chay_6.jpg', 'Món Chay', 'Con_Hang', 5);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (47, 'Nấm nướng muối ớt', 'Nấm nướng đậm đà', 37000, 90, '/img/nam_xao_7.jpg', 'Món Chay', 'Con_Hang', 5);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (48, 'Đậu hũ sốt cà chua', 'Đậu hũ sốt cà ngon', 34000, 85, '/img/dau_hu_8.jpg', 'Món Chay', 'Con_Hang', 5);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (49, 'Cơm chay nấm', 'Cơm chay thơm ngon', 41000, 95, '/img/com_chay_9.jpg', 'Món Chay', 'Con_Hang', 5);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (50, 'Bún chay rau củ', 'Bún chay thanh mát', 42000, 90, '/img/bun_chay_10.jpg', 'Món Chay', 'Con_Hang', 5);

-- Đồ Uống (category_id = 6)
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (51, 'Trà đá', 'Trà đá mát lạnh', 15000, 200, '/img/tra_1.jpg', 'Đồ Uống', 'Con_Hang', 6);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (52, 'Nước ép cam', 'Nước ép cam tươi', 30000, 180, '/img/nuoc_ep_2.jpg', 'Đồ Uống', 'Con_Hang', 6);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (53, 'Sinh tố bơ', 'Sinh tố bơ béo ngậy', 35000, 160, '/img/sinh_to_3.jpg', 'Đồ Uống', 'Con_Hang', 6);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (54, 'Sữa tươi trân châu', 'Sữa tươi trân châu thơm ngon', 40000, 150, '/img/sua_tuoi_4.jpg', 'Đồ Uống', 'Con_Hang', 6);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (55, 'Trà xanh', 'Trà xanh thơm mát', 20000, 180, '/img/tra_5.jpg', 'Đồ Uống', 'Con_Hang', 6);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (56, 'Nước ép cà rốt', 'Nước ép cà rốt tươi', 28000, 170, '/img/nuoc_ep_6.jpg', 'Đồ Uống', 'Con_Hang', 6);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (57, 'Sinh tố dâu', 'Sinh tố dâu tươi ngon', 34000, 160, '/img/sinh_to_7.jpg', 'Đồ Uống', 'Con_Hang', 6);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (58, 'Sữa tươi socola', 'Sữa tươi vị socola', 40000, 150, '/img/sua_tuoi_8.jpg', 'Đồ Uống', 'Con_Hang', 6);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (59, 'Trà đào', 'Trà đào thơm ngon', 32000, 170, '/img/tra_9.jpg', 'Đồ Uống', 'Con_Hang', 6);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (60, 'Nước ép táo', 'Nước ép táo tươi', 30000, 160, '/img/nuoc_ep_10.jpg', 'Đồ Uống', 'Con_Hang', 6);

-- Tráng Miệng (category_id = 7)
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (61, 'Chè đậu xanh', 'Chè đậu xanh thơm ngon', 25000, 150, '/img/che_1.jpg', 'Tráng Miệng', 'Con_Hang', 7);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (62, 'Bánh flan truyền thống', 'Bánh flan mịn màng', 28000, 140, '/img/flan_2.jpg', 'Tráng Miệng', 'Con_Hang', 7);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (63, 'Kem vani', 'Kem vani mát lạnh', 30000, 130, '/img/kem_3.jpg', 'Tráng Miệng', 'Con_Hang', 7);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (64, 'Trái cây tươi', 'Trái cây mùa ngon', 35000, 120, '/img/trai_cay_4.jpg', 'Tráng Miệng', 'Con_Hang', 7);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (65, 'Chè thập cẩm', 'Chè nhiều loại', 28000, 140, '/img/che_5.jpg', 'Tráng Miệng', 'Con_Hang', 7);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (66, 'Bánh flan socola', 'Bánh flan vị socola', 30000, 130, '/img/flan_6.jpg', 'Tráng Miệng', 'Con_Hang', 7);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (67, 'Kem dâu', 'Kem dâu thơm ngon', 32000, 120, '/img/kem_7.jpg', 'Tráng Miệng', 'Con_Hang', 7);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (68, 'Trái cây tổng hợp', 'Trái cây tươi ngon', 36000, 115, '/img/trai_cay_8.jpg', 'Tráng Miệng', 'Con_Hang', 7);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (69, 'Chè đậu đỏ', 'Chè đậu đỏ thơm ngon', 26000, 150, '/img/che_9.jpg', 'Tráng Miệng', 'Con_Hang', 7);
INSERT INTO products (id, name, description, price, quantity, image, type, status, category_id) VALUES (70, 'Bánh flan caramen', 'Bánh flan mềm mịn', 28000, 140, '/img/flan_10.jpg', 'Tráng Miệng', 'Con_Hang', 7);
