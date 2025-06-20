-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: ecommerce_test
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl70asp4l4w0jmbm1tqyofho4o` (`user_id`),
  CONSTRAINT `FKl70asp4l4w0jmbm1tqyofho4o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (7,2),(6,3);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartitem`
--

DROP TABLE IF EXISTS `cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cartitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `cart_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcj0jvvlv7mum72m5qblw5m1tc` (`cart_id`),
  KEY `FK34h0pwav2nhuj5ouf43gsq74d` (`product_id`),
  CONSTRAINT `FK34h0pwav2nhuj5ouf43gsq74d` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKcj0jvvlv7mum72m5qblw5m1tc` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitem`
--

LOCK TABLES `cartitem` WRITE;
/*!40000 ALTER TABLE `cartitem` DISABLE KEYS */;
INSERT INTO `cartitem` VALUES (22,52000,2,7,5),(24,64000,2,7,6),(34,47000,1,6,22);
/*!40000 ALTER TABLE `cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_46ccwnsi9409t36lurvtyljak` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (3,'Đồ Ăn Nhanh'),(4,'Đồ Nướng'),(6,'Đồ Uống'),(1,'Khai Vị'),(5,'Món Chay'),(2,'Món Chính'),(7,'Tráng Miệng');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitem`
--

DROP TABLE IF EXISTS `orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhcggihiup2358o98a7uuxqoxb` (`order_id`),
  KEY `FK5gd4vssx9bc8pvu82fnvsavlt` (`product_id`),
  CONSTRAINT `FK5gd4vssx9bc8pvu82fnvsavlt` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKhcggihiup2358o98a7uuxqoxb` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitem`
--

LOCK TABLES `orderitem` WRITE;
/*!40000 ALTER TABLE `orderitem` DISABLE KEYS */;
INSERT INTO `orderitem` VALUES (1,84000,3,1,2),(2,54000,2,2,4),(3,60000,2,2,3),(4,54000,2,3,4),(5,64000,2,4,6),(6,75000,3,4,1),(7,32000,1,6,6),(8,64000,2,7,6),(9,32000,1,8,6),(10,32000,1,9,6),(11,32000,1,10,6),(12,32000,1,11,6),(13,30000,1,12,3),(14,27000,1,13,4),(15,32000,1,14,6),(16,30000,1,15,3),(17,30000,1,16,3),(18,27000,1,16,4),(19,52000,2,17,5),(20,30000,1,18,3),(21,27000,1,18,4),(22,32000,1,18,6),(23,52000,2,19,5),(24,52000,2,20,5),(25,30000,1,21,3),(26,27000,1,21,4),(27,30000,1,22,3),(28,27000,1,22,4),(29,52000,2,23,5),(30,52000,2,24,5),(31,52000,2,25,5),(32,64000,2,26,6),(41,52000,2,35,5),(42,52000,2,36,5);
/*!40000 ALTER TABLE `orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `createdby` varchar(255) DEFAULT NULL,
  `createddate` datetime(6) DEFAULT NULL,
  `lastmodifiedby` varchar(255) DEFAULT NULL,
  `lastmodifieddate` datetime(6) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total_amount` double DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKel9kyl84ego2otj2accfd8mr7` (`user_id`),
  CONSTRAINT `FKel9kyl84ego2otj2accfd8mr7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,NULL,'2025-06-08 20:26:47.717000',NULL,NULL,'SHIPPED',84000,3),(2,NULL,'2025-06-08 20:30:27.444000',NULL,NULL,'CANCELLED',114000,3),(3,NULL,'2025-06-08 20:50:03.687000',NULL,NULL,'CANCELLED',54000,3),(4,NULL,'2025-06-08 22:49:58.833000',NULL,NULL,'DELIVERED',139000,3),(5,NULL,'2025-06-09 00:50:23.123000',NULL,NULL,'CONFIRMED',0,3),(6,NULL,'2025-06-09 00:51:25.500000',NULL,NULL,'PENDING',32000,3),(7,NULL,'2025-06-09 13:14:10.468000',NULL,NULL,'PENDING',64000,3),(8,NULL,'2025-06-09 15:32:01.304000',NULL,NULL,'PENDING',32000,3),(9,NULL,'2025-06-09 15:32:53.955000',NULL,NULL,'PENDING',32000,3),(10,NULL,'2025-06-09 15:33:05.671000',NULL,NULL,'PENDING',32000,3),(11,NULL,'2025-06-09 16:30:27.319000',NULL,NULL,'PENDING',32000,3),(12,NULL,'2025-06-09 16:47:02.560000',NULL,NULL,'PENDING',30000,3),(13,NULL,'2025-06-09 18:18:07.537000',NULL,NULL,'PENDING',27000,3),(14,NULL,'2025-06-09 18:18:14.392000',NULL,NULL,'PENDING',32000,3),(15,NULL,'2025-06-09 18:19:02.410000',NULL,NULL,'PENDING',30000,3),(16,NULL,'2025-06-09 18:19:56.546000',NULL,NULL,'PENDING',57000,3),(17,NULL,'2025-06-09 19:53:06.611000',NULL,NULL,'PENDING',52000,3),(18,NULL,'2025-06-09 20:06:57.499000',NULL,NULL,'PENDING',89000,3),(19,NULL,'2025-06-09 20:51:41.564000',NULL,NULL,'PENDING',52000,3),(20,NULL,'2025-06-09 20:53:15.941000',NULL,NULL,'PENDING',52000,3),(21,NULL,'2025-06-09 20:58:33.015000',NULL,NULL,'PENDING',57000,3),(22,NULL,'2025-06-09 21:35:38.810000',NULL,NULL,'PENDING',57000,3),(23,NULL,'2025-06-10 15:52:51.755000',NULL,NULL,'PENDING',52000,2),(24,NULL,'2025-06-10 18:29:30.387000',NULL,NULL,'PENDING',52000,2),(25,NULL,'2025-06-10 18:29:35.926000',NULL,NULL,'PENDING',52000,2),(26,NULL,'2025-06-12 15:03:24.936000',NULL,NULL,'DELIVERED',64000,3),(35,NULL,'2025-06-12 15:38:26.808000',NULL,NULL,'PENDING',52000,3),(36,NULL,'2025-06-14 12:58:20.247000',NULL,NULL,'CONFIRMED',52000,2);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `createdby` varchar(255) DEFAULT NULL,
  `createddate` datetime(6) DEFAULT NULL,
  `lastmodifiedby` varchar(255) DEFAULT NULL,
  `lastmodifieddate` datetime(6) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `paymentmethod` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_mf7n8wo2rwrxsd6f3t9ub2mep` (`order_id`),
  CONSTRAINT `FKlouu98csyullos9k25tbpk4va` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,NULL,NULL,NULL,NULL,64000,'COD','CONFIRMED',26),(10,NULL,NULL,NULL,NULL,52000,'VNPAY','PENDING',35),(11,NULL,NULL,NULL,NULL,52000,'VNPAY','PENDING',36);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `createdby` varchar(255) DEFAULT NULL,
  `createddate` datetime(6) DEFAULT NULL,
  `lastmodifiedby` varchar(255) DEFAULT NULL,
  `lastmodifieddate` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1cf90etcu98x1e6n9aks3tel3` (`category_id`),
  CONSTRAINT `FK1cf90etcu98x1e6n9aks3tel3` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,NULL,NULL,NULL,NULL,'Món khai vị nhẹ nhàng và ngon miệng','/img/9986c3bd-903c-4829-845c-ea5a38ebfd17_goi_cuon_1.jpg','Gỏi cuốn tươi ngon',45000,101,'Het_Hang','Khai Vị',1),(2,NULL,NULL,NULL,NULL,'Chả giò giòn tan','/img/30998a9e-d174-4c04-b77f-a285d35c4cd2_spring-roll-7622587_1280.jpg','Chả giò truyền thống',28000,120,'Het_Hang','Khai Vị',1),(3,NULL,NULL,NULL,NULL,'Súp bí đỏ thơm mịn','/img/ea5aea3f-c4c6-4e6d-980d-5576281f9008_sup.jpg','Súp bí đỏ thơm ngon',30000,80,'Het_Hang','Khai Vị',1),(4,NULL,NULL,NULL,NULL,'Salad tươi mát','/img/afd1c9b8-d171-4385-9c6a-b8e5d320e8d6_salad.jpg','Salad trộn rau củ',27000,90,'Con_Hang','Khai Vị',1),(5,NULL,NULL,NULL,NULL,'Gỏi cuốn đậm đà','/img/80b456db-ea10-418d-8144-776e1cfcb90b_chagochay.jpg','Gỏi cuốn tôm thịt',26000,100,'Con_Hang','Khai Vị',1),(6,NULL,NULL,NULL,NULL,'Chả giò hải sản hấp dẫn','/img/829ccc99-ea0f-4d96-9275-7e76088b17c1_spring-rolls-8135469_1280.jpg','Chả giò hải sản',32000,110,'Con_Hang','Khai Vị',1),(7,NULL,NULL,NULL,NULL,'Súp gà ngon lành','/img/53483831-7a63-497a-956c-ad67a3249c05_ai-generated-9013115_1280.jpg','Súp gà thượng hạng',35000,70,'Con_Hang','Khai Vị',1),(8,NULL,NULL,NULL,NULL,'Salad cá ngừ tươi','/img/43680bc5-c804-44e3-9288-6f9a3132584b_ai-generated-7955585_1280.jpg','Salad cá ngừ',29000,85,'Con_Hang','Khai Vị',1),(11,NULL,NULL,NULL,NULL,'Cơm gà thơm ngon','/img/8ebe3a54-e83e-4cd4-aa29-2d97a5b98281_ai-generated-8517258_1280.jpg','Cơm gà xối mỡ',50000,150,'Con_Hang','Món Chính',2),(12,NULL,NULL,NULL,NULL,'Bún bò cay đậm đà','/img/522cf13c-e5e2-49d1-9f75-5780bb2f569f_bun_2.jpg','Bún bò Huế',55000,140,'Con_Hang','Món Chính',2),(13,NULL,NULL,NULL,NULL,'Phở bò truyền thống','/img/08a7e318-2a73-4ae4-9a21-8f8b534959dd_noodle-soup-8021418_1280.png','Phở tái nạm',60000,160,'Con_Hang','Món Chính',2),(14,NULL,NULL,NULL,NULL,'Mì xào thơm ngon','/img/18b18a17-6305-4aea-8892-785458ba13d5_ai-generated-8725190_1280.png','Mì xào hải sản',52000,130,'Con_Hang','Món Chính',2),(15,NULL,NULL,NULL,NULL,'Lẩu ngon bổ dưỡng','/img/5f064b7c-36f9-4453-bc4c-7b32418df9eb_chon-nguyen-lieu-rau-cu-gia-vi-phu-hop-de-nau-lau-thap-cam.jpg','Lẩu thập cẩm',90000,100,'Con_Hang','Món Chính',2),(16,NULL,NULL,NULL,NULL,'Cơm sườn mềm thơm','/img/9e868fbd-caca-4074-b01b-7d5b08f55c0a_ai-generated-8991387_1280.jpg','Cơm sườn nướng',52000,140,'Con_Hang','Món Chính',2),(17,NULL,NULL,NULL,NULL,'Bún riêu đậm đà','/img/6e5e0756-4e09-433f-b7a7-89aad5aa0537_ai-generated-8841964_1280.jpg','Bún riêu cua',48000,130,'Con_Hang','Món Chính',2),(18,NULL,NULL,NULL,NULL,'Phở gà thơm ngon','/img/7d430515-7933-40dd-b538-e6d4bb24b055_noodle-soup-8021418_1280.png','Phở gà',55000,150,'Con_Hang','Món Chính',2),(20,NULL,NULL,NULL,NULL,'Lẩu hải sản tươi ngon','/img/61ce0362-5388-4f50-a44c-ab74796623e7_chon-nguyen-lieu-rau-cu-gia-vi-phu-hop-de-nau-lau-thap-cam.jpg','Lẩu hải sản',95000,90,'Con_Hang','Món Chính',2),(21,NULL,NULL,NULL,NULL,'Hamburger thơm ngon','/img/3469a7c5-b77f-4abe-8b38-eea5f94d5252_ai-generated-7925774_1280.jpg','Hamburger bò',45000,200,'Con_Hang','Đồ Ăn Nhanh',3),(22,NULL,NULL,NULL,NULL,'Gà rán giòn tan','/img/7a463e90-d3a2-4eb5-89e0-abc2d00f8db8_turkish-8341294_1280.jpg','Gà rán giòn',47000,180,'Con_Hang','Đồ Ăn Nhanh',3),(23,NULL,NULL,NULL,NULL,'Pizza phô mai béo ngậy','/img/58ad835a-d534-43b1-b8a5-866ec7c171a1_ai-generated-9045688_1280.jpg','Pizza phô mai',65000,160,'Con_Hang','Đồ Ăn Nhanh',3),(24,NULL,NULL,NULL,NULL,'Sandwich thịt gà ngon','/img/eac1ef6d-961e-4ba9-af37-b1c8d9ce5774_ai-generated-8406366_1280.png','Sandwich gà',40000,170,'Con_Hang','Đồ Ăn Nhanh',3),(25,NULL,NULL,NULL,NULL,'Hamburger phô mai béo','/img/ed7a5c09-73e0-4dfe-a694-560d7d1ba4c2_ai-generated-7925774_1280.jpg','Hamburger phô mai',48000,190,'Con_Hang','Đồ Ăn Nhanh',3),(26,NULL,NULL,NULL,NULL,'Gà rán cay nóng','/img/cb0c5b7f-60f8-4295-8a34-41f82c69b5ad_turkish-8341294_1280.jpg','Gà rán cay',47000,180,'Con_Hang','Đồ Ăn Nhanh',3),(27,NULL,NULL,NULL,NULL,'Pizza hải sản tươi ngon','/img/c65794c5-87a5-4c7f-b9e5-801cd58db697_ai-generated-9045688_1280.jpg','Pizza hải sản',70000,150,'Con_Hang','Đồ Ăn Nhanh',3),(28,NULL,NULL,NULL,NULL,'Sandwich rau củ','/img/72072183-ecd8-478a-a82b-8805426c46b9_ai-generated-7925774_1280.jpg','Sandwich chay',38000,160,'Con_Hang','Đồ Ăn Nhanh',3),(29,NULL,NULL,NULL,NULL,'Hamburger thịt gà','/img/1855b978-fa7a-4a03-b0bd-4c4de53a5f8d_ai-generated-8406366_1280.png','Hamburger gà',46000,170,'Con_Hang','Đồ Ăn Nhanh',3),(30,NULL,NULL,NULL,NULL,'Gà rán đặc biệt','/img/132b1b43-e519-49c4-b340-cda8d0add7ac_turkish-8341294_1280.jpg','Gà rán truyền thống',45000,180,'Con_Hang','Đồ Ăn Nhanh',3),(31,NULL,NULL,NULL,NULL,'Bò nướng mềm thơm','/img/51443cb0-3b1a-474c-93e7-58b9b921d9c3_steak-8847373_1280.jpg','Bò nướng sốt BBQ',80000,120,'Con_Hang','Đồ Nướng',4),(32,NULL,NULL,NULL,NULL,'Gà nướng ngọt dịu','/img/623f7c7d-57dd-4ae7-9185-3400cbfb30d1_ai-generated-8594918_1280.jpg','Gà nướng mật ong',75000,110,'Con_Hang','Đồ Nướng',4),(34,NULL,NULL,NULL,NULL,'Bò nướng lá lốt đậm đà','/img/eaeb0e6b-bde6-482a-95a3-6deebe0396b1_bo-cuon-la-lot-10.jpg','Bò nướng lá lốt',80000,120,'Con_Hang','Đồ Nướng',4),(36,NULL,NULL,NULL,NULL,'Sườn heo BBQ đậm đà','/img/4de0a841-9ea3-4968-8f5b-0444439fca5f_lamb-chops-8824495_1280.jpg','BBQ sườn heo',72000,130,'Con_Hang','Đồ Nướng',4),(37,NULL,NULL,NULL,NULL,'Bò nướng cay thơm','/img/62b6eba0-c45c-4e04-9130-a269639339e7_steak-8847373_1280.jpg','Bò nướng sa tế',82000,125,'Con_Hang','Đồ Nướng',4),(38,NULL,NULL,NULL,NULL,'Gà nướng hành thơm ngon','/img/17504bcb-43e2-4800-91fc-5dbedbef59ff_ai-generated-8594918_1280.jpg','Gà nướng hành',74000,120,'Con_Hang','Đồ Nướng',4),(39,NULL,NULL,NULL,NULL,'Cá hồi BBQ ngon','/img/ddb11a6c-c855-4dc8-9a98-f955a1f572e5_ai-generated-9078761_1280.jpg','BBQ cá hồi',90000,110,'Con_Hang','Đồ Nướng',4),(40,NULL,NULL,NULL,NULL,'Bò nướng chảo ngon','/img/47d29df8-7faa-4a02-9a5b-f50ed96ad7fa_ai-generated-8006212_1280.jpg','Bò nướng chảo',85000,130,'Con_Hang','Đồ Nướng',4),(41,NULL,NULL,NULL,NULL,'Cơm chay nhiều món','/img/79151c52-0a09-4669-8639-c28e1cfcfdd7_ai-generated-8991738_1280 (1).jpg','Cơm chay thập cẩm',45000,100,'Con_Hang','Món Chay',5),(45,NULL,NULL,NULL,NULL,'Cơm chay nhẹ nhàng','/img/997b0083-171d-42b2-b00d-8abf58cd3dbe_ai-generated-8991738_1280 (1).jpg','Cơm chay rau củ',40000,95,'Con_Hang','Món Chay',5),(52,NULL,NULL,NULL,NULL,'Nước ép cam tươi','/img/287ca4cc-d6f6-4dd8-a36e-4c5c37c844cd_ai-generated-8691287_1280.jpg','Nước ép cam',30000,180,'Con_Hang','Đồ Uống',6),(56,NULL,NULL,NULL,NULL,'Nước ép cà rốt tươi','/img/67e7b0a1-78ca-49d7-96ce-b5a24a85e124_ai-generated-8741239_1280.png','Nước ép cà rốt',28000,170,'Con_Hang','Đồ Uống',6),(57,NULL,NULL,NULL,NULL,'Sinh tố dâu tươi ngon','/img/86b17a94-0996-44b3-b45a-c2296f8ab054_fruit-8504120_1280.jpg','Sinh tố dâu',34000,160,'Con_Hang','Đồ Uống',6),(60,NULL,NULL,NULL,NULL,'Nước ép táo tươi','/img/80d52647-32e8-4860-9334-1511b91269b2_ai-generated-8757301_1280.png','Nước ép táo',30000,160,'Con_Hang','Đồ Uống',6),(61,NULL,NULL,NULL,NULL,'Chè đậu xanh thơm ngon','/img/7d2975aa-0117-4da8-ae5b-073a1a32b081_red-wine-8744058_1280.png','Chè đậu xanh',25000,150,'Con_Hang','Tráng Miệng',7),(63,NULL,NULL,NULL,NULL,'Kem vani mát lạnh','/img/f7eaab55-8a33-41a9-b9ad-89471031b31c_ai-generated-8948551_1280.jpg','Kem vani',30000,130,'Con_Hang','Tráng Miệng',7),(64,NULL,NULL,NULL,NULL,'Trái cây mùa ngon','/img/2b961289-90d2-4849-abca-f94bc0047c19_ai-generated-9037066_1280.jpg','Trái cây tươi',35000,120,'Con_Hang','Tráng Miệng',7),(66,NULL,NULL,NULL,NULL,'Bánh flan vị socola','/img/90263edb-d6c3-4b04-9dfa-0bce0f625635_ai-generated-9220859_1280.jpg','Bánh flan socola',30000,130,'Con_Hang','Tráng Miệng',7),(67,NULL,NULL,NULL,NULL,'Kem dâu thơm ngon','/img/9460ff91-f7d3-40d7-aae3-d94d0e7c6d3a_ai-generated-8801420_1280.jpg','Kem dâu',32000,120,'Con_Hang','Tráng Miệng',7),(68,NULL,NULL,NULL,NULL,'Trái cây tươi ngon','/img/8be0d601-6a7e-4db9-98c1-8243b50505bd_mixed-fruits-7772552_1280.jpg','Trái cây tổng hợp',36000,115,'Con_Hang','Tráng Miệng',7),(70,NULL,NULL,NULL,NULL,'Bánh flan mềm mịn','/img/2bf45991-fab5-4abe-911d-913bf9bf4680_ai-generated-9128653_1280.png','Bánh flan caramen',28000,140,'Con_Hang','Tráng Miệng',7);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refreshtoken`
--

DROP TABLE IF EXISTS `refreshtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refreshtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `refreshtoken` varchar(200) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ns6vribdt8ty1c4m6nsvqbdv1` (`refreshtoken`),
  KEY `FKfr75ge3iecdx26qe8afh1srf6` (`user_id`),
  CONSTRAINT `FKfr75ge3iecdx26qe8afh1srf6` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refreshtoken`
--

LOCK TABLES `refreshtoken` WRITE;
/*!40000 ALTER TABLE `refreshtoken` DISABLE KEYS */;
INSERT INTO `refreshtoken` VALUES (16,'2025-05-30 23:25:38.974000','36370a2e-edf8-43fa-8bb7-0b8a92c6994f',2),(17,'2025-05-30 23:25:48.500000','81328494-168f-44db-80e3-37cef427fe7f',2),(30,'2025-05-31 19:37:27.208000','4e03fae3-fd7a-4c6f-8719-926b82884cd7',3),(31,'2025-06-01 16:31:41.742000','4a691c4b-eca3-4d9a-968a-80ab3517136f',3),(33,'2025-06-01 17:37:34.017000','d0d7ec7c-6203-4a84-992c-f81216a36a9f',3),(43,'2025-06-02 13:26:08.173000','3ff31637-a7dc-4479-ae1a-d9d19eb14b45',23),(44,'2025-06-04 23:57:27.471000','2afcbb64-f946-4c6f-9bc9-9ce29b36d49f',23),(45,'2025-06-04 23:57:54.570000','7c694f25-f2e5-4806-aee6-e16f81c2bf60',2),(46,'2025-06-04 23:57:59.792000','4ebb2037-a960-4a3a-9005-c2fe9e8884d1',2),(48,'2025-06-05 23:45:37.249000','f5d6a1b7-7f77-4866-ac5f-b4baf68f2f6d',2),(51,'2025-06-06 23:18:07.263000','06b7e3fa-369c-4a11-9ec6-faa1285de5d4',3),(53,'2025-06-07 14:19:44.016000','2f6cdb40-a67b-4e68-9675-29d0b9ee727e',3),(54,'2025-06-07 14:39:47.717000','b8d66a88-e3f8-4f77-be34-4bbd15777782',2),(57,'2025-06-07 15:27:49.604000','5e0d2d63-a784-409b-9db4-f10bd92db7a6',2),(58,'2025-06-07 17:16:29.903000','7701fc2c-d495-4eea-b611-8297cc02ddea',2),(60,'2025-06-07 23:14:06.274000','a4dec45e-1b22-4ccc-baef-a19d9fe44e3f',3),(61,'2025-06-09 20:24:14.260000','e8f9dc5d-e45e-40c5-af0b-707a7fd5c926',3),(62,'2025-06-11 14:26:53.013000','f5d9b3c2-bd0e-4787-b010-7a7eaab0f0d6',2),(63,'2025-06-11 14:32:19.935000','3837fdc3-c2a4-4708-8030-b107950632d1',2),(64,'2025-06-11 14:35:56.471000','6739dc76-b04b-4fc0-b1f8-1dbc75c4a394',3),(65,'2025-06-11 14:40:57.652000','67e3d9ad-4505-4ebf-ba37-acae282af1eb',2),(66,'2025-06-11 15:05:08.170000','d5f62000-ee5b-4310-af95-47d7af71c976',2),(67,'2025-06-11 15:37:37.992000','b2c5d76d-2b2c-4e37-b413-86347debd9e0',3),(68,'2025-06-11 15:38:45.463000','75270985-8fc5-4490-b985-ddcc5cb6a383',2),(69,'2025-06-11 18:30:26.732000','c023b847-0281-49f4-9852-abf9eab1f4d0',3),(71,'2025-06-12 22:24:34.148000','76bf0347-775d-43c6-ae11-c6f8cf1f1feb',2),(72,'2025-06-13 17:58:37.048000','8d87f6e6-30d9-41ba-a7f4-02dcd05c8e55',2),(73,'2025-06-13 18:02:21.029000','f95c10e1-8912-40f2-a661-843542a0bd0d',3),(74,'2025-06-13 18:05:12.186000','530dc4c9-886c-481b-b1fe-1a88b77793aa',2),(78,'2025-06-14 17:35:56.267000','354e11ee-745b-4ca6-9f40-5a8c15f0c749',2),(80,'2025-06-15 13:06:10.440000','168171c1-b169-4d5f-ae6c-4c1b8461287b',2),(82,'2025-06-15 13:56:37.755000','ff24f558-5420-4e53-89d6-4d01fa928d94',2),(85,'2025-06-16 16:06:24.291000','394600a5-dd5e-452a-9276-d883342c72d0',2),(88,'2025-06-16 17:17:58.124000','0d0900bf-be08-4b7a-a8c2-71f13c457404',2),(96,'2025-06-17 11:22:51.995000','317f760f-b4d3-42f8-bc17-33fd3d4fafc8',3),(97,'2025-06-17 14:18:00.226000','1fc9a047-ed7a-4da4-899a-b17f5a35c9fc',2),(99,'2025-06-17 16:23:21.163000','9d3c57f6-c98b-4f36-a329-4383c378e277',2),(100,'2025-06-17 16:35:39.540000','d0a2ecbe-8bb0-4fae-8497-7aab12f4832e',2),(101,'2025-06-17 21:22:52.214000','6c10bfa5-7feb-4aa0-9609-4768821f73a4',2),(103,'2025-06-17 23:50:41.467000','8ba5757e-a515-4cab-a504-c0370bea89c3',2),(107,'2025-06-18 18:00:51.697000','72460a51-0390-4d6c-a742-18e738cef700',3),(108,'2025-06-18 18:15:44.509000','3a0ab45e-4b5e-4b03-98f8-356cd9a90b0e',2),(112,'2025-06-18 22:57:36.675000','7e70f3d8-7533-4e4b-8968-51dd38ae7236',2),(114,'2025-06-19 00:10:31.146000','ff8d6b0d-fe1f-4051-a102-f1c286c3d99b',2),(115,'2025-06-19 09:55:16.371000','38e316b9-392f-4719-b5d2-ea4623f3762d',2),(118,'2025-06-19 17:43:35.235000','5012e623-9129-4fe7-a5cf-9175d83f00fb',2),(121,'2025-06-19 21:20:10.035000','c38a733a-9711-4dd3-99f1-072b45baa6f8',2),(122,'2025-06-19 22:01:36.711000','3910198a-488a-4dd7-a09b-0088431d25a9',2),(124,'2025-06-20 10:32:56.806000','1f3b4dd6-ffa0-4ce4-8336-2a81bd300207',3);
/*!40000 ALTER TABLE `refreshtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `createdby` varchar(255) DEFAULT NULL,
  `createddate` datetime DEFAULT NULL,
  `lastmodifiedby` varchar(255) DEFAULT NULL,
  `lastmodifieddate` datetime DEFAULT NULL,
  `comment` text,
  `image_url` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa5cmgpp2plp5oai84fkmbi63e` (`product_id`),
  KEY `FKiyf57dy48lyiftdrf7y87rnxi` (`user_id`),
  CONSTRAINT `FKa5cmgpp2plp5oai84fkmbi63e` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `FKiyf57dy48lyiftdrf7y87rnxi` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,NULL,'2025-06-16 11:22:17',NULL,NULL,'Mình rất hài lòng với sản phẩm!','https://example.com/images/review5.jpg',5,2,1),(2,NULL,'2025-06-16 11:23:10',NULL,NULL,'Mình rất hài lòng với sản phẩm!','https://example.com/images/review5.jpg',4,3,2),(3,NULL,'2025-06-16 11:24:32',NULL,NULL,'Mình rất hài lòng với sản phẩm!','https://example.com/images/review5.jpg',4,3,6),(6,NULL,'2025-06-16 15:47:55',NULL,NULL,'Mình rất hài lòng với sản phẩm!','https://example.com/images/review5.jpg',3,3,2),(7,NULL,'2025-06-18 12:22:06',NULL,NULL,'Mình rất hài lòng với sản phẩm!','https://example.com/images/review5.jpg',4,3,3),(9,NULL,'2025-06-18 14:45:41',NULL,NULL,'Mình rất hài lòng với sản phẩm!','/reviews/e5e8a578-b4a0-4ba4-b93f-38efe73f3a37_ai-generated-8757301_1280.png',3,21,3),(12,NULL,'2025-06-18 14:46:46',NULL,NULL,'Mình rất hài lòng với sản phẩm!','/reviews/d59cdd55-6adb-4316-a737-78d9e61c8d01_ai-generated-8801420_1280.jpg',3,21,3),(14,NULL,'2025-06-18 14:30:56',NULL,NULL,'','/reviews/eeb18664-6613-462e-b8cb-942a148d0f41_ai-generated-8406366_1280.png',4,21,3);
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `createdby` varchar(255) DEFAULT NULL,
  `createddate` datetime(6) DEFAULT NULL,
  `lastmodifiedby` varchar(255) DEFAULT NULL,
  `lastmodifieddate` datetime(6) DEFAULT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_c36say97xydpmgigg38qv5l2p` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,NULL,NULL,NULL,NULL,'ADMIN','ROLE_ADMIN'),(2,NULL,NULL,NULL,NULL,'USER','ROLE_USER');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shippinginfo`
--

DROP TABLE IF EXISTS `shippinginfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shippinginfo` (
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shippinginfo`
--

LOCK TABLES `shippinginfo` WRITE;
/*!40000 ALTER TABLE `shippinginfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `shippinginfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `createdby` varchar(255) DEFAULT NULL,
  `createddate` datetime(6) DEFAULT NULL,
  `lastmodifiedby` varchar(255) DEFAULT NULL,
  `lastmodifieddate` datetime(6) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `isverified` bit(1) NOT NULL,
  `numberphone` varchar(10) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,NULL,NULL,NULL,NULL,NULL,'adminahihhi@gmail.com',NULL,_binary '\0',NULL,'$2a$10$7UBKsdIhIJk/z.KbpsrQqe5IgbpF5dWfz0oU1yR2d4FHhzuwzAFd2'),(2,NULL,NULL,NULL,NULL,'TP.HCM','admin@gmail.com','admin',_binary '','035538724','$2a$10$7UBKsdIhIJk/z.KbpsrQqe5IgbpF5dWfz0oU1yR2d4FHhzuwzAFd2'),(3,NULL,NULL,NULL,NULL,'TP.HCM','2251120103@ut.edu.vn','Vanphuc',_binary '','0355308724','$2a$10$4TwHd8Wbts38yJ3glA.3pObBKUChMs61/K7PeKtEkhlgbVQKEdRKq'),(4,NULL,NULL,NULL,NULL,NULL,'phuc2704@gmail.com',NULL,_binary '',NULL,'$2a$10$jP9ccAPBWs3KbzCltPQgI.PnrDXzgxx0WIfPzXcRYijnUo1WaK5CC'),(5,NULL,NULL,NULL,NULL,NULL,'phuc27042004@gmail.com',NULL,_binary '',NULL,'$2a$10$1FzD.7l8jV6iRukAyr8p7.23FBYZ67iRaqNiK99Mo686W5wvxJBPa'),(6,NULL,NULL,NULL,NULL,NULL,'abc@gmail.com',NULL,_binary '',NULL,'$2a$10$Zp6hNjDtBHownhQC87NU3.8SHM.RWonlOPcPtYV0sSC4tmayHceem'),(7,NULL,NULL,NULL,NULL,NULL,'abcD@gmail.com',NULL,_binary '',NULL,'$2a$10$BnOp53Vv1fxKOQcFCdWNE.8rMcHPSMfdlAkb5MpW/H5UZ4MmTj5Qm'),(8,NULL,NULL,NULL,NULL,NULL,'bbb@gmail.com',NULL,_binary '',NULL,'$2a$10$Ox7Mb.GSM3nwDGkUpQLFme0q6p116LVFlY9QVmuwZr7cCwveG9HSa'),(9,NULL,NULL,NULL,NULL,NULL,'ahihi@gmail.com',NULL,_binary '',NULL,'$2a$10$PjWj9CZ5crTug3i.AAxxG.RrffOjsV6mCPBZSBwAZyVUtEeJzDaNa'),(10,NULL,NULL,NULL,NULL,NULL,'kk@gmail.com',NULL,_binary '',NULL,'$2a$10$B1zOEoLKg9gKbyRnxivKe.Cl1kpAYO9FxCFo0IItLf3QnPOqvnJm2'),(11,NULL,NULL,NULL,NULL,NULL,'l@gmail.com',NULL,_binary '',NULL,'$2a$10$jX3lJvengVKzZwjQnfI2HuB8IZ0ecPJzf.8cX8JV0iqPxiJ8g1FFe'),(12,NULL,NULL,NULL,NULL,NULL,'phucc@gmail.com',NULL,_binary '',NULL,'$2a$10$g6buhWFNNOcNwgOkRo.ak.uv/CQB2hFO/ebyp.IMxk.Bd3k3HBuEG'),(13,NULL,NULL,NULL,NULL,NULL,'ff@gmail.com',NULL,_binary '',NULL,'$2a$10$forTiJWmx33gh.IYs6FFBOZN2HoT7ZQ2TOEGWgrMyFDunwCTPwa8K'),(14,NULL,NULL,NULL,NULL,NULL,'abce@gmail.com',NULL,_binary '',NULL,'$2a$10$4xQWlIT03pefAGx8sMK0duqhVzXB13HiYrQbzzne6e7k/hvZ.QPdi'),(15,NULL,NULL,NULL,NULL,NULL,'abcg@gmail.com',NULL,_binary '',NULL,'$2a$10$roZOry5hIAXjCkGvXsH6S.zRx.VgLI2ITn3Qz2mYBb7KnbspZs/PG'),(16,NULL,NULL,NULL,NULL,NULL,'aB@gmail.com',NULL,_binary '',NULL,'$2a$10$FDiw70bwq3.tcyeSo7W4cOrl4bj9qVAZHyvFp5Y/Zx5WxEx4ZOB.6'),(17,NULL,NULL,NULL,NULL,NULL,'abcf@gmail.com',NULL,_binary '',NULL,'$2a$10$z0jv6WawLBHld4K1on3ABOfdDTjt4imhfdV5nyn49v1QLiiGfiu56'),(18,NULL,NULL,NULL,NULL,NULL,'hh@gmail.com',NULL,_binary '',NULL,'$2a$10$8aIhnwIS7TjsvS.MSsXCqex5PNSO1ZvcGuN6xAXXl9XaZJmjN4XtC'),(19,NULL,NULL,NULL,NULL,NULL,'abch@gmail.com',NULL,_binary '',NULL,'$2a$10$mcK6S7bqsKVRtYyP/UQzOeJAfNMFI43qN0vjD4GA25GKWaYOZRSRu'),(20,NULL,NULL,NULL,NULL,NULL,'abchh@gmail.com',NULL,_binary '',NULL,'$2a$10$dvsT3mCcSmFkH6zlwpYMTeoXVv7hg.cBz2LiGX5I/8SSgZBX9bcoO'),(21,NULL,NULL,NULL,NULL,NULL,'abchhu@gmail.com',NULL,_binary '',NULL,'$2a$10$PEMa3T632TfUeoUITHAQWuF9CFiz4nfJ.ljEPOpE8JxVcmf09CiAG'),(22,NULL,NULL,NULL,NULL,NULL,'abcj@gmail.com',NULL,_binary '',NULL,'$2a$10$N0Aahy1WV9MkwGInqmgOXexCqVlOoILwRNukYQRBqZruB46ru/AHC'),(23,NULL,NULL,NULL,NULL,'39/11a Duong 102, Tang Nhon Phu A, TP.HCM','abbCF@gmail.com','VanPhuc',_binary '','0355308724','$2a$10$/Txwxr87E2tJ7ELSdvrn9Oo.oPSkHKeoXlSndbFDVfkqBeTDIawdy'),(24,NULL,NULL,NULL,NULL,'39/11a Duong 102, Tang Nhon Phu A, TP.HCM','abcl@gmail.com','VanPhuc',_binary '','0355308724','$2a$10$Q3JQ6gVPCZjhXjlEqQv9x.P5lma/pvQsvAwENm0QFt44MZL8ov5NG'),(25,NULL,NULL,NULL,NULL,NULL,'225112010@ut.edu.vn',NULL,_binary '',NULL,'$2a$10$G1gyATHQ/I1wdgv2R1sBPOY5jZBXwLMHj1OJEqH2DDlHqRcn8Ds2q');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  KEY `FKa68196081fvovjhkek5m97n3y` (`role_id`),
  KEY `FK859n2jvi8ivhui0rl0esws6o` (`user_id`),
  CONSTRAINT `FK859n2jvi8ivhui0rl0esws6o` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKa68196081fvovjhkek5m97n3y` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,2),(2,1),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(11,2),(12,2),(13,2),(14,2),(15,2),(16,2),(17,2),(18,2),(19,2),(20,2),(21,2),(22,2),(23,2),(24,2),(25,2);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_date` datetime(6) NOT NULL,
  `verificationtoken` varchar(200) NOT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_9fdlgo6uhf46n1h3wn4qsbq0c` (`verificationtoken`),
  KEY `FKlhkcrvgj83d37uxew4gvjm684` (`user_id`),
  CONSTRAINT `FKlhkcrvgj83d37uxew4gvjm684` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification`
--

LOCK TABLES `verification` WRITE;
/*!40000 ALTER TABLE `verification` DISABLE KEYS */;
INSERT INTO `verification` VALUES (1,'2025-05-30 21:39:01.526000','405627',1),(14,'2025-05-30 14:45:20.807000','216759',3);
/*!40000 ALTER TABLE `verification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-19 18:05:43
