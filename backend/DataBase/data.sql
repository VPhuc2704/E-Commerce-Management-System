
INSERT INTO `category` VALUES 
(1,'Khai Vị'),
(2,'Món Chính'),
(3,'Đồ Ăn Nhanh'),
(4,'Đồ Nướng'),
(5,'Món Chay'),
(6,'Đồ Uống'),
(7,'Tráng Miệng');

INSERT INTO products(id, createdby, createddate, lastmodifiedby, lastmodifieddate, description, image, name, price, quantity,status, type, category_id, sold_quantity) 
VALUES 
(1,NULL,NULL,NULL,NULL,'Món khai vị nhẹ nhàng và ngon miệng','/img/9986c3bd-903c-4829-845c-ea5a38ebfd17_goi_cuon_1.jpg','Gỏi cuốn tươi ngon',45000,101,'Het_Hang','Khai Vị',1,NULL),
(2,NULL,NULL,NULL,NULL,'Chả giò giòn tan','/img/30998a9e-d174-4c04-b77f-a285d35c4cd2_spring-roll-7622587_1280.jpg','Chả giò truyền thống',28000,120,'Het_Hang','Khai Vị',1,NULL),
(3,NULL,NULL,NULL,NULL,'Súp bí đỏ thơm mịn','/img/ea5aea3f-c4c6-4e6d-980d-5576281f9008_sup.jpg','Súp bí đỏ thơm ngon',30000,80,'Het_Hang','Khai Vị',1,NULL),
(4,NULL,NULL,NULL,NULL,'Salad tươi mát','/img/afd1c9b8-d171-4385-9c6a-b8e5d320e8d6_salad.jpg','Salad trộn rau củ',27000,90,'Con_Hang','Khai Vị',1,NULL),
(5,NULL,NULL,NULL,NULL,'Gỏi cuốn đậm đà','/img/80b456db-ea10-418d-8144-776e1cfcb90b_chagochay.jpg','Gỏi cuốn tôm thịt',26000,100,'Con_Hang','Khai Vị',1,NULL),
(6,NULL,NULL,NULL,NULL,'Chả giò hải sản hấp dẫn','/img/829ccc99-ea0f-4d96-9275-7e76088b17c1_spring-rolls-8135469_1280.jpg','Chả giò hải sản',32000,110,'Con_Hang','Khai Vị',1,NULL),
(7,NULL,NULL,NULL,NULL,'Súp gà ngon lành','/img/53483831-7a63-497a-956c-ad67a3249c05_ai-generated-9013115_1280.jpg','Súp gà thượng hạng',35000,70,'Con_Hang','Khai Vị',1,NULL),
(8,NULL,NULL,NULL,NULL,'Salad cá ngừ tươi','/img/43680bc5-c804-44e3-9288-6f9a3132584b_ai-generated-7955585_1280.jpg','Salad cá ngừ',29000,85,'Con_Hang','Khai Vị',1,NULL),
(11,NULL,NULL,NULL,NULL,'Cơm gà thơm ngon','/img/8ebe3a54-e83e-4cd4-aa29-2d97a5b98281_ai-generated-8517258_1280.jpg','Cơm gà xối mỡ',50000,150,'Con_Hang','Món Chính',2,NULL),
(12,NULL,NULL,NULL,NULL,'Bún bò cay đậm đà','/img/522cf13c-e5e2-49d1-9f75-5780bb2f569f_bun_2.jpg','Bún bò Huế',55000,140,'Con_Hang','Món Chính',2,NULL),
(13,NULL,NULL,NULL,NULL,'Phở bò truyền thống','/img/08a7e318-2a73-4ae4-9a21-8f8b534959dd_noodle-soup-8021418_1280.png','Phở tái nạm',60000,160,'Con_Hang','Món Chính',2,NULL),
(14,NULL,NULL,NULL,NULL,'Mì xào thơm ngon','/img/18b18a17-6305-4aea-8892-785458ba13d5_ai-generated-8725190_1280.png','Mì xào hải sản',52000,130,'Con_Hang','Món Chính',2,NULL),
(15,NULL,NULL,NULL,NULL,'Lẩu ngon bổ dưỡng','/img/5f064b7c-36f9-4453-bc4c-7b32418df9eb_chon-nguyen-lieu-rau-cu-gia-vi-phu-hop-de-nau-lau-thap-cam.jpg','Lẩu thập cẩm',90000,100,'Con_Hang','Món Chính',2,NULL),
(16,NULL,NULL,NULL,NULL,'Cơm sườn mềm thơm','/img/9e868fbd-caca-4074-b01b-7d5b08f55c0a_ai-generated-8991387_1280.jpg','Cơm sườn nướng',52000,140,'Con_Hang','Món Chính',2,5),
(17,NULL,NULL,NULL,NULL,'Bún riêu đậm đà','/img/6e5e0756-4e09-433f-b7a7-89aad5aa0537_ai-generated-8841964_1280.jpg','Bún riêu cua',48000,130,'Con_Hang','Món Chính',2,NULL),
(18,NULL,NULL,NULL,NULL,'Phở gà thơm ngon','/img/7d430515-7933-40dd-b538-e6d4bb24b055_noodle-soup-8021418_1280.png','Phở gà',55000,150,'Con_Hang','Món Chính',2,NULL),
(20,NULL,NULL,NULL,NULL,'Lẩu hải sản tươi ngon','/img/61ce0362-5388-4f50-a44c-ab74796623e7_chon-nguyen-lieu-rau-cu-gia-vi-phu-hop-de-nau-lau-thap-cam.jpg','Lẩu hải sản',95000,90,'Con_Hang','Món Chính',2,NULL),
(21,NULL,NULL,NULL,NULL,'Hamburger thơm ngon','/img/3469a7c5-b77f-4abe-8b38-eea5f94d5252_ai-generated-7925774_1280.jpg','Hamburger bò',45000,200,'Con_Hang','Đồ Ăn Nhanh',3,2),
(22,NULL,NULL,NULL,NULL,'Gà rán giòn tan','/img/7a463e90-d3a2-4eb5-89e0-abc2d00f8db8_turkish-8341294_1280.jpg','Gà rán giòn',47000,180,'Con_Hang','Đồ Ăn Nhanh',3,NULL),
(23,NULL,NULL,NULL,NULL,'Pizza phô mai béo ngậy','/img/58ad835a-d534-43b1-b8a5-866ec7c171a1_ai-generated-9045688_1280.jpg','Pizza phô mai',65000,160,'Con_Hang','Đồ Ăn Nhanh',3,1),
(24,NULL,NULL,NULL,NULL,'Sandwich thịt gà ngon','/img/eac1ef6d-961e-4ba9-af37-b1c8d9ce5774_ai-generated-8406366_1280.png','Sandwich gà',40000,170,'Con_Hang','Đồ Ăn Nhanh',3,NULL),
(25,NULL,NULL,NULL,NULL,'Hamburger phô mai béo','/img/ed7a5c09-73e0-4dfe-a694-560d7d1ba4c2_ai-generated-7925774_1280.jpg','Hamburger phô mai',48000,190,'Con_Hang','Đồ Ăn Nhanh',3,NULL),
(26,NULL,NULL,NULL,NULL,'Gà rán cay nóng','/img/cb0c5b7f-60f8-4295-8a34-41f82c69b5ad_turkish-8341294_1280.jpg','Gà rán cay',47000,180,'Con_Hang','Đồ Ăn Nhanh',3,NULL),
(27,NULL,NULL,NULL,NULL,'Pizza hải sản tươi ngon','/img/c65794c5-87a5-4c7f-b9e5-801cd58db697_ai-generated-9045688_1280.jpg','Pizza hải sản',70000,150,'Con_Hang','Đồ Ăn Nhanh',3,NULL),
(28,NULL,NULL,NULL,NULL,'Sandwich rau củ','/img/72072183-ecd8-478a-a82b-8805426c46b9_ai-generated-7925774_1280.jpg','Sandwich chay',38000,160,'Con_Hang','Đồ Ăn Nhanh',3,NULL),
(29,NULL,NULL,NULL,NULL,'Hamburger thịt gà','/img/1855b978-fa7a-4a03-b0bd-4c4de53a5f8d_ai-generated-8406366_1280.png','Hamburger gà',46000,170,'Con_Hang','Đồ Ăn Nhanh',3,NULL),
(30,NULL,NULL,NULL,NULL,'Gà rán đặc biệt','/img/132b1b43-e519-49c4-b340-cda8d0add7ac_turkish-8341294_1280.jpg','Gà rán truyền thống',45000,180,'Con_Hang','Đồ Ăn Nhanh',3,NULL),
(31,NULL,NULL,NULL,NULL,'Bò nướng mềm thơm','/img/51443cb0-3b1a-474c-93e7-58b9b921d9c3_steak-8847373_1280.jpg','Bò nướng sốt BBQ',80000,120,'Con_Hang','Đồ Nướng',4,NULL),
(32,NULL,NULL,NULL,NULL,'Gà nướng ngọt dịu','/img/623f7c7d-57dd-4ae7-9185-3400cbfb30d1_ai-generated-8594918_1280.jpg','Gà nướng mật ong',75000,110,'Con_Hang','Đồ Nướng',4,NULL),
(34,NULL,NULL,NULL,NULL,'Bò nướng lá lốt đậm đà','/img/eaeb0e6b-bde6-482a-95a3-6deebe0396b1_bo-cuon-la-lot-10.jpg','Bò nướng lá lốt',80000,120,'Con_Hang','Đồ Nướng',4,NULL),
(36,NULL,NULL,NULL,NULL,'Sườn heo BBQ đậm đà','/img/4de0a841-9ea3-4968-8f5b-0444439fca5f_lamb-chops-8824495_1280.jpg','BBQ sườn heo',72000,130,'Con_Hang','Đồ Nướng',4,NULL),
(37,NULL,NULL,NULL,NULL,'Bò nướng cay thơm','/img/62b6eba0-c45c-4e04-9130-a269639339e7_steak-8847373_1280.jpg','Bò nướng sa tế',82000,125,'Con_Hang','Đồ Nướng',4,NULL),
(38,NULL,NULL,NULL,NULL,'Gà nướng hành thơm ngon','/img/17504bcb-43e2-4800-91fc-5dbedbef59ff_ai-generated-8594918_1280.jpg','Gà nướng hành',74000,120,'Con_Hang','Đồ Nướng',4,NULL),
(39,NULL,NULL,NULL,NULL,'Cá hồi BBQ ngon','/img/ddb11a6c-c855-4dc8-9a98-f955a1f572e5_ai-generated-9078761_1280.jpg','BBQ cá hồi',90000,110,'Con_Hang','Đồ Nướng',4,NULL),
(40,NULL,NULL,NULL,NULL,'Bò nướng chảo ngon','/img/47d29df8-7faa-4a02-9a5b-f50ed96ad7fa_ai-generated-8006212_1280.jpg','Bò nướng chảo',85000,130,'Con_Hang','Đồ Nướng',4,NULL),
(41,NULL,NULL,NULL,NULL,'Cơm chay nhiều món','/img/79151c52-0a09-4669-8639-c28e1cfcfdd7_ai-generated-8991738_1280 (1).jpg','Cơm chay thập cẩm',45000,100,'Con_Hang','Món Chay',5,NULL),
(45,NULL,NULL,NULL,NULL,'Cơm chay nhẹ nhàng','/img/997b0083-171d-42b2-b00d-8abf58cd3dbe_ai-generated-8991738_1280 (1).jpg','Cơm chay rau củ',40000,95,'Con_Hang','Món Chay',5,NULL),
(52,NULL,NULL,NULL,NULL,'Nước ép cam tươi','/img/287ca4cc-d6f6-4dd8-a36e-4c5c37c844cd_ai-generated-8691287_1280.jpg','Nước ép cam',30000,180,'Con_Hang','Đồ Uống',6,1),
(56,NULL,NULL,NULL,NULL,'Nước ép cà rốt tươi','/img/67e7b0a1-78ca-49d7-96ce-b5a24a85e124_ai-generated-8741239_1280.png','Nước ép cà rốt',28000,170,'Con_Hang','Đồ Uống',6,NULL),
(57,NULL,NULL,NULL,NULL,'Sinh tố dâu tươi ngon','/img/86b17a94-0996-44b3-b45a-c2296f8ab054_fruit-8504120_1280.jpg','Sinh tố dâu',34000,160,'Con_Hang','Đồ Uống',6,1),
(60,NULL,NULL,NULL,NULL,'Nước ép táo tươi','/img/80d52647-32e8-4860-9334-1511b91269b2_ai-generated-8757301_1280.png','Nước ép táo',30000,160,'Con_Hang','Đồ Uống',6,NULL),
(61,NULL,NULL,NULL,NULL,'Chè đậu xanh thơm ngon','/img/7d2975aa-0117-4da8-ae5b-073a1a32b081_red-wine-8744058_1280.png','Chè đậu xanh',25000,150,'Con_Hang','Tráng Miệng',7,NULL),
(63,NULL,NULL,NULL,NULL,'Kem vani mát lạnh','/img/f7eaab55-8a33-41a9-b9ad-89471031b31c_ai-generated-8948551_1280.jpg','Kem vani',30000,130,'Con_Hang','Tráng Miệng',7,NULL),
(64,NULL,NULL,NULL,NULL,'Trái cây mùa ngon','/img/2b961289-90d2-4849-abca-f94bc0047c19_ai-generated-9037066_1280.jpg','Trái cây tươi',35000,120,'Con_Hang','Tráng Miệng',7,NULL),
(66,NULL,NULL,NULL,NULL,'Bánh flan vị socola','/img/90263edb-d6c3-4b04-9dfa-0bce0f625635_ai-generated-9220859_1280.jpg','Bánh flan socola',30000,130,'Con_Hang','Tráng Miệng',7,NULL),
(67,NULL,NULL,NULL,NULL,'Kem dâu thơm ngon','/img/9460ff91-f7d3-40d7-aae3-d94d0e7c6d3a_ai-generated-8801420_1280.jpg','Kem dâu',32000,120,'Con_Hang','Tráng Miệng',7,NULL),
(68,NULL,NULL,NULL,NULL,'Trái cây tươi ngon','/img/8be0d601-6a7e-4db9-98c1-8243b50505bd_mixed-fruits-7772552_1280.jpg','Trái cây tổng hợp',36000,115,'Con_Hang','Tráng Miệng',7,NULL),
(70,NULL,NULL,NULL,NULL,'Bánh flan mềm mịn','/img/2bf45991-fab5-4abe-911d-913bf9bf4680_ai-generated-9128653_1280.png','Bánh flan caramen',28000,140,'Con_Hang','Tráng Miệng',7,NULL);

INSERT INTO `role` VALUES
 (1,NULL,NULL,NULL,NULL,'ADMIN','ROLE_ADMIN'),
 (2,NULL,NULL,NULL,NULL,'USER','ROLE_USER');


INSERT INTO user (email, password, fullname, numberphone, address, isverified) VALUES
    ('admin@gmail.com', '$2a$10$7UBKsdIhIJk/z.KbpsrQqe5IgbpF5dWfz0oU1yR2d4FHhzuwzAFd2', 'admin User', '0369852147', 'Đà Nẵng', 1);

    
INSERT INTO `user_role` VALUES (1,1);