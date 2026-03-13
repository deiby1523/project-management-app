package com.codemized.task_manager.controller;

import com.codemized.task_manager.dto.comment.CommentResponse;
import com.codemized.task_manager.dto.comment.CreateCommentRequest;
import com.codemized.task_manager.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.createComment(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByTask(@PathVariable Long taskId) {
        List<CommentResponse> comments = commentService.getCommentsByTask(taskId);
        return ResponseEntity.ok(comments);
    }

}
