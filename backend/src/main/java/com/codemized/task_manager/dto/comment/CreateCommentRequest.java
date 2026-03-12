package com.codemized.task_manager.dto.comment;

import lombok.Data;

@Data
public class CreateCommentRequest {

    private String content;

    private Long taskId;

    private Long userId;

}