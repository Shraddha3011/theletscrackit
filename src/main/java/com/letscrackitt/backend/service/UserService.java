package com.letscrackitt.backend.service;

import com.letscrackitt.backend.dto.response.UserResponse;
import com.letscrackitt.backend.entity.User;
import com.letscrackitt.backend.entity.enums.Role;
import com.letscrackitt.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserResponse updateRole(Long id, Role role) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(role);

        return mapToDto(userRepository.save(user));
    }

    private UserResponse mapToDto(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(String.valueOf(user.getRole()))
                .xpPoints(user.getXpPoints())
                .streak(user.getStreak())
                .build();
    }
}