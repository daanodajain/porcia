package com.porcia.backend.security;

import com.porcia.backend.api.ApiVersion;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
@EnableConfigurationProperties({JwtProperties.class, SecurityProperties.class})
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final PorciaAuthEntryPoint authEntryPoint;
    private final PorciaAccessDeniedHandler accessDeniedHandler;
    private final SecurityProperties securityProperties;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          PorciaAuthEntryPoint authEntryPoint,
                          PorciaAccessDeniedHandler accessDeniedHandler,
                          SecurityProperties securityProperties) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authEntryPoint = authEntryPoint;
        this.accessDeniedHandler = accessDeniedHandler;
        this.securityProperties = securityProperties;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint(authEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers(ApiVersion.V1 + "/auth/**").permitAll()
                        .requestMatchers(ApiVersion.V1 + "/customer/auth/**").permitAll()
                        .requestMatchers(ApiVersion.V1 + "/payments/razorpay/webhook").permitAll()
                        .requestMatchers(HttpMethod.GET, ApiVersion.V1 + "/public/**").permitAll()
                        .requestMatchers(HttpMethod.GET, ApiVersion.V1 + "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, ApiVersion.V1 + "/journal/**").permitAll()
                        // Allow public GET access to CMS content (read-only)
                        .requestMatchers(HttpMethod.GET, ApiVersion.V1 + "/cms/**").permitAll()
                        // Protect CMS write operations with authentication (authorization handled by @Secured)
                        .requestMatchers(HttpMethod.POST, ApiVersion.V1 + "/cms/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, ApiVersion.V1 + "/cms/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, ApiVersion.V1 + "/cms/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        String origins = System.getenv("CORS_ORIGINS");
        if (origins != null && !origins.isBlank()) {
            config.setAllowedOrigins(Arrays.asList(origins.split(",")));
        } else {
            config.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:3001"));
        }
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        // Whitelist specific headers instead of allowing all
        config.setAllowedHeaders(List.of("Content-Type", "Authorization", "Accept", "X-Requested-With"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
