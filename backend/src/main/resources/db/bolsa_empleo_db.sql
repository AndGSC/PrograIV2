CREATE DATABASE IF NOT EXISTS bolsa_empleo_db;
USE bolsa_empleo_db;

CREATE TABLE caracteristicas (
    id_caract INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    id_padre INT DEFAULT NULL,
    CONSTRAINT fk_caract_padre 
        FOREIGN KEY (id_padre) 
        REFERENCES caracteristicas(id_caract)
);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) UNIQUE NOT NULL,
    clave VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('ADMIN', 'EMPRESA', 'OFERENTE') NOT NULL,
    aprobado BOOLEAN DEFAULT FALSE 
);

CREATE TABLE empresas (
    id_empresa INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    localizacion VARCHAR(100),
    telefono INT,
    descripcion TEXT,
    FOREIGN KEY (id_empresa) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE oferentes (
    id_oferente INT PRIMARY KEY,
    identificacion INT UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nacionalidad VARCHAR(50), 
    telefono INT,
    residencia VARCHAR(100),
    curriculum_pdf LONGBLOB,
    FOREIGN KEY (id_oferente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE puestos (
    id_puesto INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    descripcion_general TEXT NOT NULL,
    salario_usd DECIMAL(10, 2) NOT NULL, 
    tipo_publicacion ENUM('PUBLICA', 'PRIVADA') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE
);

CREATE TABLE puesto_caracteristica (
    id_puesto INT,
    id_caract INT,
    nivel_requerido INT NOT NULL CHECK (nivel_requerido  BETWEEN 1 AND 5),
    PRIMARY KEY (id_puesto, id_caract),
    FOREIGN KEY (id_puesto) REFERENCES puestos(id_puesto),
    FOREIGN KEY (id_caract) REFERENCES caracteristicas(id_caract)
);

CREATE TABLE oferente_caracteristica (
    id_oferente INT,
    id_caract INT,
    nivel INT NOT NULL CHECK (nivel BETWEEN 1 AND 5),
    PRIMARY KEY (id_oferente, id_caract),
    FOREIGN KEY (id_oferente) REFERENCES oferentes(id_oferente),
    FOREIGN KEY (id_caract) REFERENCES caracteristicas(id_caract)
);

