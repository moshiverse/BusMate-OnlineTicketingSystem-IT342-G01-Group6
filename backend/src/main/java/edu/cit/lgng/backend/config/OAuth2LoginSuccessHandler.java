package edu.cit.lgng.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.cit.lgng.backend.dto.LoginResponseDto;
import edu.cit.lgng.backend.dto.UserInfoDto;
import edu.cit.lgng.backend.model.User;
import edu.cit.lgng.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException {
        clearAuthenticationAttributes(request);

        DefaultOAuth2User oUser = (DefaultOAuth2User) authentication.getPrincipal();
        String email = oUser.getAttribute("email");
        String name = oUser.getAttribute("name");

        User user = userService.findOrCreateUser(email, name);
        String jwt = jwtUtil.generateToken(user);

        UserInfoDto userInfo = new UserInfoDto(user.getId(), user.getName(), user.getEmail());
        LoginResponseDto loginResponse = new LoginResponseDto(jwt, userInfo);

        response.setContentType("application/json");
        response.getWriter().write(objectMapper.writeValueAsString(loginResponse));
    }
}