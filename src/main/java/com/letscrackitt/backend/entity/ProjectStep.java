package com.letscrackitt.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private LearningProject project;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String task;

    @Column(columnDefinition = "TEXT")
    private String starterCode;

    private Integer displayOrder;

    @Builder.Default
    private Integer xpReward = 50;
}
