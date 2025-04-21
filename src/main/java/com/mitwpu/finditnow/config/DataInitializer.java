import com.mitwpu.finditnow.model.User;
import com.mitwpu.finditnow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@mitwpu.edu.in")) {
            User adminUser = User.builder()
                .name("Admin User")
                .email("admin@mitwpu.edu.in")
                .password(passwordEncoder.encode("admin123"))
                .department("Computer Engineering")
                .role("ROLE_ADMIN")
                .build();

            userRepository.save(adminUser);
            System.out.println(
                "Admin user created: admin@mitwpu.edu.in / admin123"
            );
        }
    }
}
