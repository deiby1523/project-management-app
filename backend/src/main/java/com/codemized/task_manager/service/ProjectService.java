package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.project.CreateProjectRequest;
import com.codemized.task_manager.dto.project.ProjectResponse;
import com.codemized.task_manager.model.Project;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.repository.ProjectRepository;
import com.codemized.task_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectResponse createProject(CreateProjectRequest request) {

        User creator = userRepository.findById(request.getCreatorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .creator(creator)
                .build();

        Project saved = projectRepository.save(project);

        return mapToResponse(saved);
    }

    public List<ProjectResponse> getProjectsByUser(Long userId) {

        List<Project> projects = projectRepository.findByCreatorId(userId);

        return projects.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return mapToResponse(project);
    }

    private ProjectResponse mapToResponse(Project project) {

        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .creatorId(project.getCreator().getId())
                .build();
    }
}