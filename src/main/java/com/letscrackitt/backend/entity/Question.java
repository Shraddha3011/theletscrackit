package com.letscrackitt.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "option_a", nullable = false, length = 500)
    private String optionA;

    @Column(name = "option_b", nullable = false, length = 500)
    private String optionB;

    @Column(name = "option_c", length = 500)
    private String optionC;

    @Column(name = "option_d", length = 500)
    private String optionD;

    @Column(name = "correct_option", nullable = false, length = 1)
    private String correctOption;  // "A" | "B" | "C" | "D"

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "order_index")
    @Builder.Default
    private Integer orderIndex = 0;
}