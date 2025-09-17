package com.tigre.Tigre.dto;

import com.tigre.Tigre.enumeration.TigrePerfil;

public record UserRequestDTO(
        String name,
        String email,
        String password,
        TigrePerfil perfil
) {
}
