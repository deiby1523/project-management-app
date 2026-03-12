package com.codemized.task_manager.dto.user;

import lombok.Data;

@Data
public class CreateUserRequest {

    private String name;

    private String email;

    private String password;

}
