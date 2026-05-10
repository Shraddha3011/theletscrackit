package com.letscrackitt.backend.dto.response;

import com.letscrackitt.backend.entity.Comment;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    private Long id;
    private Long noteId;
    private Long parentId;
    private String body;
    private Integer likes;
    private LocalDateTime createdAt;
    private AuthorInfo author;
    private List<CommentResponse> replies;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthorInfo {
        private Long id;
        private String username;
        private String fullName;
        private String avatarUrl;
    }

    public static CommentResponse from(Comment c, List<CommentResponse> replies) {
        return CommentResponse.builder()
                .id(c.getId())
                .noteId(c.getNote().getId())
                .parentId(c.getParent() != null ? c.getParent().getId() : null)
                .body(c.getBody())
                .likes(c.getLikes())
                .createdAt(c.getCreatedAt())
                .author(AuthorInfo.builder()
                        .id(c.getUser().getId())
                        .username(c.getUser().getUsername())
                        .fullName(c.getUser().getFullName())
                        .avatarUrl(c.getUser().getAvatarUrl())
                        .build())
                .replies(replies)
                .build();
    }
}