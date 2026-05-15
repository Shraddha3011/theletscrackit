package com.letscrackitt.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(length = 2000)
    private String description;

    private String courseSlug;

    private String difficulty;

    private String accent;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<ProjectStep> steps;
}
