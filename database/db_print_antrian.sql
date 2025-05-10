-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2025 at 09:59 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_antrian`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_antrian`
--

CREATE TABLE `tbl_antrian` (
  `id` int(11) NOT NULL,
  `nama_antrian` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_antrian`
--

INSERT INTO `tbl_antrian` (`id`, `nama_antrian`, `createdAt`, `updatedAt`) VALUES
(2, 'Pasien', '2025-04-17 08:56:26', '2025-04-18 03:10:48'),
(3, 'Donor Darah', '2025-04-17 08:57:07', '2025-04-22 03:33:09'),
(5, 'Sembako', '2025-04-18 02:51:43', '2025-04-18 02:51:43'),
(8, 'MILKTFE', '2025-05-07 06:10:20', '2025-05-07 06:10:20'),
(10, 'MILKLIFE', '2025-05-09 02:34:32', '2025-05-09 02:34:32'),
(11, 'SENENG SOCCER', '2025-05-09 06:06:39', '2025-05-09 06:06:39');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_layout`
--

CREATE TABLE `tbl_layout` (
  `id` int(11) NOT NULL,
  `id_antrian` int(11) NOT NULL,
  `type` enum('text','image','antrian','line') NOT NULL,
  `size_font` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `urutan` varchar(255) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tbl_layout`
--

INSERT INTO `tbl_layout` (`id`, `id_antrian`, `type`, `size_font`, `createdAt`, `updatedAt`, `urutan`, `nama`, `content`) VALUES
(4, 2, 'text', 2, '2025-04-21 02:50:50', '2025-04-24 08:59:44', '1', 'Judul', 'Registrasi'),
(6, 3, 'text', 1, '2025-04-21 06:17:39', '2025-04-28 03:24:05', '1', 'Judul', 'DONOR DARAH'),
(8, 3, 'antrian', 1, '2025-04-21 06:18:59', '2025-04-28 03:26:22', '2', 'Antrian', '26 Mei 2025'),
(12, 2, 'text', 2, '2025-04-24 07:37:08', '2025-04-24 08:59:56', '3', 'Footer', 'Trimakasih'),
(15, 5, 'text', 2, '2025-04-25 02:12:56', '2025-04-25 02:12:56', '1', 'Judul', 'Registrasi'),
(17, 5, 'image', 5, '2025-04-25 02:14:16', '2025-05-08 02:51:29', '3', 'Image', 'http://localhost:3000/uploads/content-2025-5-8-1746672107030.jpg'),
(18, 3, 'text', 1, '2025-04-25 02:46:57', '2025-04-28 03:25:59', '3', 'Footer', 'Bakti Sosial\r\nDjarum Foundation'),
(25, 8, 'image', 1, '2025-05-07 06:21:01', '2025-05-08 05:46:18', '1', 'Image', 'http://localhost:3000/uploads/content-2025-5-8-1746683178490.png'),
(26, 8, 'text', 0, '2025-05-07 06:23:47', '2025-05-08 05:48:28', '2', 'Judul', 'MILKLIFE SOCCER CHELANGE\r\nSEMARANG 2025'),
(27, 8, 'antrian', 0, '2025-05-07 06:24:31', '2025-05-08 07:32:32', '3', 'Antrian', ''),
(28, 8, 'text', 0, '2025-05-07 06:25:54', '2025-05-08 05:48:42', '4', 'Footer', 'TERIMAKASIH'),
(29, 5, 'text', 1, '2025-05-08 02:41:20', '2025-05-08 02:41:20', '3', 'Footer', 'Trimakasih'),
(39, 10, 'image', 1, '2025-05-09 02:35:50', '2025-05-09 02:43:18', '1', 'Image', 'http://localhost:3000/uploads/content-2025-5-9-1746758150945.png'),
(40, 10, 'text', 0, '2025-05-09 02:36:34', '2025-05-09 02:36:54', '2', 'Judul', 'MILKLIFE SOCCER CHELANGE\r\nSEMARANG 2025'),
(41, 10, 'line', 0, '2025-05-09 02:37:56', '2025-05-09 03:02:57', '3', 'Line', '-'),
(42, 10, 'text', 0, '2025-05-09 02:40:06', '2025-05-09 06:55:05', '4', '', 'NOMOR ANTRIAN'),
(43, 10, 'antrian', 1, '2025-05-09 02:40:33', '2025-05-09 05:57:33', '5', 'Antrian', '-'),
(44, 10, 'line', 0, '2025-05-09 02:41:12', '2025-05-09 03:03:06', '6', 'Line', '-'),
(45, 10, 'text', 0, '2025-05-09 02:42:02', '2025-05-09 02:42:02', '7', 'Footer', 'TERIMAKASIH'),
(46, 11, 'image', 0, '2025-05-09 06:07:30', '2025-05-09 06:07:57', '1', 'Image', 'http://localhost:3000/uploads/content-2025-5-9-1746770877321.png'),
(47, 11, 'text', 0, '2025-05-09 06:08:51', '2025-05-09 06:08:51', '2', 'Judul', 'FESTIVAL SENENG SOCCER'),
(48, 11, 'line', 0, '2025-05-09 06:09:07', '2025-05-09 06:09:07', '3', 'Line', '-'),
(49, 11, 'text', 0, '2025-05-09 06:09:55', '2025-05-09 06:13:36', '4', 'Sub', 'NOMOR PERTANDINGAN'),
(50, 11, 'antrian', 2, '2025-05-09 06:10:17', '2025-05-09 06:10:17', '5', 'Antrian', '-');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_antrian`
--
ALTER TABLE `tbl_antrian`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_layout`
--
ALTER TABLE `tbl_layout`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_antrian` (`id_antrian`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_antrian`
--
ALTER TABLE `tbl_antrian`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tbl_layout`
--
ALTER TABLE `tbl_layout`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_layout`
--
ALTER TABLE `tbl_layout`
  ADD CONSTRAINT `tbl_layout_ibfk_1` FOREIGN KEY (`id_antrian`) REFERENCES `tbl_antrian` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
