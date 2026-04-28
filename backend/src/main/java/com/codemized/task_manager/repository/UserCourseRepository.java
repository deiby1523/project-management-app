package com.codemized.task_manager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codemized.task_manager.model.Course;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.model.UserCourse;


public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
    
    List<UserCourse> findByUser(User user);

    List<UserCourse> findByCourse(Course course);

    Optional<UserCourse> findByCourseAndUser(Course course, User user);

}
