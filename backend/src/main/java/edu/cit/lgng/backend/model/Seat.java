package edu.cit.lgng.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"schedule_id", "seat_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Column(name = "row_index")
    private Integer rowIndex;

    @Column(name = "col_index")
    private Integer colIndex;

    @Column(name = "seat_type")
    private String seatType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        AVAILABLE,
        RESERVED,
        OCCUPIED
    }
}
