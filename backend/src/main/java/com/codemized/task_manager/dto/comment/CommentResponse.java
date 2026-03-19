package com.codemized.task_manager.dto.comment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private Long taskId;
    private Long userId;
}