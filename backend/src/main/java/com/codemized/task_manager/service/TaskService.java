package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.task.CreateTaskRequest;
import com.codemized.task_manager.dto.task.TaskResponse;
import com.codemized.task_manager.exception.AccessDeniedException;
import com.codemized.task_manager.exception.ResourceNotFoundException;
import com.codemized.task_manager.model.Project;
import com.codemized.task_manager.model.Task;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.model.enums.TaskStatus;
import com.codemized.task_manager.repository.ProjectMemberRepository;
import com.codemized.task_manager.repository.ProjectRepository;
import com.codemized.task_manager.repository.TaskRepository;
import com.codemized.task_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public TaskResponse createTask(CreateTaskRequest request) {
        User actor = userService.getCurrentUser();

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("project","id",request.getProjectId()));

        // Verify actor is a member of the project
        projectMemberRepository
                .findByProjectAndUser(project, actor)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));

        User assignedUser = null;

        if (request.getAssignedUserId() != null) {
            assignedUser = userService.getUserById(request.getAssignedUserId());

            // verify assigned user is a member of the project
            projectMemberRepository
                    .findByProjectAndUser(project, assignedUser)
                    .orElseThrow(() -> new RuntimeException("Assigned user is not a member of this project"));
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

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("project","id",projectId));

        // validate permissions before fetching tasks
        projectMemberRepository
                .findByProjectAndUser(project, actor)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));

        List<Task> tasks = taskRepository.findByProjectId(projectId);

        return tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse assignTask(Long taskId, Long userId) {

        User actor = userService.getCurrentUser();


        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("task","id",taskId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("user","id",userId));

        // verify actor is a member of the project (any member can assign)
        projectMemberRepository
                .findByProjectAndUser(task.getProject(), actor)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));

        // verify assigned user is a member of the project
        projectMemberRepository
                .findByProjectAndUser(task.getProject(), user)
                .orElseThrow(() -> new RuntimeException("User is not a member of this project"));

        task.setAssignedUser(user);

        Task updated = taskRepository.save(task);

        return mapToResponse(updated);
    }

    private TaskResponse mapToResponse(Task task) {

        Long assignedUserId = null;

        if (task.getAssignedUser() != null) {
            assignedUserId = task.getAssignedUser().getId();
        }

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