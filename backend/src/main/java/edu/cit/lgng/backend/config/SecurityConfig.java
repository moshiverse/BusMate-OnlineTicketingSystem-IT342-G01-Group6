package edu.cit.lgng.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler oauth2LoginSuccessHandler;
    private final JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // Define a RequestMatcher for API endpoints (optional, but good practice)
        RequestMatcher apiMatcher = request -> request.getRequestURI().startsWith("/api/");

        // Define the AuthenticationEntryPoint for API requests that require JWT
        AuthenticationEntryPoint apiEntryPoint = (HttpServletRequest req, HttpServletResponse res, org.springframework.security.core.AuthenticationException ex) -> {
            if (apiMatcher.matches(req)) {
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                res.setContentType("application/json");
                res.getWriter().write("{\"error\":\"Unauthorized\"}");
            } else {
                res.sendRedirect("/login");
            }
        };

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. Explicitly permit login, signup, and OAuth flow endpoints
                        .requestMatchers("/api/auth/login", "/api/auth/signup", "/oauth2/**", "/login/**").permitAll()

                        // Paymongo webhook
                        .requestMatchers("/api/paymongo/webhook").permitAll()

                        // 2. Allow access to unauthenticated resources (if any)
                        // .requestMatchers("/api/public/**").permitAll()

                        // 3. ALL other requests (including /api/auth/me) MUST be authenticated
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        // Use the custom entry point to handle 401s
                        .authenticationEntryPoint(apiEntryPoint)
                )
                .oauth2Login(oauth -> oauth
                        .successHandler(oauth2LoginSuccessHandler)
                )
                
                // CRUCIAL: Add the JWT filter to validate the Bearer token before the standard UsernamePasswordAuthenticationFilter runs
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}