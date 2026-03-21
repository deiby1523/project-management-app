package com.codemized.task_manager.service;

import com.codemized.task_manager.dto.user.UserResponse;
import com.codemized.task_manager.exception.AccessDeniedException;
import com.codemized.task_manager.exception.ResourceNotFoundException;
import com.codemized.task_manager.model.User;
import com.codemized.task_manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getName().equals("anonymousUser")) {
            throw new AccessDeniedException("Unauthenticated");
        }

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("user", "email", email));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("user", "id", id));
    }

    public UserResponse getUserResponseById(Long id) {
        return mapToResponse(getUserById(id));
    }

    public UserResponse getUserByEmail(String email) {
        return mapToResponse(
                userRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("user", "email", email))
        );
    }

    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================
    // Métodos auxiliares
    // =========================

    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}