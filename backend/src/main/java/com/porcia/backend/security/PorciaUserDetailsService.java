package com.porcia.backend.security;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class PorciaUserDetailsService {

    // foundation only: no DB lookup (no business logic)
    public UserDetails loadUserBySubject(String subject) {
        // default: empty authorities, scaffold for RBAC integration
        return User.withUsername(subject)
                .password("")
                .authorities(Collections.emptyList())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
    }
}

