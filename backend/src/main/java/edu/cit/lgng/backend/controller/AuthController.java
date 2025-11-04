package edu.cit.lgng.backend.controller;

import edu.cit.lgng.backend.dto.UserInfoDto;
import edu.cit.lgng.backend.dto.UserPublicDto;
import edu.cit.lgng.backend.model.User;
import edu.cit.lgng.backend.model.User.Role;
import edu.cit.lgng.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        User user = userService.signup(body.get("name"), body.get("email"), body.get("password"));
        return ResponseEntity.ok(new UserInfoDto(user.getId(), user.getName(), user.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request) {
        User user = userService.login(body.get("email"), body.get("password"));

        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                user, null, List.of(new SimpleGrantedAuthority(user.getRole().name()))
        );
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // persist authentication in session
        request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        return ResponseEntity.ok(new UserInfoDto(user.getId(), user.getName(), user.getEmail()));
    }


    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if (auth == null || !auth.isAuthenticated())
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));

        Object principal = auth.getPrincipal();

        // case: manual login where we stored the User object as principal
        if (principal instanceof edu.cit.lgng.backend.model.User u) {
            return ResponseEntity.ok(new UserInfoDto(u.getId(), u.getName(), u.getEmail()));
        }

        // case: we stored DefaultOAuth2User mapped by OAuth2LoginSuccessHandler
        if (principal instanceof DefaultOAuth2User oUser) {
            String email = oUser.getAttribute("email");
            String name = oUser.getAttribute("name");
            User user = userService.findOrCreateUser(email, name);
            return ResponseEntity.ok(new UserInfoDto(user.getId(), user.getName(), user.getEmail()));
        }

        // case: principal is UsernamePasswordAuthenticationToken wrapping DefaultOAuth2User
        if (auth.getPrincipal() instanceof org.springframework.security.core.userdetails.User springUser) {
            // optional: map to your DB user by username (which may be email)
            String email = springUser.getUsername();
            User user = userService.findByEmail(email);
            return ResponseEntity.ok(new UserInfoDto(user.getId(), user.getName(), user.getEmail()));
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Unsupported authentication type"));
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
        User acting = userService.findByEmail(((DefaultOAuth2User) auth.getPrincipal()).getAttribute("email"));
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
        if (p instanceof org.springframework.security.core.userdetails.User su) return su.getUsername();
        return null;
    }
}
