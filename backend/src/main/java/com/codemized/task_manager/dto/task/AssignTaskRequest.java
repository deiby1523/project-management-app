package com.codemized.task_manager.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AssignTaskRequest {

    @NotNull
    private Long assignedUserId;
}
