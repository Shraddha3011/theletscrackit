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
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(unique = true)
    private String slug;

    @Column(length = 3000)
    private String description;

    private Integer displayOrder;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;

    @OneToMany(
            mappedBy = "lesson",
            cascade = CascadeType.ALL
    )
    private List<ContentBlock> blocks;

    @Builder.Default
    private Integer likes = 0;
}