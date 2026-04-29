SET NAMES utf8mb4;

-- =========================
-- CREATE TABLES
-- =========================

CREATE TABLE IF NOT EXISTS users
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME(6) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    name       VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS courses
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at  DATETIME(6) NULL,
    description VARCHAR(255) NULL,
    name        VARCHAR(255) NULL,
    creator_id  BIGINT NULL,
    CONSTRAINT fk_courses_users
        FOREIGN KEY (creator_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS projects
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at  DATETIME(6) NULL,
    description VARCHAR(255) NULL,
    name        VARCHAR(255) NULL,
    course_id   BIGINT NULL,
    creator_id  BIGINT NULL,
    CONSTRAINT fk_projects_users
        FOREIGN KEY (creator_id) REFERENCES users (id),
    CONSTRAINT fk_projects_course
        FOREIGN KEY (course_id) REFERENCES courses (id)
);

CREATE TABLE IF NOT EXISTS project_members
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    role       ENUM('MEMBER', 'OWNER') NOT NULL,
    project_id BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    CONSTRAINT fk_pm_project
        FOREIGN KEY (project_id) REFERENCES projects (id),
    CONSTRAINT fk_pm_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS user_courses
(
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    user_id   BIGINT NOT NULL,
    CONSTRAINT fk_uc_course
        FOREIGN KEY (course_id) REFERENCES courses (id),
    CONSTRAINT fk_uc_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS tasks
(
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at       DATETIME(6) NULL,
    description      TEXT NULL,
    status           ENUM('TODO', 'IN_PROGRESS', 'DONE') NOT NULL,
    title            VARCHAR(255) NOT NULL,
    assigned_user_id BIGINT NULL,
    project_id       BIGINT NOT NULL,
    CONSTRAINT fk_task_user
        FOREIGN KEY (assigned_user_id) REFERENCES users (id),
    CONSTRAINT fk_task_project
        FOREIGN KEY (project_id) REFERENCES projects (id)
);

CREATE TABLE IF NOT EXISTS comments
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    content    TEXT NOT NULL,
    created_at DATETIME(6) NULL,
    task_id    BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    CONSTRAINT fk_comment_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_comment_task
        FOREIGN KEY (task_id) REFERENCES tasks (id)
);

-- =========================
-- INSERT DATA (USING FIXED IDs)
-- =========================

-- USERS
INSERT INTO users (id, created_at, email, name, password) VALUES
(1, NOW(), 'yulieth@uts.edu.co', 'Yulieth Moreno', '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(2, NOW(), 'ana@uts.edu.co', 'Ana Torres', '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(3, NOW(), 'carlos@uts.edu.co', 'Carlos Ruiz', '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(4, NOW(), 'laura@uts.edu.co', 'Laura Gomez', '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(5, NOW(), 'miguel@uts.edu.co', 'Miguel Perez', '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO');

-- PROJECTS
INSERT INTO projects (id, created_at, description, name, creator_id) VALUES
(1, NOW(), 'Sistema de gestión de tareas personales diseñado para optimizar el flujo de trabajo diario mediante priorización inteligente y seguimiento de hábitos.', 'TaskFlow Personal', 1),
(2, NOW(), 'Desarrollo de una interfaz de programación de aplicaciones robusta utilizando arquitectura RESTful, enfocada en la escalabilidad y seguridad de los datos.', 'API Development', 1),
(3, NOW(), 'Aplicación de interfaz de usuario moderna y responsiva, integrada con componentes reactivos para mejorar la interactividad y la experiencia del cliente final.', 'Frontend App', 2),
(4, NOW(), 'Implementación de un entorno de pruebas automatizadas y control de calidad para asegurar la estabilidad del software antes de su despliegue en producción.', 'QA Testing', 3);

-- PROJECT MEMBERS
INSERT INTO project_members (id, role, project_id, user_id) VALUES
(1, 'OWNER', 1, 1),

(2, 'OWNER', 2, 1),
(3, 'MEMBER', 2, 2),
(4, 'MEMBER', 2, 3),

(5, 'OWNER', 3, 2),
(6, 'MEMBER', 3, 1),
(7, 'MEMBER', 3, 4),

(8, 'OWNER', 4, 3),
(9, 'MEMBER', 4, 4),
(10, 'MEMBER', 4, 5);

-- TASKS
INSERT INTO tasks (id, created_at, description, status, title, assigned_user_id, project_id) VALUES
(1, NOW(), 'Configuración del entorno de desarrollo local, incluyendo la instanciación de la base de datos y variables de entorno necesarias.', 'DONE', 'Setup inicial de entorno', 1, 1),
(2, NOW(), 'Definición y codificación de los puntos de acceso REST para la gestión CRUD de la entidad usuarios bajo estándares de arquitectura limpia.', 'IN_PROGRESS', 'Implementación de Endpoints: Usuarios', 2, 2),
(3, NOW(), 'Integración de JSON Web Tokens para el manejo de sesiones y protección de rutas privadas en el servidor backend.', 'TODO', 'Implementación de Seguridad JWT', 1, 2),
(4, NOW(), 'Creación de esquemas visuales y maquetación de la estructura base utilizando principios de diseño atómico y componentes reutilizables.', 'TODO', 'Diseño de Layout Estructural', 4, 3),
(5, NOW(), 'Sincronización de los servicios de frontend con el backend mediante el consumo de servicios asíncronos y manejo de estados globales.', 'TODO', 'Integración de Servicios API', 1, 3),
(6, NOW(), 'Documentación y ejecución de la suite de pruebas unitarias para validar la integridad de los componentes críticos del sistema.', 'TODO', 'Elaboración de Casos de Prueba', 5, 4);

-- COMMENTS
INSERT INTO comments (id, content, created_at, task_id, user_id) VALUES
(1, 'He iniciado formalmente con la codificación de la lógica de negocio. Actualmente me encuentro configurando la capa de persistencia y las validaciones de entrada para los endpoints solicitados.', NOW(), 2, 2),
(2, 'Es imperativo realizar una revisión exhaustiva de los encabezados de seguridad y el tiempo de expiración de los tokens antes de proceder con el despliegue a la rama de integración.', NOW(), 3, 1),
(3, 'Los prototipos de alta fidelidad y la estructura base del layout se encuentran finalizados al 90%. Procederé a realizar las pruebas de responsividad en diferentes resoluciones.', NOW(), 4, 4);

-- EXAMPLE DATA

-- =========================
-- NUEVOS USUARIOS (IDs 6-15)
-- =========================
INSERT INTO users (id, created_at, email, name, password) VALUES
(6,  '2024-08-10 09:00:00', 'sofia@uts.edu.co',    'Sofia Vargas',    '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(7,  '2024-08-15 10:00:00', 'andres@uts.edu.co',   'Andrés Molina',   '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(8,  '2024-09-01 08:30:00', 'valentina@uts.edu.co','Valentina Rios',  '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(9,  '2024-09-10 11:00:00', 'juan@uts.edu.co',     'Juan Herrera',    '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(10, '2024-09-20 14:00:00', 'camila@uts.edu.co',   'Camila Ortega',   '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(11, '2024-10-01 09:00:00', 'felipe@uts.edu.co',   'Felipe Castro',   '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(12, '2024-10-05 10:30:00', 'natalia@uts.edu.co',  'Natalia Duarte',  '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(13, '2024-10-15 08:00:00', 'sebastian@uts.edu.co','Sebastián Mora',  '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(14, '2024-11-01 13:00:00', 'mariana@uts.edu.co',  'Mariana Leon',    '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO'),
(15, '2024-11-10 09:30:00', 'diego@uts.edu.co',    'Diego Salazar',   '$2a$10$67kEXyltUvFj6clpH38sU.inz79sQapWsErnbVrRnVK1/sbbtixxO');
 
-- =========================
-- CURSOS (IDs 1-5)
-- Creados por Deiby (id=1) como docente/administrador
-- =========================
INSERT INTO courses (id, created_at, name, description, creator_id) VALUES
(1, '2024-07-15 08:00:00', 'Desarrollo de Aplicaciones Empresariales',
    'Curso enfocado en el diseño y construcción de sistemas de software para entornos corporativos, integrando patrones de arquitectura y buenas prácticas.', 1),
(2, '2024-07-20 09:00:00', 'Nuevas Tecnologías de Desarrollo',
    'Exploración de herramientas y frameworks modernos: contenedores, serverless, IA generativa aplicada al desarrollo y DevOps avanzado.', 1),
(3, '2024-08-01 08:00:00', 'Programación Web',
    'Desarrollo full-stack con tecnologías actuales del ecosistema web, desde HTML/CSS hasta APIs REST y frameworks de JavaScript.', 2),
(4, '2024-08-10 10:00:00', 'Aplicaciones Móviles',
    'Diseño y desarrollo de aplicaciones nativas e híbridas para iOS y Android, con enfoque en experiencia de usuario y rendimiento.', 3),
(5, '2024-08-20 08:30:00', 'Programación Orientada a Objetos',
    'Fundamentos y patrones avanzados de POO aplicados con Java y Python, cubriendo herencia, polimorfismo, encapsulamiento y diseño SOLID.', 1);
 
-- =========================
-- INSCRIPCIONES A CURSOS
-- =========================
INSERT INTO user_courses (id, course_id, user_id) VALUES
-- Curso 1: Desarrollo de Aplicaciones Empresariales
(1,  1, 1), (2,  1, 2), (3,  1, 3), (4,  1, 6), (5,  1, 7), (6,  1, 9), (7,  1, 11), (8,  1, 13),
-- Curso 2: Nuevas Tecnologías de Desarrollo
(9,  2, 1), (10, 2, 4), (11, 2, 6), (12, 2, 8), (13, 2, 10), (14, 2, 12), (15, 2, 14),
-- Curso 3: Programación Web
(16, 3, 1), (17, 3, 2), (18, 3, 5), (19, 3, 7), (20, 3, 8), (21, 3, 9), (22, 3, 15),
-- Curso 4: Aplicaciones Móviles
(23, 4, 1), (24, 4, 3), (25, 4, 5), (26, 4, 10), (27, 4, 11), (28, 4, 13), (29, 4, 15),
-- Curso 5: Programación Orientada a Objetos
(30, 5, 1), (31, 5, 2), (32, 5, 4), (33, 5, 6), (34, 5, 12), (35, 5, 14);
 
-- =========================
-- PROYECTOS (IDs 5-22)
-- Los IDs 1-4 ya existen en el schema original
-- Distribución 2025: 18 proyectos
--   Feb: 1 | Mar: 3 | Abr: 2 | May: 2 | Jun: 2 | Jul: 2 | Ago: 2 | Sep: 2 | Oct: 1 | Nov: 1
-- =========================
INSERT INTO projects (id, created_at, name, description, course_id, creator_id) VALUES
 
-- ── FEBRERO (1 proyecto) ──────────────────────────────────────────────────────
(5,  '2025-02-03 09:15:00',
     'Sistema de Nómina Empresarial',
     'Desarrollo de un sistema integral para la gestión de nómina, liquidaciones y reportes de RRHH.',
     1, 1),
 
-- ── MARZO (3 proyectos) ──────────────────────────────────────────────────────
(6,  '2025-03-05 10:00:00',
     'Plataforma E-Learning',
     'Sistema web para la gestión de cursos online, evaluaciones y seguimiento de estudiantes.',
     3, 2),
 
(7,  '2025-03-12 08:45:00',
     'App de Inventarios con IA',
     'Aplicación empresarial que usa modelos de IA para predicción de stock y alertas automáticas.',
     2, 1),
 
(8,  '2025-03-25 14:00:00',
     'Portal de Empleados',
     'Portal interno para la gestión de solicitudes, permisos, certificados y comunicaciones de RRHH.',
     1, 6),
 
-- ── ABRIL (2 proyectos) ──────────────────────────────────────────────────────
(9,  '2025-04-02 09:30:00',
     'App Móvil de Delivery',
     'Aplicación nativa para pedidos a domicilio con seguimiento en tiempo real y pagos integrados.',
     4, 3),
 
(10, '2025-04-18 11:00:00',
     'Gestor de Proyectos POO',
     'Herramienta de gestión de proyectos construida aplicando estrictamente principios SOLID y patrones de diseño.',
     5, 1),
 
-- ── MAYO (2 proyectos) ───────────────────────────────────────────────────────
(11, '2025-05-06 08:00:00',
     'Microservicios de Pagos',
     'Arquitectura de microservicios para procesamiento de pagos, integración con PSPs y manejo de webhooks.',
     2, 1),
 
(12, '2025-05-20 13:30:00',
     'Landing Page Corporativa',
     'Sitio web corporativo responsive con animaciones, formularios de contacto y optimización SEO.',
     3, 7),
 
-- ── JUNIO (2 proyectos) ──────────────────────────────────────────────────────
(13, '2025-06-03 09:00:00',
     'CRM para PYMES',
     'Sistema de gestión de clientes y oportunidades comerciales adaptado para pequeñas y medianas empresas.',
     1, 1),
 
(14, '2025-06-17 10:45:00',
     'App Móvil de Finanzas Personales',
     'Aplicación móvil para control de gastos, presupuestos y metas de ahorro con sincronización en la nube.',
     4, 10),
 
-- ── JULIO (2 proyectos) ──────────────────────────────────────────────────────
(15, '2025-07-01 08:30:00',
     'Pipeline CI/CD con Docker',
     'Implementación de pipelines de integración y despliegue continuo usando Docker, GitHub Actions y Kubernetes.',
     2, 1),
 
(16, '2025-07-14 11:00:00',
     'Red Social Universitaria',
     'Plataforma web tipo red social para estudiantes: foros, grupos de estudio y compartición de recursos.',
     3, 8),
 
-- ── AGOSTO (2 proyectos) ─────────────────────────────────────────────────────
(17, '2025-08-05 09:15:00',
     'Sistema de Reservas Online',
     'Plataforma para reservas de espacios, citas y servicios con calendario interactivo y notificaciones.',
     1, 1),
 
(18, '2025-08-19 14:00:00',
     'App de Salud y Bienestar',
     'Aplicación móvil para seguimiento de hábitos, ejercicio y nutrición con integración a wearables.',
     4, 11),
 
-- ── SEPTIEMBRE (2 proyectos) ─────────────────────────────────────────────────
(19, '2025-09-08 10:00:00',
     'Framework ORM Personalizado',
     'Desarrollo de un ORM ligero en Java aplicando patrones Repository, Unit of Work y reflexión.',
     5, 1),
 
(20, '2025-09-22 09:30:00',
     'Dashboard Analytics Web',
     'Panel de analítica en tiempo real con gráficos interactivos, filtros y exportación de reportes.',
     3, 9),
 
-- ── OCTUBRE (1 proyecto) ─────────────────────────────────────────────────────
(21, '2025-10-07 08:00:00',
     'Chatbot Empresarial con LLM',
     'Chatbot integrado con modelos de lenguaje para soporte interno, FAQs y gestión de tickets.',
     2, 1),
 
-- ── NOVIEMBRE (1 proyecto) ───────────────────────────────────────────────────
(22, '2025-11-03 09:45:00',
     'E-Commerce con Arquitectura Hexagonal',
     'Tienda online construida bajo arquitectura hexagonal, con dominio rico, puertos y adaptadores.',
     1, 1);
 
-- =========================
-- MIEMBROS DE PROYECTOS
-- Deiby (id=1) aparece en todos los proyectos
-- =========================
INSERT INTO project_members (id, role, project_id, user_id) VALUES
 
-- Proyectos originales (1-4) - Deiby ya está, agregamos más miembros
(11, 'MEMBER', 1, 6),
(12, 'MEMBER', 2, 7),
(13, 'MEMBER', 3, 8),
(14, 'MEMBER', 4, 9),
 
-- Proyecto 5: Sistema de Nómina Empresarial
(15, 'OWNER',  5, 1),
(16, 'MEMBER', 5, 2),
(17, 'MEMBER', 5, 6),
(18, 'MEMBER', 5, 9),
(19, 'MEMBER', 5, 11),
 
-- Proyecto 6: Plataforma E-Learning
(20, 'OWNER',  6, 2),
(21, 'MEMBER', 6, 1),
(22, 'MEMBER', 6, 7),
(23, 'MEMBER', 6, 8),
(24, 'MEMBER', 6, 15),
 
-- Proyecto 7: App de Inventarios con IA
(25, 'OWNER',  7, 1),
(26, 'MEMBER', 7, 4),
(27, 'MEMBER', 7, 6),
(28, 'MEMBER', 7, 12),
(29, 'MEMBER', 7, 14),
 
-- Proyecto 8: Portal de Empleados
(30, 'OWNER',  8, 6),
(31, 'MEMBER', 8, 1),
(32, 'MEMBER', 8, 2),
(33, 'MEMBER', 8, 9),
(34, 'MEMBER', 8, 13),
 
-- Proyecto 9: App Móvil de Delivery
(35, 'OWNER',  9, 3),
(36, 'MEMBER', 9, 1),
(37, 'MEMBER', 9, 5),
(38, 'MEMBER', 9, 10),
(39, 'MEMBER', 9, 15),
 
-- Proyecto 10: Gestor de Proyectos POO
(40, 'OWNER',  10, 1),
(41, 'MEMBER', 10, 2),
(42, 'MEMBER', 10, 4),
(43, 'MEMBER', 10, 12),
 
-- Proyecto 11: Microservicios de Pagos
(44, 'OWNER',  11, 1),
(45, 'MEMBER', 11, 3),
(46, 'MEMBER', 11, 6),
(47, 'MEMBER', 11, 7),
(48, 'MEMBER', 11, 14),
 
-- Proyecto 12: Landing Page Corporativa
(49, 'OWNER',  12, 7),
(50, 'MEMBER', 12, 1),
(51, 'MEMBER', 12, 8),
(52, 'MEMBER', 12, 15),
 
-- Proyecto 13: CRM para PYMES
(53, 'OWNER',  13, 1),
(54, 'MEMBER', 13, 2),
(55, 'MEMBER', 13, 9),
(56, 'MEMBER', 13, 11),
(57, 'MEMBER', 13, 13),
 
-- Proyecto 14: App Móvil de Finanzas Personales
(58, 'OWNER',  14, 10),
(59, 'MEMBER', 14, 1),
(60, 'MEMBER', 14, 5),
(61, 'MEMBER', 14, 11),
(62, 'MEMBER', 14, 15),
 
-- Proyecto 15: Pipeline CI/CD con Docker
(63, 'OWNER',  15, 1),
(64, 'MEMBER', 15, 4),
(65, 'MEMBER', 15, 6),
(66, 'MEMBER', 15, 12),
(67, 'MEMBER', 15, 14),
 
-- Proyecto 16: Red Social Universitaria
(68, 'OWNER',  16, 8),
(69, 'MEMBER', 16, 1),
(70, 'MEMBER', 16, 7),
(71, 'MEMBER', 16, 9),
(72, 'MEMBER', 16, 15),
 
-- Proyecto 17: Sistema de Reservas Online
(73, 'OWNER',  17, 1),
(74, 'MEMBER', 17, 2),
(75, 'MEMBER', 17, 6),
(76, 'MEMBER', 17, 13),
 
-- Proyecto 18: App de Salud y Bienestar
(77, 'OWNER',  18, 11),
(78, 'MEMBER', 18, 1),
(79, 'MEMBER', 18, 5),
(80, 'MEMBER', 18, 10),
(81, 'MEMBER', 18, 15),
 
-- Proyecto 19: Framework ORM Personalizado
(82, 'OWNER',  19, 1),
(83, 'MEMBER', 19, 4),
(84, 'MEMBER', 19, 6),
(85, 'MEMBER', 19, 12),
 
-- Proyecto 20: Dashboard Analytics Web
(86, 'OWNER',  20, 9),
(87, 'MEMBER', 20, 1),
(88, 'MEMBER', 20, 7),
(89, 'MEMBER', 20, 8),
(90, 'MEMBER', 20, 15),
 
-- Proyecto 21: Chatbot Empresarial con LLM
(91, 'OWNER',  21, 1),
(92, 'MEMBER', 21, 6),
(93, 'MEMBER', 21, 12),
(94, 'MEMBER', 21, 14),
 
-- Proyecto 22: E-Commerce con Arquitectura Hexagonal
(95, 'OWNER',  22, 1),
(96, 'MEMBER', 22, 2),
(97, 'MEMBER', 22, 7),
(98, 'MEMBER', 22, 9),
(99, 'MEMBER', 22, 13);
 
-- =========================
-- TAREAS (IDs 7-70)
-- Los IDs 1-6 ya existen en el schema original
-- ~3-4 tareas por proyecto nuevo
-- =========================
INSERT INTO tasks (id, created_at, description, status, title, assigned_user_id, project_id) VALUES
 
-- Proyecto 5: Sistema de Nómina Empresarial
(7,  '2025-02-03 09:30:00', 'Diseñar el modelo de base de datos para empleados, contratos y conceptos de nómina.', 'DONE',        'Modelado de base de datos',             1,    5),
(8,  '2025-02-05 10:00:00', 'Implementar el módulo de liquidación mensual con todos los conceptos salariales.', 'DONE',        'Módulo de liquidación',                 2,    5),
(9,  '2025-02-10 08:00:00', 'Crear los reportes en PDF de desprendibles de pago por empleado.',                 'IN_PROGRESS', 'Generación de desprendibles PDF',       6,    5),
(10, '2025-02-14 11:00:00', 'Integrar con el sistema de RRHH existente mediante APIs REST.',                    'TODO',        'Integración con RRHH',                  9,    5),
(11, '2025-02-18 09:00:00', 'Implementar dashboard con indicadores clave de nómina para gerencia.',             'TODO',        'Dashboard ejecutivo',                   1,    5),
 
-- Proyecto 6: Plataforma E-Learning
(12, '2025-03-05 10:30:00', 'Diseñar arquitectura de la plataforma y definir tecnologías del stack.',           'DONE',        'Arquitectura del sistema',              2,    6),
(13, '2025-03-07 09:00:00', 'Desarrollar módulo de autenticación con OAuth2 y JWT.',                           'DONE',        'Autenticación y autorización',          1,    6),
(14, '2025-03-12 08:00:00', 'Implementar reproductor de videos con control de progreso por lección.',           'IN_PROGRESS', 'Reproductor de contenido',             7,    6),
(15, '2025-03-15 14:00:00', 'Crear sistema de evaluaciones con preguntas de opción múltiple y calificación.',  'IN_PROGRESS', 'Módulo de evaluaciones',               8,    6),
(16, '2025-03-20 11:00:00', 'Construir panel de administración para docentes: gestión de cursos y alumnos.',   'TODO',        'Panel de administración docente',       2,    6),
 
-- Proyecto 7: App de Inventarios con IA
(17, '2025-03-12 09:00:00', 'Configurar pipeline de datos para entrenamiento del modelo de predicción de stock.','DONE',       'Pipeline de datos IA',                  1,    7),
(18, '2025-03-15 10:00:00', 'Desarrollar API REST para gestión de productos, categorías y bodegas.',            'DONE',        'API REST de inventarios',               4,    7),
(19, '2025-03-18 08:30:00', 'Integrar modelo de predicción de demanda con alertas automáticas por email/SMS.', 'IN_PROGRESS', 'Sistema de alertas inteligentes',       6,    7),
(20, '2025-03-22 13:00:00', 'Construir interfaz web para visualización de stock y predicciones.',               'TODO',        'Interfaz de visualización',            12,    7),
 
-- Proyecto 8: Portal de Empleados
(21, '2025-03-25 14:30:00', 'Definir flujos de trabajo para solicitudes de permisos y aprobaciones.',           'DONE',        'Flujos de solicitudes',                 6,    8),
(22, '2025-03-28 09:00:00', 'Desarrollar módulo de gestión de permisos y vacaciones con calendario.',           'DONE',        'Módulo de permisos',                    1,    8),
(23, '2025-04-02 10:00:00', 'Implementar sistema de notificaciones internas push y por correo.',                'IN_PROGRESS', 'Sistema de notificaciones',             2,    8),
(24, '2025-04-05 08:00:00', 'Crear módulo de generación de certificados laborales en PDF.',                     'TODO',        'Certificados laborales',                9,    8),
 
-- Proyecto 9: App Móvil de Delivery
(25, '2025-04-02 10:00:00', 'Diseñar wireframes y prototipo de UI para app de pedidos en Figma.',               'DONE',        'Diseño UI/UX',                          3,    9),
(26, '2025-04-05 09:00:00', 'Implementar pantallas de login, registro y gestión de perfil de usuario.',         'DONE',        'Autenticación móvil',                   1,    9),
(27, '2025-04-10 08:30:00', 'Desarrollar pantalla de catálogo de productos con búsqueda y filtros.',            'IN_PROGRESS', 'Catálogo de productos',                 5,    9),
(28, '2025-04-14 11:00:00', 'Integrar pasarela de pagos y flujo completo de checkout.',                        'TODO',        'Integración de pagos',                 10,    9),
(29, '2025-04-18 13:00:00', 'Implementar seguimiento de pedido en tiempo real con WebSockets.',                 'TODO',        'Tracking en tiempo real',               1,    9),
 
-- Proyecto 10: Gestor de Proyectos POO
(30, '2025-04-18 11:30:00', 'Modelar las clases del dominio aplicando principios SOLID y documentarlas.',       'DONE',        'Modelado del dominio OO',               1,   10),
(31, '2025-04-22 09:00:00', 'Implementar patrón Observer para notificaciones de cambio de estado de tarea.',   'DONE',        'Patrón Observer',                       2,   10),
(32, '2025-04-28 10:00:00', 'Desarrollar patrón Strategy para diferentes algoritmos de priorización.',         'IN_PROGRESS', 'Patrón Strategy',                       4,   10),
(33, '2025-05-02 08:00:00', 'Escribir suite completa de pruebas unitarias con JUnit 5 y Mockito.',              'TODO',        'Pruebas unitarias',                    12,   10),
 
-- Proyecto 11: Microservicios de Pagos
(34, '2025-05-06 08:30:00', 'Diseñar la arquitectura de microservicios y definir contratos de APIs.',           'DONE',        'Arquitectura de microservicios',        1,   11),
(35, '2025-05-09 09:00:00', 'Implementar servicio de autenticación y gestión de tokens entre servicios.',       'DONE',        'Servicio de autenticación',             6,   11),
(36, '2025-05-14 10:00:00', 'Desarrollar servicio de procesamiento de pagos con integración a Stripe.',         'IN_PROGRESS', 'Servicio de pagos',                     1,   11),
(37, '2025-05-20 08:00:00', 'Implementar manejo de webhooks y eventos asincrónicos con Kafka.',                 'IN_PROGRESS', 'Sistema de eventos con Kafka',          7,   11),
(38, '2025-05-26 13:00:00', 'Configurar API Gateway y documentar todos los endpoints con Swagger.',             'TODO',        'API Gateway y documentación',          14,   11),
 
-- Proyecto 12: Landing Page Corporativa
(39, '2025-05-20 14:00:00', 'Crear diseño visual en Figma: paleta, tipografía y componentes base.',             'DONE',        'Diseño visual',                         7,   12),
(40, '2025-05-23 09:00:00', 'Maquetar todas las secciones de la landing en HTML/CSS con Tailwind.',             'DONE',        'Maquetación responsive',                1,   12),
(41, '2025-05-28 10:00:00', 'Implementar animaciones CSS y transiciones para mejorar la experiencia.',          'IN_PROGRESS', 'Animaciones y transiciones',            8,   12),
(42, '2025-06-02 11:00:00', 'Optimizar SEO: metadatos, sitemap, schema.org y rendimiento Lighthouse.',         'TODO',        'Optimización SEO',                     15,   12),
 
-- Proyecto 13: CRM para PYMES
(43, '2025-06-03 09:30:00', 'Definir entidades del dominio: clientes, contactos, oportunidades, actividades.',  'DONE',        'Modelado del dominio CRM',              1,   13),
(44, '2025-06-06 10:00:00', 'Implementar módulo de gestión de clientes con historial de interacciones.',        'DONE',        'Módulo de clientes',                    2,   13),
(45, '2025-06-12 08:30:00', 'Desarrollar pipeline de ventas visual con arrastrar y soltar (kanban).',           'IN_PROGRESS', 'Pipeline de ventas kanban',             1,   13),
(46, '2025-06-18 11:00:00', 'Crear módulo de reportes de ventas con gráficos y exportación a Excel.',          'IN_PROGRESS', 'Reportes de ventas',                    9,   13),
(47, '2025-06-25 09:00:00', 'Integrar con servicio de email para envío de campañas y seguimientos.',            'TODO',        'Integración de email marketing',       11,   13),
 
-- Proyecto 14: App Móvil de Finanzas Personales
(48, '2025-06-17 11:00:00', 'Definir estructura de datos: cuentas, transacciones, categorías y presupuestos.', 'DONE',        'Estructura de datos financieros',       10,   14),
(49, '2025-06-20 09:30:00', 'Implementar pantallas de registro de ingresos y gastos con categorización.',       'DONE',        'Registro de transacciones',             1,   14),
(50, '2025-06-27 10:00:00', 'Desarrollar módulo de presupuestos mensuales con alertas de límite.',              'IN_PROGRESS', 'Módulo de presupuestos',               11,   14),
(51, '2025-07-03 08:00:00', 'Implementar gráficos de análisis de gastos por categoría y tendencias.',           'TODO',        'Gráficos de análisis',                 15,   14),
 
-- Proyecto 15: Pipeline CI/CD con Docker
(52, '2025-07-01 09:00:00', 'Containerizar todos los microservicios con Docker y publicar en registry.',        'DONE',        'Dockerización de servicios',            1,   15),
(53, '2025-07-04 10:00:00', 'Configurar pipeline de GitHub Actions para CI: tests, lint y build automático.',   'DONE',        'Pipeline de integración continua',      4,   15),
(54, '2025-07-10 08:30:00', 'Implementar despliegue automático a Kubernetes con rolling updates.',               'IN_PROGRESS', 'Despliegue en Kubernetes',             6,   15),
(55, '2025-07-16 11:00:00', 'Configurar monitoreo con Prometheus y Grafana, alertas por Slack.',                'TODO',        'Monitoreo y alertas',                  12,   15),
 
-- Proyecto 16: Red Social Universitaria
(56, '2025-07-14 11:30:00', 'Diseñar modelo de datos: usuarios, posts, grupos, comentarios y reacciones.',      'DONE',        'Modelo de datos social',                8,   16),
(57, '2025-07-17 09:00:00', 'Implementar feed de publicaciones con paginación infinita y filtros.',              'DONE',        'Feed de publicaciones',                 1,   16),
(58, '2025-07-24 10:00:00', 'Desarrollar módulo de grupos de estudio con chat en tiempo real (WebSockets).',    'IN_PROGRESS', 'Grupos y chat en tiempo real',          7,   16),
(59, '2025-07-30 08:00:00', 'Crear sistema de compartición de archivos y recursos entre estudiantes.',           'TODO',        'Compartición de recursos',              9,   16),
 
-- Proyecto 17: Sistema de Reservas Online
(60, '2025-08-05 09:30:00', 'Modelar entidades: espacios, servicios, disponibilidad, reservas y usuarios.',     'DONE',        'Modelado del dominio de reservas',      1,   17),
(61, '2025-08-08 10:00:00', 'Implementar calendario interactivo con visualización de disponibilidad.',           'IN_PROGRESS', 'Calendario de disponibilidad',          2,   17),
(62, '2025-08-15 08:30:00', 'Desarrollar sistema de notificaciones: confirmación, recordatorios y cancelaciones.','TODO',       'Notificaciones de reservas',            6,   17),
(63, '2025-08-22 11:00:00', 'Integrar pasarela de pago para reservas con anticipo o pago total.',               'TODO',        'Pago de reservas',                      1,   17),
 
-- Proyecto 18: App de Salud y Bienestar
(64, '2025-08-19 14:30:00', 'Definir estructura de seguimiento: hábitos, rutinas, calorías y sueño.',           'DONE',        'Estructura de seguimiento de salud',   11,   18),
(65, '2025-08-22 09:00:00', 'Implementar pantalla principal con resumen diario y racha de hábitos.',             'IN_PROGRESS', 'Dashboard de bienestar',                1,   18),
(66, '2025-08-29 10:00:00', 'Integrar con HealthKit (iOS) y Google Fit (Android) para datos de wearables.',     'TODO',        'Integración con wearables',            10,   18),
 
-- Proyecto 19: Framework ORM Personalizado
(67, '2025-09-08 10:30:00', 'Diseñar API pública del ORM: anotaciones, repositorios y tipos de consultas.',     'DONE',        'Diseño de API pública',                 1,   19),
(68, '2025-09-12 09:00:00', 'Implementar sistema de reflexión para mapeo objeto-relacional automático.',         'IN_PROGRESS', 'Motor de reflexión y mapeo',            4,   19),
(69, '2025-09-19 10:00:00', 'Desarrollar generador de queries SQL dinámico con soporte para criterios.',         'TODO',        'Generador de queries dinámico',         6,   19),
(70, '2025-09-26 08:30:00', 'Escribir documentación técnica completa y ejemplos de uso del framework.',          'TODO',        'Documentación del framework',           1,   19),
 
-- Proyecto 20: Dashboard Analytics Web
(71, '2025-09-22 10:00:00', 'Definir KPIs a visualizar y conectar fuentes de datos (SQL, API REST, CSV).',      'DONE',        'Definición de KPIs y fuentes',          9,   20),
(72, '2025-09-26 09:00:00', 'Implementar componentes de gráficos: barras, líneas, pastel y mapas de calor.',    'IN_PROGRESS', 'Componentes de visualización',          1,   20),
(73, '2025-10-03 10:00:00', 'Desarrollar sistema de filtros dinámicos por fecha, región y categoría.',           'TODO',        'Filtros dinámicos',                     7,   20),
(74, '2025-10-09 08:00:00', 'Implementar exportación de reportes a PDF y Excel con programación de envíos.',    'TODO',        'Exportación de reportes',               8,   20),
 
-- Proyecto 21: Chatbot Empresarial con LLM
(75, '2025-10-07 08:30:00', 'Definir arquitectura del chatbot: integración LLM, base de conocimiento y escalado.','DONE',      'Arquitectura del chatbot',              1,   21),
(76, '2025-10-10 09:00:00', 'Implementar motor de prompts y sistema de contexto por conversación.',               'IN_PROGRESS','Motor de prompts y contexto',           6,   21),
(77, '2025-10-17 10:00:00', 'Construir base de conocimiento con embeddings y búsqueda semántica (RAG).',          'IN_PROGRESS','Base de conocimiento RAG',             12,   21),
(78, '2025-10-24 11:00:00', 'Integrar con sistema de tickets existente y panel de administración.',               'TODO',        'Integración con sistema de tickets',    1,   21),
 
-- Proyecto 22: E-Commerce con Arquitectura Hexagonal
(79, '2025-11-03 10:00:00', 'Definir puertos y adaptadores del dominio: catálogo, pedidos, pagos y envíos.',     'DONE',        'Puertos y adaptadores del dominio',     1,   22),
(80, '2025-11-06 09:00:00', 'Implementar núcleo del dominio: entidades, value objects y servicios de dominio.',  'IN_PROGRESS', 'Núcleo del dominio',                    2,   22),
(81, '2025-11-12 10:00:00', 'Desarrollar adaptadores de persistencia con JPA y adaptadores REST con Spring.',    'TODO',        'Adaptadores de infraestructura',         7,   22),
(82, '2025-11-19 08:00:00', 'Implementar casos de uso de compra: carrito, checkout y confirmación de pedido.',   'TODO',        'Casos de uso de compra',                1,   22);
 
-- =========================
-- COMENTARIOS (IDs 4-35)
-- Los IDs 1-3 ya existen en el schema original
-- =========================
INSERT INTO comments (id, content, created_at, task_id, user_id) VALUES
 
-- Tarea 7: Modelado de base de datos (Proyecto 5)
(4,  'Modelo listo y revisado. Usé normalización 3FN, quedó muy limpio.',              '2025-02-04 10:00:00', 7,  1),
(5,  'Revisé el modelo, sugiero agregar tabla de auditoría para cambios de nómina.',   '2025-02-04 14:00:00', 7,  2),
 
-- Tarea 8: Módulo de liquidación
(6,  'Liquidación implementada. Cubrir todos los conceptos tomó más de lo esperado.',  '2025-02-09 09:00:00', 8,  2),
(7,  'Hice pruebas manuales y los cálculos cuadran perfectamente con el ejemplo real.','2025-02-09 15:00:00', 8,  1),
 
-- Tarea 13: Autenticación E-Learning
(8,  'JWT implementado con refresh tokens. Documenté los endpoints en Swagger.',        '2025-03-09 11:00:00', 13, 1),
(9,  'Excelente implementación. Añadí pruebas de integración para los flujos de login.','2025-03-10 09:30:00', 13, 2),
 
-- Tarea 17: Pipeline de datos IA
(10, 'Pipeline configurado con Apache Airflow. Corre cada noche a las 2am.',           '2025-03-14 10:00:00', 17, 1),
(11, 'Revisé los logs, la calidad de datos es del 98%. Muy buena limpieza.',            '2025-03-14 16:00:00', 17, 6),
 
-- Tarea 18: API REST de inventarios
(12, 'API completa con 24 endpoints documentados. Incluye paginación y filtros.',       '2025-03-17 09:00:00', 18, 4),
(13, 'Consumí la API desde Postman, todo responde correctamente. Buen trabajo.',        '2025-03-17 14:00:00', 18, 1),
 
-- Tarea 22: Módulo de permisos
(14, 'Módulo funcionando con flujo de aprobación en 3 niveles.',                       '2025-03-31 11:00:00', 22, 1),
(15, 'El calendario visual quedó muy intuitivo. Los empleados van a amar esto.',        '2025-04-01 09:00:00', 22, 6),
 
-- Tarea 25: Diseño UI/UX Delivery
(16, 'Prototipo en Figma listo para revisión. Incluye 18 pantallas con flujo completo.','2025-04-04 10:00:00', 25, 3),
(17, 'Revisé el prototipo. Propongo simplificar el flujo de checkout a 2 pasos.',       '2025-04-04 15:30:00', 25, 1),
(18, 'De acuerdo con Deiby, ajustaré el flujo mañana.',                                '2025-04-04 16:00:00', 25, 3),
 
-- Tarea 30: Modelado del dominio OO
(19, 'Clases modeladas siguiendo SOLID. Diagrama UML disponible en la wiki del proyecto.','2025-04-20 10:00:00', 30, 1),
(20, 'Excelente diseño. El principio de inversión de dependencias está muy bien aplicado.','2025-04-21 09:00:00', 30, 2),
 
-- Tarea 34: Arquitectura de microservicios
(21, 'Definí 6 microservicios. Cada uno tiene su propia BD para cumplir el principio de BD por servicio.','2025-05-08 11:00:00', 34, 1),
(22, 'Revisé el diseño. Recomiendo agregar un servicio de notificaciones separado.',    '2025-05-08 15:00:00', 34, 6),
(23, 'Buena observación, lo agrego al backlog.',                                        '2025-05-09 09:00:00', 34, 1),
 
-- Tarea 36: Servicio de pagos
(24, 'Integración con Stripe completada. Manejamos pagos únicos y suscripciones.',      '2025-05-22 10:00:00', 36, 1),
(25, 'Añadí manejo de errores para tarjetas rechazadas y reintentos automáticos.',      '2025-05-23 09:00:00', 36, 7),
 
-- Tarea 43: Modelado del dominio CRM
(26, 'Dominio modelado. Agregué Value Objects para email, teléfono y oportunidad de negocio.','2025-06-05 10:00:00', 43, 1),
(27, 'Muy buen modelado. ¿Contemplamos multi-moneda para oportunidades internacionales?','2025-06-05 14:00:00', 43, 9),
(28, 'Excelente punto, lo agrego como requerimiento.',                                  '2025-06-06 09:00:00', 43, 1),
 
-- Tarea 52: Dockerización
(29, 'Todos los servicios dockerizados. Imágenes optimizadas con multi-stage builds.',  '2025-07-03 11:00:00', 52, 1),
(30, 'Probé los contenedores en local con docker-compose, todo corre sin problemas.',   '2025-07-03 15:00:00', 52, 4),
 
-- Tarea 57: Feed de publicaciones
(31, 'Feed implementado con cursor-based pagination. Rendimiento excelente hasta 10k posts.','2025-07-20 10:00:00', 57, 1),
(32, 'Hice pruebas de carga con k6, aguanta 500 usuarios concurrentes sin degradarse.',  '2025-07-21 09:00:00', 57, 8),
 
-- Tarea 67: Diseño de API pública ORM
(33, 'API diseñada siguiendo el estilo de Spring Data. Las anotaciones quedan muy limpias.','2025-09-10 10:00:00', 67, 1),
(34, 'Me gusta el diseño. Sugiero agregar soporte para transacciones declarativas con @Transactional.','2025-09-11 09:00:00', 67, 4),
 
-- Tarea 75: Arquitectura del chatbot
(35, 'Arquitectura definida: usaremos Claude como LLM base con RAG sobre la base de conocimiento interna.','2025-10-09 09:00:00', 75, 1),
(36, 'Perfecto. Propongo usar pgvector para los embeddings, ya tenemos PostgreSQL.',     '2025-10-09 14:00:00', 75, 6),
(37, 'Gran idea, es más simple que montar Pinecone. Lo implementamos así.',             '2025-10-09 15:30:00', 75, 1);