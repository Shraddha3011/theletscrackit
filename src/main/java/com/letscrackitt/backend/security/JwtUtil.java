package com.letscrackitt.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(
                jwtSecret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(Authentication authentication) {

        UserDetails principal =
                (UserDetails) authentication.getPrincipal();

        return buildToken(principal.getUsername());
    }

    public String generateToken(String email) {
        return buildToken(email);
    }

    private String buildToken(String subject) {

        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + expirationMs)
                )
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {

        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {

        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {

            log.warn("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }

    private Claims getClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}