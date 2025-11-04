package edu.cit.lgng.backend.config;

import edu.cit.lgng.backend.model.User;
import edu.cit.lgng.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        org.springframework.security.core.Authentication authentication)
            throws IOException {
        DefaultOAuth2User oUser = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oUser.getAttribute("email");
        String name = oUser.getAttribute("name");

        // ensure user exists
        User user = userService.findOrCreateUser(email, name);

        // build authorities from DB role
        var mappedUser = new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority(user.getRole().name())),
                oUser.getAttributes(),
                "email"
        );

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(mappedUser, null, mappedUser.getAuthorities())
        );

        // persist Spring Security context to session for subsequent requests
        request.getSession(true).setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

        // Return JSON with user info instead of redirecting to Google's web UI
        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"ok\",\"email\":\"" + user.getEmail() + "\",\"role\":\"" + user.getRole().name() + "\"}");
    }
}
