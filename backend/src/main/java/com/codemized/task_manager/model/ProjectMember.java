package com.codemized.task_manager.model;

import com.codemized.task_manager.model.enums.ProjectRole;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "project_members")
@Data
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private ProjectRole role;

}
