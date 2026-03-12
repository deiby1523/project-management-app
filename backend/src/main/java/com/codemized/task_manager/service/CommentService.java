package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.comment.CreateCommentRequest;
import com.codemized.task_manager.dto.comment.CommentResponse;
import com.codemized.task_manager.model.Comment;
import com.codemized.task_manager.model.Task;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.repository.CommentRepository;
import com.codemized.task_manager.repository.TaskRepository;
import com.codemized.task_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public CommentResponse createComment(CreateCommentRequest request) {

        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .content(request.getContent())
                .task(task)
                .user(user)
                .build();

        Comment saved = commentRepository.save(comment);

        return mapToResponse(saved);
    }

    public List<CommentResponse> getCommentsByTask(Long taskId) {

        List<Comment> comments = commentRepository.findByTaskId(taskId);

        return comments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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