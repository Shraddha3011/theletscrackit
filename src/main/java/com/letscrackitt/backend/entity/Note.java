package com.letscrackitt.backend.entity;

import com.letscrackitt.backend.entity.enums.Difficulty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "notes", indexes = {
        @Index(name = "idx_notes_topic",  columnList = "topic_id"),
        @Index(name = "idx_notes_slug",   columnList = "slug")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(unique = true, nullable = false, length = 200)
    private String slug;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Difficulty difficulty = Difficulty.BEGINNER;

    /* Store tags as a simple comma-separated string to avoid
       needing the hypersistence-utils dependency for TEXT[] type.
       Service layer converts List<String> <-> CSV string.        */
    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String tags = "";

    @Column(name = "xp_reward")
    @Builder.Default
    private Integer xpReward = 10;

    @Column(name = "is_published")
    @Builder.Default
    private Boolean isPublished = false;

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}