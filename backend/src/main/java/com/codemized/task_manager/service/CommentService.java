package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.comment.CommentResponse;
import com.codemized.task_manager.dto.comment.CreateCommentRequest;
import com.codemized.task_manager.exception.AccessDeniedException;
import com.codemized.task_manager.exception.ResourceNotFoundException;
import com.codemized.task_manager.model.Comment;
import com.codemized.task_manager.model.Project;
import com.codemized.task_manager.model.Task;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.repository.CommentRepository;
import com.codemized.task_manager.repository.ProjectMemberRepository;
import com.codemized.task_manager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserService userService;

    @Transactional
    public CommentResponse createComment(CreateCommentRequest request) {

        User actor = userService.getCurrentUser();

        Task task = getTaskOrThrow(request.getTaskId());
        Project project = task.getProject();

        validateMember(project, actor);

        Comment comment = Comment.builder()
                .content(request.getContent())
                .task(task)
                .user(actor)
                .build();

        Comment saved = commentRepository.save(comment);

        return mapToResponse(saved);
    }

    public List<CommentResponse> getCommentsByTask(Long taskId) {

        User actor = userService.getCurrentUser();

        Task task = getTaskOrThrow(taskId);
        Project project = task.getProject();

        validateMember(project, actor);

        return commentRepository.findByTaskId(taskId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // =========================
    // Métodos auxiliares
    // =========================

    private Task getTaskOrThrow(Long taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("task", "id", taskId));
    }

    private void validateMember(Project project, User user) {
        projectMemberRepository
                .findByProjectAndUser(project, user)
                .orElseThrow(() -> new AccessDeniedException("Access denied"));
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .taskId(comment.getTask().getId())
                .userId(comment.getUser().getId())
                .build();
    }
}