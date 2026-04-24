package com.codemized.task_manager.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.codemized.task_manager.dto.course.CourseResponse;
import com.codemized.task_manager.dto.course.CreateCourseRequest;
import com.codemized.task_manager.exception.AccessDeniedException;
import com.codemized.task_manager.exception.ResourceNotFoundException;
import com.codemized.task_manager.model.Course;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.repository.CourseRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserService userService;

    @Transactional
    public CourseResponse createCourse(CreateCourseRequest request) {
        User creator = userService.getCurrentUser();

        Course course = new Course();
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setCreator(creator);

        Course savedCourse = courseRepository.save(course);

        return mapToResponse(savedCourse);
    }

    @Transactional
    public CourseResponse updateCourse(Long courseId, CreateCourseRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Curso no encontrado con ID: " + courseId));

        // User currentUser = userService.getCurrentUser();
        // if (!course.getCreator().getId().equals(currentUser.getId())) {
        //     throw new AccessDeniedException("No tienes privilegios para editar este curso");
        // }

        course.setName(request.getName());
        course.setDescription(request.getDescription());

        Course updatedCourse = courseRepository.save(course);

        return mapToResponse(updatedCourse);
    }

    public List<CourseResponse> getAll() {
        return courseRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CourseResponse getCourseById(Long id) {
        Course course = getCourseOrThrow(id);

        return mapToResponse(course);
    }

    public CourseResponse deleteCourseById(Long id) {
        Course course = getCourseOrThrow(id);
        courseRepository.deleteById(id);
        return mapToResponse(course);
    }

    // =========================
    // Métodos auxiliares
    // =========================

    private Course getCourseOrThrow(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("course", "id", courseId));
    }

    private CourseResponse mapToResponse(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .name(course.getName())
                .description(course.getDescription())
                .creatorId(course.getCreator().getId())
                .build();
    }
}