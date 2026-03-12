package com.codemized.task_manager.dto.project;

import lombok.Data;

@Data
public class CreateProjectRequest {

    private String name;

    private String description;

    private Long creatorId;
}
