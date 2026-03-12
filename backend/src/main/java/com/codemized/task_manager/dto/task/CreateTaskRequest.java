package com.codemized.task_manager.dto.task;

import lombok.Data;

@Data
public class CreateTaskRequest {

    private String title;

    private String description;

    private Long projectId;

    private Long assignedUserId;

}
