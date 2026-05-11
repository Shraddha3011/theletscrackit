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

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @Valid @RequestBody RegisterRequest request
    ) {

        if (
                userRepository.existsByEmail(
                        request.getEmail()
                )
        ) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            Map.of(
                                    "message",
                                    "Email already registered"
                            )
                    );
        }

        User user = User.builder()

                .fullName(
                        request.getFullName()
                )

                .username(
                        request.getUsername()
                )

                .email(
                        request.getEmail()
                )

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

    @PostMapping("/login")
    public ResponseEntity<?> login(
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
                        request.getEmail()
                ).orElseThrow();

        String token =
                jwtUtil.generateToken(
                        user.getEmail()
                );

        AuthResponse response =
                AuthResponse.builder()
                        .token(token)
                        .tokenType("Bearer")
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .xpPoints(user.getXpPoints())
                        .streak(user.getStreak())
                        .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Unauthorized"));
        }

        String name = principal.getName(); // could be "admin" or email

        User user = userRepository.findByEmail(name)
                .or(() -> userRepository.findByUsername(name)) // ✅ fallback
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    "User not found"
                            )
                    );
        }

        AuthResponse response =
                AuthResponse.builder()

                        .id(user.getId())

                        .username(user.getUsername())

                        .email(user.getEmail())

                        .fullName(user.getFullName())

                        .role(user.getRole().name())

                        .xpPoints(user.getXpPoints())

                        .streak(user.getStreak())

                        .build();

        return ResponseEntity.ok(response);
    }
}