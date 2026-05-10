package com.letscrackitt.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String role;
    private Integer xpPoints;
    private Integer streak;
    private String message;
}