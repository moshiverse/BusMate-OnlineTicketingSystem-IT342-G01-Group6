package edu.cit.lgng.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bus_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusType {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String arrangement;
    private Integer capacity;
    private String description;
}
