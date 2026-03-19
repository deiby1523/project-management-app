package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.project.CreateProjectRequest;
import com.codemized.task_manager.dto.project.ProjectResponse;
import com.codemized.task_manager.exception.AccessDeniedException;
import com.codemized.task_manager.exception.DuplicateResourceException;
import com.codemized.task_manager.exception.ResourceNotFoundException;
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

    public void addMemberToProject(Long projectId, Long userId) {

        User actor = userService.getCurrentUser();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("project","id",projectId));

        ProjectMember actorMembership = projectMemberRepository
                .findByProjectAndUser(project, actor)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));

        // Validar rol
        if (actorMembership.getRole() != ProjectRole.OWNER) {
            throw new AccessDeniedException("Insufficient permissions");
        }

        User member = userService.getUserById(userId);

        // Evitar duplicados
        boolean alreadyMember = projectMemberRepository
                .findByProjectAndUser(project, member)
                .isPresent();

        if (alreadyMember) {
            throw new DuplicateResourceException("User is already a member of this project");
        }

        ProjectMember projectMember = new ProjectMember();
        projectMember.setProject(project);
        projectMember.setUser(member);
        projectMember.setRole(ProjectRole.MEMBER);

        projectMemberRepository.save(projectMember);
    }

    public void removeMemberOfProject(Long projectId, Long userId) {

        User actor = userService.getCurrentUser();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("project","id",projectId));

        ProjectMember actorMembership = projectMemberRepository
                .findByProjectAndUser(project, actor)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));

        // Validar permisos
        if (actorMembership.getRole() != ProjectRole.OWNER) {
            throw new AccessDeniedException("Insufficient permissions");
        }

        User member = userService.getUserById(userId);

        ProjectMember memberMembership = projectMemberRepository
                .findByProjectAndUser(project, member)
                .orElseThrow(() -> new RuntimeException("User is not a member of this project"));

        // Evitar eliminar al OWNER
        if (memberMembership.getRole() == ProjectRole.OWNER) {
            throw new RuntimeException("Cannot remove the project owner");
        }

        // (Opcional) Evitar auto-eliminación
        if (actor.getId().equals(member.getId())) {
            throw new RuntimeException("Owner cannot remove themselves");
        }

        projectMemberRepository.delete(memberMembership);
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
                .orElseThrow(() -> new  ResourceNotFoundException("project","id",id));

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