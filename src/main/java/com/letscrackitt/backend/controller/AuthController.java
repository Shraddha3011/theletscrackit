package com.letscrackitt.backend.controller;

import com.letscrackitt.backend.dto.request.LoginRequest;
import com.letscrackitt.backend.dto.request.RegisterRequest;
import com.letscrackitt.backend.dto.response.AuthResponse;

import com.letscrackitt.backend.entity.User;
import com.letscrackitt.backend.entity.enums.Role;

import com.letscrackitt.backend.repository.UserRepository;

import com.letscrackitt.backend.security.JwtUtil;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final JwtUtil jwtUtil;

    // SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @Valid @RequestBody RegisterRequest request
    ) {

        if (userRepository.existsByEmail(request.getEmail())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            Map.of(
                                    "message",
                                    "Email already registered"
                            )
                    );
        }

        String fullName =
                firstPresent(
                        request.getFullName(),
                        request.getUsername(),
                        request.getEmail()
                );

        String username =
                request.getUsername() != null &&
                        !request.getUsername().isBlank()

                        ? request.getUsername()

                        : request.getEmail().split("@")[0];

        User user = User.builder()

                .username(username)

                .fullName(fullName)

                .email(request.getEmail())

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .role(Role.USER)

                .xpPoints(0)

                .streak(0)

                .build();

        userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        Map.of(
                                "message",
                                "Signup successful"
                        )
                );
    }

    // LOGIN
    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {

        Authentication authentication =
                authenticationManager.authenticate(

                        new UsernamePasswordAuthenticationToken(
                                request.getEmail(),
                                request.getPassword()
                        )
                );

        User user =
                userRepository.findByEmail(
                        authentication.getName()
                ).orElseThrow();

        String token =
                jwtUtil.generateToken(
                        user.getEmail()
                );

        return toAuthResponse(user, token);
    }

    // CURRENT USER
    @GetMapping("/me")
    public AuthResponse me(
            Principal principal
    ) {

        User user =
                userRepository.findByEmail(
                        principal.getName()
                ).orElseThrow();

        return toAuthResponse(user, null);
    }

    // RESPONSE FORMAT
    private AuthResponse toAuthResponse(
            User user,
            String token
    ) {

        return AuthResponse.builder()

                .token(token)

                .tokenType("Bearer")

                .id(user.getId())

                .username(user.getUsername())

                .email(user.getEmail())

                .fullName(user.getFullName())

                .avatarUrl(user.getAvatarUrl())

                .role(user.getRole().name())

                .xpPoints(user.getXpPoints())

                .streak(user.getStreak())

                .build();
    }

    // UTILITY
    private String firstPresent(
            String... values
    ) {

        for (String value : values) {

            if (value != null && !value.isBlank()) {

                return value;
            }
        }

        return "Learner";
    }
}