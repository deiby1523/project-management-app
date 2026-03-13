package com.codemized.task_manager.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateTaskRequest {

    @NotBlank
    @Size(min = 2, max = 200)
    private String title;

    @Size(max = 2000)
    private String description;

    @NotNull
    private Long projectId;

    private Long assignedUserId;

}
