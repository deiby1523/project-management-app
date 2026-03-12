package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.task.CreateTaskRequest;
import com.codemized.task_manager.dto.task.TaskResponse;
import com.codemized.task_manager.model.Project;
import com.codemized.task_manager.model.Task;
import com.codemized.task_manager.model.User;
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
    private final UserRepository userRepository;

    public TaskResponse createTask(CreateTaskRequest request) {

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User assignedUser = null;

        if (request.getAssignedUserId() != null) {
            assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status("todo")
                .project(project)
                .assignedUser(assignedUser)
                .build();

        Task saved = taskRepository.save(task);

        return mapToResponse(saved);
    }

    public List<TaskResponse> getTasksByProject(Long projectId) {

        List<Task> tasks = taskRepository.findByProjectId(projectId);

        return tasks.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TaskResponse assignTask(Long taskId, Long userId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

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