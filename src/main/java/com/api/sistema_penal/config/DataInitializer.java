package com.api.sistema_penal.config;

import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Inicializador de dados padrão do sistema.
 * Cria o usuário admin padrão na primeira execução.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Credenciais do admin padrão
    private static final String ADMIN_EMAIL = "admin@sistema.gov.ao";
    private static final String ADMIN_SENHA = "admin123";
    private static final String ADMIN_NOME = "Administrador do Sistema";

    @Override
    public void run(String... args) {
        criarUsuarioAdminSeNaoExistir();
    }

    private void criarUsuarioAdminSeNaoExistir() {
        Optional<Usuario> adminExistente = usuarioRepository.findByEmail(ADMIN_EMAIL);
        
        if (adminExistente.isEmpty()) {
            Usuario admin = Usuario.builder()
                    .email(ADMIN_EMAIL)
                    .senhaHash(passwordEncoder.encode(ADMIN_SENHA))
                    .nome(ADMIN_NOME)
                    .role(Usuario.Role.ADMIN)
                    .ativo(true)
                    .build();
            
            usuarioRepository.save(admin);
            log.info("=== USUÁRIO ADMIN CRIADO COM SUCESSO ===");
            log.info("Email: {}", ADMIN_EMAIL);
            log.info("Senha: {}", ADMIN_SENHA);
            log.info("=========================================");
        } else {
            log.info("Usuário admin já existe no banco de dados");
        }
    }
}
