package com.codemized.task_manager.dto.course;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponse {
    private long id;
    private String name;
    private String description;
    private long creatorId;
}
