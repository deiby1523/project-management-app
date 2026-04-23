package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.project.CreateProjectRequest;
import com.codemized.task_manager.dto.project.ProjectResponse;
import com.codemized.task_manager.dto.user.UserResponse;
import com.codemized.task_manager.exception.AccessDeniedException;
import com.codemized.task_manager.exception.DuplicateResourceException;
import com.codemized.task_manager.exception.InvalidOperationException;
import com.codemized.task_manager.exception.ResourceNotFoundException;
import com.codemized.task_manager.model.Course;
import com.codemized.task_manager.model.Project;
import com.codemized.task_manager.model.ProjectMember;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.model.enums.ProjectRole;
import com.codemized.task_manager.repository.CourseRepository;
import com.codemized.task_manager.repository.ProjectMemberRepository;
import com.codemized.task_manager.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserService userService;
    private final CourseRepository courseRepository;

    @Transactional
    public ProjectResponse createProject(CreateProjectRequest request) {
        User creator = userService.getCurrentUser();

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setCreator(creator);

        Course course;

        if (request.getCourseId() != null) {
            course = courseRepository.findById(request.getCourseId()).orElse(null);
            project.setCourse(course);
        }



        Project savedProject = projectRepository.save(project);

        ProjectMember owner = new ProjectMember();
        owner.setProject(savedProject);
        owner.setUser(creator);
        owner.setRole(ProjectRole.OWNER);

        projectMemberRepository.save(owner);

        return mapToResponse(savedProject);
    }

    @Transactional
    public void addMemberToProject(Long projectId, Long userId) {
        Project project = getProjectOrThrow(projectId);
        validateOwner(project);

        User member = userService.getUserById(userId);

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

    @Transactional
    public void removeMemberOfProject(Long projectId, Long userId) {
        Project project = getProjectOrThrow(projectId);
        User actor = userService.getCurrentUser();

        validateOwner(project);

        User member = userService.getUserById(userId);

        ProjectMember memberMembership = projectMemberRepository
                .findByProjectAndUser(project, member)
                .orElseThrow(() -> new InvalidOperationException("User is not a member of this project"));

        if (memberMembership.getRole() == ProjectRole.OWNER) {
            throw new InvalidOperationException("Cannot remove the project owner");
        }

        if (actor.getId().equals(member.getId())) {
            throw new InvalidOperationException("Owner cannot remove themselves");
        }

        projectMemberRepository.delete(memberMembership);
    }

    public List<UserResponse> getProjectMembers(Long projectId) {
        Project project = getProjectOrThrow(projectId);
        validateMember(project);

        return projectMemberRepository.findByProject(project).stream()
                .map(ProjectMember::getUser)
                .map(userService::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getProjectsByUser(User user) {
        return projectRepository.findByCreatorId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ProjectResponse> getCollaborativeProjects(User user) {
        return projectMemberRepository.findByUserAndRoleNot(user, ProjectRole.OWNER).stream()
                .map(ProjectMember::getProject)
                .distinct()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = getProjectOrThrow(id);
        validateMember(project);

        return mapToResponse(project);
    }

    // =========================
    // Métodos auxiliares
    // =========================

    private Project getProjectOrThrow(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("project", "id", projectId));
    }

    private void validateOwner(Project project) {
        User actor = userService.getCurrentUser();

        ProjectMember membership = projectMemberRepository
                .findByProjectAndUser(project, actor)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));

        if (membership.getRole() != ProjectRole.OWNER) {
            throw new AccessDeniedException("Insufficient permissions");
        }
    }

    private void validateMember(Project project) {
        User actor = userService.getCurrentUser();

        projectMemberRepository
                .findByProjectAndUser(project, actor)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));
    }

    private ProjectResponse mapToResponse(Project project) {
        Long courseId = null;
        
        if (project.getCourse() != null) {
            courseId = project.getCourse().getId();
        }
    
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .courseId(courseId)
                .description(project.getDescription())
                .creatorId(project.getCreator().getId())
                .build();
    }
}