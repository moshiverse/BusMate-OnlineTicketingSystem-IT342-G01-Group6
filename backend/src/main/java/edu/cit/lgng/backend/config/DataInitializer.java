package edu.cit.lgng.backend.config;

import edu.cit.lgng.backend.model.User;
import edu.cit.lgng.backend.model.User.Role;
import edu.cit.lgng.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String superEmail = "lgang.busmate@gmail.com";
        if (userRepository.findByEmail(superEmail).isEmpty()) {
            User superAdmin = User.builder()
                    .name("Super Admin")
                    .email(superEmail)
                    .passwordHash(passwordEncoder.encode("super123"))
                    .role(User.Role.SUPER_ADMIN)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(superAdmin);
            System.out.println("Created initial Super Admin: " + superEmail + " / super123");
        } else {
            System.out.println("Super admin already exists, skipping creation.");
        }
    }
}

