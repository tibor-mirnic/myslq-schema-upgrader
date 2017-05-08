-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema test
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `test` ;

-- -----------------------------------------------------
-- Schema test
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `test` DEFAULT CHARACTER SET utf8 ;
USE `test` ;

-- -----------------------------------------------------
-- Table `test`.`user`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `test`.`user` ;

CREATE TABLE IF NOT EXISTS `test`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `displayName` VARCHAR(100) NULL,
  `email` VARCHAR(100) NULL,
  `passwordHash` VARCHAR(50) NULL,
  `isAdmin` TINYINT(1) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `test`.`version`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `test`.`version` ;

CREATE TABLE IF NOT EXISTS `test`.`version` (
  `current` NVARCHAR(10) NULL)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

INSERT INTO `version` (`current`) VALUES ('0000');