package com.codemized.task_manager.dto.project;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectResponse {
    private long id;
    private String name;
    private Long courseId;
    private String description;
    private Long creatorId;
}
