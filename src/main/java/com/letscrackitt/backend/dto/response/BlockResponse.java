package com.letscrackitt.backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockResponse {

    private Long id;

    private String type;

    private String data;

    private Integer displayOrder;
}