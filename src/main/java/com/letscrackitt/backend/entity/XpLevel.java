package com.letscrackitt.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "xp_levels")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class XpLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer levelNumber;

    @Column(nullable = false)
    private Integer minXp;

    @Column(nullable = false)
    private Integer maxXp;

    @Column(nullable = false, length = 80)
    private String label;
}
