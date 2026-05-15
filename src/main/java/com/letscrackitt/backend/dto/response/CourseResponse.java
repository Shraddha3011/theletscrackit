package com.letscrackitt.backend.dto.response;


import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {

    private Long id;

    private String title;

    private String slug;

    private String description;

    private String icon;

    private String color;

    private List<ModuleResponse> modules;
}