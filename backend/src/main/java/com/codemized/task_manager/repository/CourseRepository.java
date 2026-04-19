package com.codemized.task_manager.repository;

import com.codemized.task_manager.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByCreatorId(Long creatorId);

}
