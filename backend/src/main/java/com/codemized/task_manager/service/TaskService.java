package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.task.CreateTaskRequest;
import com.codemized.task_manager.dto.task.TaskResponse;
import com.codemized.task_manager.exception.AccessDeniedException;
import com.codemized.task_manager.exception.InvalidOperationException;
import com.codemized.task_manager.exception.ResourceNotFoundException;
import com.codemized.task_manager.model.Project;
import com.codemized.task_manager.model.Task;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.model.enums.TaskStatus;
import com.codemized.task_manager.repository.ProjectMemberRepository;
import com.codemized.task_manager.repository.ProjectRepository;
import com.codemized.task_manager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserService userService;

    @Transactional
    public TaskResponse createTask(CreateTaskRequest request) {
        User actor = userService.getCurrentUser();

        Project project = getProjectOrThrow(request.getProjectId());
        validateMember(project, actor);

        User assignedUser = null;

        if (request.getAssignedUserId() != null) {
            assignedUser = userService.getUserById(request.getAssignedUserId());
            validateMember(project, assignedUser);
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.TODO)
                .project(project)
                .assignedUser(assignedUser)
                .build();

        Task saved = taskRepository.save(task);

        return mapToResponse(saved);
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {
        User actor = userService.getCurrentUser();

        Project project = getProjectOrThrow(projectId);
        validateMember(project, actor);

        return taskRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse getTaskById(Long taskId) {
        Task task = getTaskOrThrow(taskId);

        validateMember(task.getProject(), userService.getCurrentUser());

        return mapToResponse(task);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long taskId, TaskStatus newStatus) {
        User actor = userService.getCurrentUser();

        Task task = getTaskOrThrow(taskId);
        Project project = task.getProject();

        validateMember(project, actor);

        if (newStatus == null) {
            throw new InvalidOperationException("Task status cannot be null");
        }


        task.setStatus(newStatus);

        Task updated = taskRepository.save(task);

        return mapToResponse(updated);
    }

    @Transactional
    public TaskResponse assignTask(Long taskId, Long userId) {
        User actor = userService.getCurrentUser();

        Task task = getTaskOrThrow(taskId);
        Project project = task.getProject();

        validateMember(project, actor);

        User user = userService.getUserById(userId);
        validateMember(project, user);

        task.setAssignedUser(user);

        Task updated = taskRepository.save(task);

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        User actor = userService.getCurrentUser();

        Task task = getTaskOrThrow(taskId);
        Project project = task.getProject();

        validateMember(project, actor);

        taskRepository.delete(task);
    }

    // =========================
    // Métodos auxiliares
    // =========================

    private Project getProjectOrThrow(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("project", "id", projectId));
    }

    private Task getTaskOrThrow(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("task", "id", taskId));
    }

    private void validateMember(Project project, User user) {
        projectMemberRepository
                .findByProjectAndUser(project, user)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));
    }

    private TaskResponse mapToResponse(Task task) {
        Long assignedUserId = task.getAssignedUser() != null
                ? task.getAssignedUser().getId()
                : null;

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .projectId(task.getProject().getId())
                .assignedUserId(assignedUserId)
                .build();
    }
}