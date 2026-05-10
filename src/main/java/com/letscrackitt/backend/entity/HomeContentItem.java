package com.letscrackitt.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "home_content_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeContentItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String section;

    private String icon;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String accent;

    private Integer orderIndex;
}
