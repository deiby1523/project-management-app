package com.codemized.task_manager.dto.task;

import com.codemized.task_manager.model.enums.TaskStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskResponse {

    private Long id;

    private String title;

    private String description;

    private TaskStatus status;

    private Long projectId;

    private Long assignedUserId;

}