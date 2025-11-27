package edu.cit.lgng.backend.dto;

import edu.cit.lgng.backend.model.Bus;
import lombok.Data;

@Data
public class BusCreateDto {
    private String busNumber;
    private String plateNo;
    private Long busTypeId;
    private Bus.Status status;
}
