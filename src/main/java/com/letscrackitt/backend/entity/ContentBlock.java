package com.letscrackitt.backend.entity;

import com.letscrackitt.backend.entity.enums.BlockType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private BlockType type;

    @Column(columnDefinition = "TEXT")
    private String data;

    private Integer displayOrder;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}