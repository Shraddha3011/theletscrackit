package com.letscrackitt.backend.dto.response;

import com.letscrackitt.backend.entity.User;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String role;
    private Integer xpPoints;
    private Integer streak;
    private LocalDateTime createdAt;

    public static UserResponse from(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .avatarUrl(u.getAvatarUrl())
                .role(u.getRole().name())
                .xpPoints(u.getXpPoints())
                .streak(u.getStreak())
                .createdAt(u.getCreatedAt())
                .build();
    }
}