package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.User;
import edu.cit.lgng.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// service/AuthService.java
@Service @RequiredArgsConstructor
public class AuthService {
    private final UserRepository repo;
    public User findByEmail(String email){return repo.findByEmail(email).orElse(null);}
}

