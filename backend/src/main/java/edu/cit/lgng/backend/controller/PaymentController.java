package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.model.Payment;
import edu.cit.lgng.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService service;

    @PostMapping public Payment create(@RequestBody Payment p) {
        return service.create(p);
    }
}
