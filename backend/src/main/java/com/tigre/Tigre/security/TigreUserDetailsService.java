package com.tigre.Tigre.security;

import com.tigre.Tigre.entity.UserEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.tigre.Tigre.repository.UserRepository;

@Service
public class TigreUserDetailsService implements UserDetailsService {

    private final UserRepository repository;

    public TigreUserDetailsService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        UserEntity usuario = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: "
                + email));

        return new TigreUserDetails(usuario);
    }
}
