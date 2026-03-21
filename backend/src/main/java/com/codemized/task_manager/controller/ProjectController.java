package com.codemized.task_manager.controller;

import com.codemized.task_manager.dto.project.CreateProjectRequest;
import com.codemized.task_manager.dto.project.ProjectResponse;
import com.codemized.task_manager.dto.user.UserResponse;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.service.UserService;
import com.codemized.task_manager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        ProjectResponse created = projectService.createProject(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        User user = userService.getCurrentUser();
        List<ProjectResponse> projects = projectService.getProjectsByUser(user);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/collaborative")
    public ResponseEntity<List<ProjectResponse>> getCollaborativeProjects() {
        User user = userService.getCurrentUser();
        List<ProjectResponse> projects = projectService.getCollaborativeProjects(user);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    // Agregar miembro al proyecto
    @PostMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> addMemberToProject(
            @PathVariable Long projectId,
            @PathVariable Long userId) {

        projectService.addMemberToProject(projectId, userId);
        return ResponseEntity.ok().build();
    }

    // Agregar miembro al proyecto
    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<UserResponse>> getMembersOfProject(@PathVariable Long projectId) {

        return ResponseEntity.ok(projectService.getProjectMembers(projectId));
    }


    // Eliminar miembro del proyecto
    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeMemberFromProject(
            @PathVariable Long projectId,
            @PathVariable Long userId) {

        projectService.removeMemberOfProject(projectId, userId);
        return ResponseEntity.noContent().build();
    }
}