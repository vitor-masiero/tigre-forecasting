import bcrypt


class PasswordHandler:
    """
    Handler para hash e verificação de senhas usando bcrypt
    
    Bcrypt é ideal para senhas porque:
    - Adiciona salt automaticamente
    - É computacionalmente custoso (dificulta ataques de força bruta)
    - Possui rounds configuráveis para aumentar segurança
    """

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Gera hash bcrypt da senha
        
        Args:
            password: Senha em texto plano
            
        Returns:
            Hash bcrypt como string
            
        Example:
            >>> hash_senha = PasswordHandler.hash_password("minhasenha123")
            >>> print(hash_senha)
            $2b$12$KIXxKj9Z3qZ8... (60 caracteres)
        """
        # Converte string para bytes
        password_bytes = password.encode('utf-8')
        
        # Gera salt e hash (rounds=12 é o padrão recomendado)
        salt = bcrypt.gensalt(rounds=12)
        hashed = bcrypt.hashpw(password_bytes, salt)
        
        # Retorna como string
        return hashed.decode('utf-8')

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verifica se a senha em texto plano corresponde ao hash
        
        Args:
            plain_password: Senha em texto plano (do formulário de login)
            hashed_password: Hash armazenado no banco de dados
            
        Returns:
            True se a senha estiver correta, False caso contrário
            
        Example:
            >>> hash_armazenado = "$2b$12$KIXxKj9Z3qZ8..."
            >>> PasswordHandler.verify_password("minhasenha123", hash_armazenado)
            True
            >>> PasswordHandler.verify_password("senhaerrada", hash_armazenado)
            False
        """
        try:
            # Converte ambos para bytes
            password_bytes = plain_password.encode('utf-8')
            hashed_bytes = hashed_password.encode('utf-8')
            
            # Verifica se o hash corresponde
            return bcrypt.checkpw(password_bytes, hashed_bytes)
        
        except Exception as e:
            print(f"❌ Erro ao verificar senha: {e}")
            return False

    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, str]:
        """
        Valida força da senha (regras customizáveis)
        
        Regras atuais:
        - Mínimo 6 caracteres
        - Pelo menos 1 letra
        - Pelo menos 1 número
        
        Args:
            password: Senha a ser validada
            
        Returns:
            Tupla (válido, mensagem)
            
        Example:
            >>> PasswordHandler.validate_password_strength("senha123")
            (True, "Senha válida")
            >>> PasswordHandler.validate_password_strength("abc")
            (False, "Senha deve ter no mínimo 6 caracteres")
        """
        if len(password) < 6:
            return False, "Senha deve ter no mínimo 6 caracteres"
        
        if not any(char.isalpha() for char in password):
            return False, "Senha deve conter pelo menos uma letra"
        
        if not any(char.isdigit() for char in password):
            return False, "Senha deve conter pelo menos um número"
        
        return True, "Senha válida"