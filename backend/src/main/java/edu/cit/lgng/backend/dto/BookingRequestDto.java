package edu.cit.lgng.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import jakarta.validation.constraints.*;

@Data
public class BookingRequestDto {
    @NotNull @Min(1)
    private Long userId;
    @NotNull @Min(1)
    private Long scheduleId;
    @NotNull @DecimalMin("0.01")
    private BigDecimal amount;
    @NotEmpty
    private List<String> seatNumbers;
}