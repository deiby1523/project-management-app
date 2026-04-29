package com.codemized.task_manager.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codemized.task_manager.dto.course.CourseResponse;
import com.codemized.task_manager.dto.course.CreateCourseRequest;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.service.CourseService;
// import com.codemized.task_manager.service.UserService;
import com.codemized.task_manager.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        CourseResponse created = courseService.createCourse(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id,
            @Valid @RequestBody CreateCourseRequest request) {
        CourseResponse updated = courseService.updateCourse(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/")
    public ResponseEntity<List<CourseResponse>> getCourses() {
        List<CourseResponse> courses = courseService.getAll();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CourseResponse> deleteCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.deleteCourseById(id));
    }

    @PostMapping("/{courseId}/users/{userId}")
    public ResponseEntity<Void> addUserToCourse(
            @PathVariable Long courseId,
            @PathVariable Long userId) {
        courseService.addUserToCourse(courseId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<CourseResponse>> getMyCourses() {
        User user = userService.getCurrentUser();

        List<CourseResponse> courses = courseService.getCoursesByUser(user);

        return ResponseEntity.ok(courses);
    }

    @DeleteMapping("/{courseId}/users/{userId}")
    public ResponseEntity<Void> removeUserFromCourse(
            @PathVariable Long courseId,
            @PathVariable Long userId) {

        courseService.removeUserOfCourse(courseId, userId);

        return ResponseEntity.ok().build();
    }

}