package edu.cit.lgng.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequestDto {
    private String providerRef;
    private BigDecimal amount;
}
