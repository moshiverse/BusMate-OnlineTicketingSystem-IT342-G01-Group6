package edu.cit.lgng.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booking_seats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSeat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(optional = false)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;
}
