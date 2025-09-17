package com.tigre.Tigre.dto;

import com.tigre.Tigre.enumeration.TigrePerfil;

public record UserDTO(
        String name,
        String email,
        String password,
        TigrePerfil perfil
) {
}
