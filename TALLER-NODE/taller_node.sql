CREATE DATABASE IF NOT EXISTS taller_node
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE taller_node;

CREATE TABLE IF NOT EXISTS productos (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    PRIMARY KEY (id)
);