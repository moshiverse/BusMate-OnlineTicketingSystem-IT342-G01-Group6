package edu.cit.lgng.backend.config;

import edu.cit.lgng.backend.model.User;
import edu.cit.lgng.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        DefaultOAuth2User oUser = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oUser.getAttribute("email");
        String name = oUser.getAttribute("name");

        User user = userService.upsertOAuthUser(email, name);

        String jwt = jwtUtil.generateToken(user);

        String redirectUrl = "http://localhost:3000/oauth2/redirect?token=" + jwt;
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
