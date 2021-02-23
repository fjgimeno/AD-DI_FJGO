CREATE DATABASE  IF NOT EXISTS `docencia` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `docencia`;
-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: 51.210.43.140    Database: docencia
-- ------------------------------------------------------
-- Server version	8.0.23-0ubuntu0.20.04.1

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
-- Table structure for table `alumne`
--

DROP TABLE IF EXISTS `alumne`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumne` (
  `id_alumne` int NOT NULL,
  `repetidor` tinyint(1) DEFAULT NULL,
  `curs` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_alumne`),
  CONSTRAINT `FK_alu_user` FOREIGN KEY (`id_alumne`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumne`
--

LOCK TABLES `alumne` WRITE;
/*!40000 ALTER TABLE `alumne` DISABLE KEYS */;
INSERT INTO `alumne` VALUES (4,1,'1'),(5,0,'2'),(6,1,'1');
/*!40000 ALTER TABLE `alumne` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignatura`
--

DROP TABLE IF EXISTS `assignatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignatura` (
  `id_assig` int NOT NULL AUTO_INCREMENT,
  `cod_assig` varchar(3) NOT NULL,
  `nom_assig` varchar(30) NOT NULL,
  `modul` varchar(4) DEFAULT NULL,
  `curs` tinyint DEFAULT NULL,
  `hores` int DEFAULT NULL,
  PRIMARY KEY (`id_assig`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignatura`
--

LOCK TABLES `assignatura` WRITE;
/*!40000 ALTER TABLE `assignatura` DISABLE KEYS */;
INSERT INTO `assignatura` VALUES (1,'PRG','Programació','DAM',1,8),(2,'EDD','Entorns de Desevolupament','DAM',1,3),(3,'LMI','Llenguatge de Marques','DAM',1,3),(4,'BD','Bases de Dades','DAM',1,5),(5,'SI','Sistemes Informàtics','DAM',1,6);
/*!40000 ALTER TABLE `assignatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dni_profe`
--

DROP TABLE IF EXISTS `dni_profe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dni_profe` (
  `dni` varchar(9) NOT NULL,
  PRIMARY KEY (`dni`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dni_profe`
--

LOCK TABLES `dni_profe` WRITE;
/*!40000 ALTER TABLE `dni_profe` DISABLE KEYS */;
INSERT INTO `dni_profe` VALUES ('28656830A'),('30527787W'),('31775555C'),('33166233A'),('43242995M'),('45289658J'),('47779297V'),('57121139H'),('64370675T'),('93342984Z');
/*!40000 ALTER TABLE `dni_profe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missatgeria`
--

DROP TABLE IF EXISTS `missatgeria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `missatgeria` (
  `id_alumne` int NOT NULL,
  `id_profe` int NOT NULL,
  `moment` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `missatge` text NOT NULL,
  `imatge` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_alumne`,`id_profe`,`moment`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missatgeria`
--

LOCK TABLES `missatgeria` WRITE;
/*!40000 ALTER TABLE `missatgeria` DISABLE KEYS */;
/*!40000 ALTER TABLE `missatgeria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id_alumne` int NOT NULL,
  `id_profe` int DEFAULT NULL,
  `id_assig` int NOT NULL,
  `nota` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`id_alumne`,`id_assig`),
  KEY `FK_nota_profe` (`id_profe`),
  KEY `FK_nota_assig` (`id_assig`),
  CONSTRAINT `FK_nota_alu` FOREIGN KEY (`id_alumne`) REFERENCES `alumne` (`id_alumne`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_nota_assig` FOREIGN KEY (`id_assig`) REFERENCES `assignatura` (`id_assig`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_nota_profe` FOREIGN KEY (`id_profe`) REFERENCES `professor` (`id_professor`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CK_nota` CHECK ((`nota` between 0 and 10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (4,2,1,7.60),(4,3,3,3.00),(5,2,4,4.00),(6,2,1,9.40),(6,3,5,6.00);
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor`
--

DROP TABLE IF EXISTS `professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor` (
  `id_professor` int NOT NULL,
  `departament` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_professor`),
  CONSTRAINT `FK_profe_user` FOREIGN KEY (`id_professor`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor`
--

LOCK TABLES `professor` WRITE;
/*!40000 ALTER TABLE `professor` DISABLE KEYS */;
INSERT INTO `professor` VALUES (1,'Ciències'),(2,'Informàtica'),(3,'Informàtica');
/*!40000 ALTER TABLE `professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(40) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `avatar` blob,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Pepe','e10adc3949ba59abbe56e057f20f883e','Pepito Perez',NULL),(2,'Joange','7b24afc8bc80e548d66c4e7ff72171c5','Joan Gerard Camarena',NULL),(3,'Ferran','b94ce3c426a5ab6032624ab62a2b0b95','Ferran Cunyat',NULL),(4,'Ambros','ae415ebbbefdcd443e5c21b37bd917f5','Ambrosio el del osio',NULL),(5,'Puyi','231d175a6f588a685bc28d34133fa5ca','Carles Puyol',NULL),(6,'Bilbo','5f4dcc3b5aa765d61d8327deb882cf99','Bilbo Bolson',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-18  9:20:17
