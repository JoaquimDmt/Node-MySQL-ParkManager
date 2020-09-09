-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mer. 09 sep. 2020 à 19:16
-- Version du serveur :  10.4.10-MariaDB
-- Version de PHP :  7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `park-manager`
--

-- --------------------------------------------------------

--
-- Structure de la table `occupe`
--

DROP TABLE IF EXISTS `occupe`;
CREATE TABLE IF NOT EXISTS `occupe` (
  `id_user` int(11) NOT NULL,
  `id_parking_place` int(11) NOT NULL,
  `debut_occupation` datetime DEFAULT current_timestamp(),
  KEY `id_user` (`id_user`),
  KEY `id_parking_place` (`id_parking_place`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `parking_places`
--

DROP TABLE IF EXISTS `parking_places`;
CREATE TABLE IF NOT EXISTS `parking_places` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `etage` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `parking_places`
--

INSERT INTO `parking_places` (`id`, `etage`) VALUES
(4, 2);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'PUBLIC',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `email`, `mdp`, `role`) VALUES
(1, 'Jojo Testeur', 'testtimestack@gmail.com', '$2b$10$dp3fVWKFxxHokylrFJKXwuYDCnAo2Lrw//rZber8MpNaFALfc8.xa', 'PUBLIC'),
(2, 'Joaquim Dimitrov', 'joaquim.dmt@gmail.com', '$2b$10$LDtkaxzUaKufubT/W0mG9OAno5iPPq8oy8oV.fTu3B9kcG/z7CfgS', 'ADMIN'),
(3, 'Jean Neymar', 'jdmt.contact@joaquim-dimitrov.com', '$2b$10$jgQd3YhCeHTC21FJr7AroudlJN64OBuS/DrhG7koD3NlW2seehJu6', 'PUBLIC');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `occupe`
--
ALTER TABLE `occupe`
  ADD CONSTRAINT `occupe_ibfk_1` FOREIGN KEY (`id_parking_place`) REFERENCES `parking_places` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `occupe_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
