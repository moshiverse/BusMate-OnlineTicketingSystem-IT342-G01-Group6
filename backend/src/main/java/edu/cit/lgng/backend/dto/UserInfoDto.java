package edu.cit.lgng.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserInfoDto {
    private Long id;
    private String name;
    private String email;
}
