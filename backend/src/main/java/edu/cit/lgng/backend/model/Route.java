package edu.cit.lgng.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "routes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String origin;
    private String destination;

    @Column(name = "distance_km")
    private Integer distanceKm;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;
}
