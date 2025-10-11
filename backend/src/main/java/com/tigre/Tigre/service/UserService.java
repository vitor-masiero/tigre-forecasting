package com.tigre.Tigre.service;

import com.tigre.Tigre.dto.UserRequestDTO;
import com.tigre.Tigre.entity.UserEntity;
import com.tigre.Tigre.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserEntity createUser(UserRequestDTO userRequestDTO) {
        if (userRepository.findByEmail(userRequestDTO.email()).isPresent()) {
            throw new RuntimeException("Usuário com o email " + userRequestDTO.email() + " já existente");
        }

        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(userRequestDTO, userEntity);
        // codifica a senha
        userEntity.setPassword(passwordEncoder.encode(userRequestDTO.password()));

        return userRepository.save(userEntity);
    }
}
