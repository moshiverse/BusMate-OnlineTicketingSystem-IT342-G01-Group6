package edu.cit.lgng.backend.service;

import edu.cit.lgng.backend.model.User;
import edu.cit.lgng.backend.model.User.Role;
import edu.cit.lgng.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Normal user signup
    public User signup(String name, String email, String rawPassword) {
        if (userRepository.findByEmail(email).isPresent())
            throw new RuntimeException("Email already exists");

        User user = User.builder()
                .name(name)
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(Role.USER)
                .createdAt(LocalDateTime.now())
                .build();
        return userRepository.save(user);
    }

    // Admin creation (by Super Admin)
    public User createAdmin(String name, String email, String rawPassword) {
        if (userRepository.findByEmail(email).isPresent())
            throw new RuntimeException("Email already exists");

        User admin = User.builder()
                .name(name)
                .email(email)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(Role.ADMIN)
                .createdAt(LocalDateTime.now())
                .build();
        return userRepository.save(admin);
    }

    // Login
    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(rawPassword, user.getPasswordHash()))
            throw new RuntimeException("Invalid credentials");

        return user;
    }

    // Promote/demote user
    @Transactional
    public User updateUserRole(Long targetUserId, Role newRole, User actingUser) {
        if (actingUser.getRole() != Role.SUPER_ADMIN)
            throw new RuntimeException("Only Super Admin can modify roles");

        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (target.getRole() == Role.SUPER_ADMIN && newRole != Role.SUPER_ADMIN)
            throw new RuntimeException("Cannot demote existing Super Admin — transfer ownership instead");

        target.setRole(newRole);
        return userRepository.save(target);
    }

    // Transfer Super Admin ownership
    @Transactional
    public void transferSuperAdmin(Long toUserId, User currentSuperAdmin) {
        if (currentSuperAdmin.getRole() != Role.SUPER_ADMIN)
            throw new RuntimeException("Only the Super Admin can transfer ownership");

        User newOwner = userRepository.findById(toUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        currentSuperAdmin.setRole(Role.ADMIN);
        newOwner.setRole(Role.SUPER_ADMIN);
        userRepository.save(currentSuperAdmin);
        userRepository.save(newOwner);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findOrCreateUser(String email, String name) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .name(name)
                                .email(email)
                                .role(Role.USER)
                                .createdAt(LocalDateTime.now())
                                .build()
                ));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}