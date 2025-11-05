package edu.cit.lgng.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", nullable = false, unique = true)
    private String busNumber;

    @Column(name = "plate_no")
    private String plateNo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "bus_type_id", nullable = false)
    private BusType busType;

    private String amenities;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        ACTIVE,
        INACTIVE,
        UNDER_MAINTENANCE
    }
}
