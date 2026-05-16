package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.dto.response.UserResponse;
import com.letscrackitt.backend.entity.enums.Role;
import com.letscrackitt.backend.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponse> getAllUsers() {

        return userService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public void deleteUser(
            @PathVariable Long id
    ) {

        userService.deleteUser(id);
    }

    @PutMapping("/{id}/role")
    public UserResponse updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {

        Role role = Role.valueOf(
                body.get("role").toUpperCase()
        );

        return userService.updateRole(id, role);
    }
}