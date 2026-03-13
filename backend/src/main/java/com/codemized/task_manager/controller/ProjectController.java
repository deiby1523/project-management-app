package com.codemized.task_manager.controller;

import com.codemized.task_manager.dto.project.CreateProjectRequest;
import com.codemized.task_manager.dto.project.ProjectResponse;
import com.codemized.task_manager.model.Project;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.repository.UserRepository;
import com.codemized.task_manager.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody CreateProjectRequest request) {
        Project created = projectService.createProject(request);
        ProjectResponse response = projectService.getProjectById(created.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProjectResponse>> getMyProjects() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ProjectResponse> projects = projectService.getProjectsByUser(user.getId());

        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

}
