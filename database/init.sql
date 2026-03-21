-- =========================
-- CREATE TABLES
-- =========================

create table if not exists users
(
    id         bigint auto_increment primary key,
    created_at datetime(6)  not null,
    email      varchar(255) not null,
    name       varchar(255) not null,
    password   varchar(255) not null
);

create table if not exists projects
(
    id          bigint auto_increment primary key,
    created_at  datetime(6)  null,
    description varchar(255) null,
    name        varchar(255) null,
    creator_id  bigint       null,
    constraint FK_projects_users
        foreign key (creator_id) references users (id)
);

create table if not exists project_members
(
    id         bigint auto_increment primary key,
    role       enum ('MEMBER', 'OWNER') null,
    project_id bigint                   not null,
    user_id    bigint                   not null,
    constraint FK_pm_project
        foreign key (project_id) references projects (id),
    constraint FK_pm_user
        foreign key (user_id) references users (id)
);

create table if not exists tasks
(
    id               bigint auto_increment primary key,
    created_at       datetime(6)  null,
    description      text         null,
    status           enum ('TODO', 'IN_PROGRESS','DONE') not null,
    title            varchar(255) not null,
    assigned_user_id bigint       null,
    project_id       bigint       not null,
    constraint FK_task_user
        foreign key (assigned_user_id) references users (id),
    constraint FK_task_project
        foreign key (project_id) references projects (id)
);

create table if not exists comments
(
    id         bigint auto_increment primary key,
    content    text        not null,
    created_at datetime(6) null,
    task_id    bigint      not null,
    user_id    bigint      not null,
    constraint FK_comment_user
        foreign key (user_id) references users (id),
    constraint FK_comment_task
        foreign key (task_id) references tasks (id)
);

-- =========================
-- INSERT DATA (USING FIXED IDs)
-- =========================

-- USERS
INSERT INTO users (id, created_at, email, name, password) VALUES
(1, NOW(), 'deibyprada@gmail.com', 'Deiby Prada', '$2a$10$ixlQR2Vmuur2lIfKpY0sa.PCW/G3NSqn3wNspSPRO483Wp3VoJwLe'),
(2, NOW(), 'ana@gmail.com', 'Ana Torres', '$2a$10$ixlQR2Vmuur2lIfKpY0sa.PCW/G3NSqn3wNspSPRO483Wp3VoJwLe'),
(3, NOW(), 'carlos@gmail.com', 'Carlos Ruiz', '$2a$10$ixlQR2Vmuur2lIfKpY0sa.PCW/G3NSqn3wNspSPRO483Wp3VoJwLe'),
(4, NOW(), 'laura@gmail.com', 'Laura Gomez', '$2a$10$ixlQR2Vmuur2lIfKpY0sa.PCW/G3NSqn3wNspSPRO483Wp3VoJwLe'),
(5, NOW(), 'miguel@gmail.com', 'Miguel Perez', '$2a$10$ixlQR2Vmuur2lIfKpY0sa.PCW/G3NSqn3wNspSPRO483Wp3VoJwLe');

-- PROJECTS
INSERT INTO projects (id, created_at, description, name, creator_id) VALUES
(1, NOW(), 'Proyecto personal de Deiby', 'TaskFlow Personal', 1),
(2, NOW(), 'Proyecto colaborativo backend', 'API Development', 1),
(3, NOW(), 'Proyecto frontend UI', 'Frontend App', 2),
(4, NOW(), 'Proyecto testing QA', 'QA Testing', 3);

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

(1, NOW(), 'Configurar entorno personal', 'DONE', 'Setup inicial', 1, 1),

(2, NOW(), 'Crear endpoints REST', 'IN_PROGRESS', 'API usuarios', 2, 2),
(3, NOW(), 'Implementar JWT', 'TODO', 'Seguridad', 1, 2),

(4, NOW(), 'Diseñar layout', 'TODO', 'UI base', 4, 3),
(5, NOW(), 'Integrar API', 'TODO', 'Integración', 1, 3),

(6, NOW(), 'Casos de prueba', 'TODO', 'Testing inicial', 5, 4);

-- COMMENTS
INSERT INTO comments (id, content, created_at, task_id, user_id) VALUES

(1, 'Inicio esta tarea', NOW(), 2, 2),
(2, 'Validar seguridad', NOW(), 3, 1),
(3, 'UI casi lista', NOW(), 4, 4);