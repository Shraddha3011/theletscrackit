package com.letscrackitt.backend.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModuleResponse {

    private Long id;

    private String title;

    private Integer displayOrder;

    private List<LessonCardResponse> lessons;
}