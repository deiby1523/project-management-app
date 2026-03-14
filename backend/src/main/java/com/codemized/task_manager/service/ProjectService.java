package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.project.CreateProjectRequest;
import com.codemized.task_manager.dto.project.ProjectResponse;
import com.codemized.task_manager.model.Project;
import com.codemized.task_manager.model.ProjectMember;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.model.enums.ProjectRole;
import com.codemized.task_manager.repository.ProjectMemberRepository;
import com.codemized.task_manager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserService userService;


    public ProjectResponse createProject(CreateProjectRequest request) {
        User creator = userService.getCurrentUser();


        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setCreator(creator);

        Project savedProject = projectRepository.save(project);

        ProjectMember owner = new ProjectMember();
        owner.setProject(savedProject);
        owner.setUser(creator);
        owner.setRole(ProjectRole.OWNER);

        projectMemberRepository.save(owner);

        return mapToResponse(savedProject);
    }

    // returns projects where the given user is the creator
    public List<ProjectResponse> getProjectsByUser(User user) {

        List<Project> projects = projectRepository.findByCreatorId(user.getId());

        return projects.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // returns projects where the user is a collaborator / member
    public List<ProjectResponse> getCollaborativeProjects(User user) {

        List<ProjectMember> memberships = projectMemberRepository.findByUser(user);

        return memberships.stream()
                .map(ProjectMember::getProject)
                .distinct()
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