package com.codemized.task_manager.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateProjectRequest {

    @NotBlank
    @Size(min = 2, max = 200)
    private String name;

    private Long courseId;

    @Size(max = 2000)
    private String description;

    private Long creatorId;
}
