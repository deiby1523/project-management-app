package com.codemized.task_manager.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateCommentRequest {

    @NotBlank
    @Size(min = 1, max = 2000)
    private String content;

    @NotNull
    private Long taskId;

    @NotNull
    private Long userId;

}