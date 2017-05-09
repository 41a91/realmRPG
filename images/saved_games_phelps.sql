CREATE DATABASE  IF NOT EXISTS `saved_games` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `saved_games`;
-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: saved_games
-- ------------------------------------------------------
-- Server version	5.6.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `current_games`
--

DROP TABLE IF EXISTS `current_games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `current_games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(12) NOT NULL,
  `password` varchar(255) NOT NULL,
  `player` varchar(10000) DEFAULT NULL,
  `current_map` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `current_games`
--

LOCK TABLES `current_games` WRITE;
/*!40000 ALTER TABLE `current_games` DISABLE KEYS */;
INSERT INTO `current_games` VALUES (13,'41a91','$2y$10$Z35p3ByYaoSGGrSbOG9eKugQbMoiPVmqsV9pFCV1JXKszEM0WLPQS','[47,50,5,5,{\"mouseDown\":false},{},3,3,[90,90,90,16650],2000,480,\"41a91\",2000,480,[[0,10,5,5,{},31,8,39,589],[10,10,5,5,{},1,14,15,489],[20,10,5,5,{},3,15,18,null],[30,10,5,5,{},28,12,40,397],[40,10,5,5,{},42,3,45,713],[50,10,5,5,{},1,13,14,597],[60,30,5,5,{},41,9,50,null]],[[60,10,5,5,{},6,6,12],[70,10,5,5,{},16,9,25],[80,10,5,5,{},17,5,22],[90,10,5,5,{},5,1,6],[0,30,5,5,{},15,14,29],[10,30,5,5,{},16,10,26],[20,30,5,5,{},13,11,24],[30,30,5,5,{},19,11,30],[40,30,5,5,{},44,13,57],[50,30,5,5,{},17,9,26]],[[85,80,5,5,{},\"Fire Ball\",8,30],[90,80,5,5,{},\"Heal\",50,50]],[30,10,5,5,{},45,15,60],[60,10,5,5,{},115,5,120,5008]]','[4,5]'),(14,'g41a91','$2y$10$EMxyr9/d31ETTFBqJqQOaufjxMYaa1CInR576.FMPmdNQWFcy2vue','[70,80,5,5,{\"mouseDown\":false},{},3,3,[5,5,5,1227],200,120,\"g41a91\",198,70,[[0,10,8,8,{},\"Dagger\",6,2,10],[10,10,8,8,{},\"Iron Sword\",3,10,20],[20,10,5,5,{},4,3,7,436]],[],[[85,80,5,5,{},\"Fire Ball\",8,30],[90,80,5,5,{},\"Heal\",50,50]],[10,10,5,5,{},37,8,45],[0,10,8,8,{},\"Leather Armor\",3,20,null]]','[2,3]'),(15,'theGUy','$2y$10$ABM0UZR8zV.GoEjINAAWmOSIikEY9o8NTFIs8bWFId3VuIklw4QgK','[10,50,5,5,{\"mouseDown\":false},{},3,3,[1,1,1,0],100,100,\"theGUy\",100,100,[[10,10,8,8,{},\"Dagger\",6,2,10],[20,10,8,8,{},\"Iron Sword\",3,10,20]],[[0,10,8,8,{},\"Leather Armor\",3,20]],[[0,0,5,5,{},\"Fire Ball\",8,30],[0,0,5,5,{},\"Heal\",50,50]]]','[0,1]'),(16,'theGuyss','$2y$10$PfZonD8PD1kVVHFbrf/Ooe.NhGR2HTp1XMe1Kr3V1DMywBlEDIJNK','[70,80,5,5,{\"mouseDown\":false},{},3,3,[3,3,3,647],150,110,\"theGuyss\",150,110,[[0,10,8,8,{},\"Dagger\",6,2,10],[0,0,5,5,{},23,1,24,647]],[],[[0,0,5,5,{},\"Fire Ball\",8,30],[0,0,5,5,{},\"Heal\",50,50]],[0,10,8,8,{},\"Leather Armor\",3,20],[20,10,8,8,{},\"Iron Sword\",3,10,20]]','[2,3]'),(17,'PowerMan73','$2y$10$n5kJifE/hlYaRuILsXmy2.pW91.OiLdgjTmNetF8IRM98CG.0S39i','[10,50,5,5,{\"mouseDown\":false},{},3,3,[1,1,1,454],100,100,\"PowerMan73\",93,20,[[0,10,8,8,{},\"Dagger\",6,2,10],[10,10,8,8,{},\"Iron Sword\",3,10,20]],[],[[85,80,5,5,{},\"Fire Ball\",8,30],[90,80,5,5,{},\"Heal\",50,50]],[0,10,8,8,{},\"Leather Armor\",3,20],[10,10,5,5,{},4,11,15,454]]','[0,1]'),(18,'bob','$2y$10$3VAHVWO/5G.s5XkcOPJ9audFqVxjpRcMV1VA0vx1Qr5u49pRBI0Y.',NULL,'[0,1]'),(19,'wsdfqwedf','$2y$10$9g9Hrrq8FgisKs3vxzJteuSd3AaBEfZDMWJZ4v4NFk0kvruQGJHkW',NULL,'[0,1]'),(20,'asdfewadfe','$2y$10$ocN7Louwlu5Ir1YuF0G40.nSQKn2sV0Qh8ypLCcYUaxoWW2Te9Hvq',NULL,'[0,1]');
/*!40000 ALTER TABLE `current_games` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-09 11:11:17
