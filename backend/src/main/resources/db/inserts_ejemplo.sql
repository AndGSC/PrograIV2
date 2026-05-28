USE bolsa_empleo_db;

-- Limpiar datos previos para insertar en limpio
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE puesto_caracteristica;
TRUNCATE TABLE oferente_caracteristica;
TRUNCATE TABLE puestos;
TRUNCATE TABLE empresas;
TRUNCATE TABLE oferentes;
TRUNCATE TABLE caracteristicas;
TRUNCATE TABLE usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- USUARIOS (Contraseña "123456" para todos)
INSERT INTO usuarios (correo, clave, tipo_usuario, aprobado) VALUES
                                                                 ('admin1@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'ADMIN', TRUE),    -- ID 1
                                                                 ('empresa1@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'EMPRESA', TRUE), -- ID 2
                                                                 ('empresa2@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'EMPRESA', TRUE), -- ID 3
                                                                 ('empresa3@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'EMPRESA', TRUE), -- ID 4
                                                                 ('empresa4@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'EMPRESA', TRUE), -- ID 5
                                                                 ('oferente1@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'OFERENTE', TRUE), -- ID 6
                                                                 ('oferente2@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'OFERENTE', TRUE), -- ID 7
                                                                 ('oferente3@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'OFERENTE', TRUE), -- ID 8
                                                                 ('oferente4@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'OFERENTE', TRUE), -- ID 9
                                                                 ('oferente5@test.com', '$2a$10$WOIEt.wkDf1mqdtIElBNxO9l672tpv.JpmeOq6XXd/dn.LFtZB.cO', 'OFERENTE', TRUE); -- ID 10

-- EMPRESAS
INSERT INTO empresas (id_empresa, nombre, localizacion, telefono, descripcion) VALUES
                                                                                   (2, 'Tech Solutions', 'San José', 22223333, 'Empresa líder en desarrollo Java y Backend'),
                                                                                   (3, 'Global Corp', 'Heredia', 22334455, 'Consultoría especializada en Análisis de Datos'),
                                                                                   (4, 'Innova CR', 'Alajuela', 22445566, 'Agencia de desarrollo Frontend y UX'),
                                                                                   (5, 'DataSys', 'Cartago', 22556677, 'Expertos en gestión de Bases de Datos y Seguridad');

-- OFERENTES
INSERT INTO oferentes (id_oferente, identificacion, nombre, apellido, nacionalidad, telefono, residencia) VALUES
                                                                                                              (6, 101, 'Juan', 'Pérez', 'Costarricense', 88881111, 'San José'),
                                                                                                              (7, 102, 'Ana', 'Gómez', 'Costarricense', 88882222, 'Heredia'),
                                                                                                              (8, 103, 'Luis', 'Ramírez', 'Costarricense', 88883333, 'Alajuela'),
                                                                                                              (9, 104, 'María', 'Lopez', 'Costarricense', 88884444, 'Cartago'),
                                                                                                              (10, 105, 'Carlos', 'Vargas', 'Costarricense', 88885555, 'Limón');

-- CARACTERÍSTICAS
INSERT INTO caracteristicas (nombre, id_padre) VALUES
                                                   ('Programación', NULL),  -- ID 1
                                                   ('Java', 1),             -- ID 2
                                                   ('Python', 1),           -- ID 3
                                                   ('Bases de Datos', NULL),-- ID 4
                                                   ('MySQL', 4),            -- ID 5
                                                   ('PostgreSQL', 4),       -- ID 6
                                                   ('Frontend', NULL),      -- ID 7
                                                   ('HTML', 7),             -- ID 8
                                                   ('CSS', 7),              -- ID 9
                                                   ('JavaScript', 7);       -- ID 10

-- PUESTOS
INSERT INTO puestos (id_empresa, descripcion_general, salario_usd, tipo_publicacion, activo) VALUES
                                                                                                 (2, 'Desarrollador Java Junior', 1200.00, 'PUBLICA', TRUE),  -- ID 1
                                                                                                 (2, 'Backend Developer (Python)', 1500.00, 'PRIVADA', TRUE), -- ID 2
                                                                                                 (3, 'Analista de Datos Senior', 2400.00, 'PUBLICA', TRUE),   -- ID 3
                                                                                                 (4, 'Frontend Developer', 1300.00, 'PUBLICA', TRUE),        -- ID 4
                                                                                                 (5, 'Administrador de BD MySQL', 1600.00, 'PRIVADA', TRUE),  -- ID 5
                                                                                                 (2, 'Fullstack Dev', 1800.00, 'PUBLICA', TRUE);             -- ID 6

-- CARACTERÍSTICAS A PUESTOS
-- ID 1 (Java Junior): Java (Nivel 3)
INSERT INTO puesto_caracteristica (id_puesto, id_caract, nivel_requerido) VALUES (1, 2, 3);
-- ID 2 (Backend Python): Python (Nivel 4), PostgreSQL (Nivel 3)
INSERT INTO puesto_caracteristica (id_puesto, id_caract, nivel_requerido) VALUES (2, 3, 4), (2, 6, 3);
-- ID 3 (Analista): Python (Nivel 5), MySQL (Nivel 4)
INSERT INTO puesto_caracteristica (id_puesto, id_caract, nivel_requerido) VALUES (3, 3, 5), (3, 5, 4);
-- ID 4 (Frontend): JavaScript (Nivel 4), HTML (Nivel 5)
INSERT INTO puesto_caracteristica (id_puesto, id_caract, nivel_requerido) VALUES (4, 10, 4), (4, 8, 5);
-- ID 5 (DBA): MySQL (Nivel 5)
INSERT INTO puesto_caracteristica (id_puesto, id_caract, nivel_requerido) VALUES (5, 5, 5);
-- ID 6 (Fullstack): Java (Nivel 3), JavaScript (Nivel 3)
INSERT INTO puesto_caracteristica (id_puesto, id_caract, nivel_requerido) VALUES (6, 2, 3), (6, 10, 3);

-- CARACTERÍSTICAS A OFERENTES
-- Juan Pérez: Java (Nivel 4), MySQL (Nivel 3) -> Match con Puesto 1 y 6
INSERT INTO oferente_caracteristica (id_oferente, id_caract, nivel) VALUES (6, 2, 4), (6, 5, 3);
-- Ana Gómez: Python (Nivel 5), PostgreSQL (Nivel 4) -> Match con Puesto 2 y 3
INSERT INTO oferente_caracteristica (id_oferente, id_caract, nivel) VALUES (7, 3, 5), (7, 6, 4);
-- María López: HTML (Nivel 5), CSS (Nivel 5), JavaScript (Nivel 5) -> Match con Puesto 4
INSERT INTO oferente_caracteristica (id_oferente, id_caract, nivel) VALUES (9, 8, 5), (9, 9, 5), (9, 10, 5);
-- Carlos Vargas: Java (Nivel 2), Python (Nivel 2)
INSERT INTO oferente_caracteristica (id_oferente, id_caract, nivel) VALUES (10, 2, 2), (10, 3, 2);
