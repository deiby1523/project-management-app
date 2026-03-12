package com.codemized.task_manager.dto.auth;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;
    private String password;

}