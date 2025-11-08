package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.config.JwtUtil;
import edu.cit.lgng.backend.dto.LoginResponseDto;
import edu.cit.lgng.backend.dto.UserInfoDto;
import edu.cit.lgng.backend.dto.UserPublicDto;
import edu.cit.lgng.backend.model.User;
import edu.cit.lgng.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        User user = userService.signup(body.get("name"), body.get("email"), body.get("password"));
        String token = jwtUtil.generateToken(user);

        UserInfoDto userInfo = new UserInfoDto(user.getId(), user.getName(), user.getEmail());
        LoginResponseDto response = new LoginResponseDto(token, userInfo);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(body.get("email"), body.get("password"))
        );

        final User user = userService.findByEmail(body.get("email"));
        final String token = jwtUtil.generateToken(user);

        UserInfoDto userInfo = new UserInfoDto(user.getId(), user.getName(), user.getEmail());
        LoginResponseDto response = new LoginResponseDto(token, userInfo);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {


        if (authentication == null ||
                !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {

            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        Object principal = authentication.getPrincipal();

        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof User) {
            email = ((User) principal).getEmail();
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        User user = userService.findByEmail(email);
        return ResponseEntity.ok(new UserInfoDto(user.getId(), user.getName(), user.getEmail()));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<UserPublicDto>> getAllUsers() {
        List<UserPublicDto> users = userService.getAllUsers().stream()
                .map(u -> new UserPublicDto(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.getCreatedAt()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> body) {
        User admin = userService.createAdmin(body.get("name"), body.get("email"), body.get("password"));
        return ResponseEntity.ok(new UserInfoDto(admin.getId(), admin.getName(), admin.getEmail()));
    }

    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @PatchMapping("/update-role/{id}")
    public ResponseEntity<?> updateRole(
            @PathVariable Long id,
            @RequestParam String role,
            Authentication auth
    ) {
        String email = getEmailFromAuth(auth);
        User acting = userService.findByEmail(email);
        User.Role newRole = User.Role.valueOf(role.toUpperCase());
        User updated = userService.updateUserRole(id, newRole, acting);
        return ResponseEntity.ok(Map.of("message", "Role updated", "newRole", updated.getRole().name()));
    }

    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @PostMapping("/transfer-super-admin/{toUserId}")
    public ResponseEntity<?> transferSuperAdmin(@PathVariable Long toUserId, Authentication auth) {
        String email = getEmailFromAuth(auth);
        if (email == null)
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        User acting = userService.findByEmail(email);
        userService.transferSuperAdmin(toUserId, acting);

        return ResponseEntity.ok(Map.of("message", "Super Admin ownership transferred successfully"));
    }


    private String getEmailFromAuth(Authentication auth) {
        Object p = auth.getPrincipal();
        if (p instanceof DefaultOAuth2User o) return o.getAttribute("email");
        if (p instanceof User u) return u.getEmail();
        if (p instanceof UserDetails su) return su.getUsername();
        return null;
    }
}