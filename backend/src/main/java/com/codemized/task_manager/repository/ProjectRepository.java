package com.codemized.task_manager.repository;

import com.codemized.task_manager.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByCreatorId(Long creatorId);

    List<Project> findByCreatorIdOrderByCreatedAtAsc(Long creatorId);

    List<Project> findByCourseId(Long courseId);

}
