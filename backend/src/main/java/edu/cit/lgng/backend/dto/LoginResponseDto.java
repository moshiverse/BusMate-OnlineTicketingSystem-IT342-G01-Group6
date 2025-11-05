package edu.cit.lgng.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDto {
    private String token;
    private UserInfoDto user; // We will reuse the UserInfoDto you already have
}