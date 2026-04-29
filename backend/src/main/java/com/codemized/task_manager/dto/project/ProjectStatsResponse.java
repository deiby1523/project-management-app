package com.codemized.task_manager.dto.project;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectStatsResponse {

    private long totalProjects;
    private double averagePerWeek;
    private double averagePerMonth;
    private double averagePerSemester;
    private double averagePerYear;
}