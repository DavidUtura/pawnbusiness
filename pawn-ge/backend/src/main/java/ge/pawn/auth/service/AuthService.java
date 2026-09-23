package ge.pawn.auth.service;

import ge.pawn.auth.dto.AuthDtos.*;
import ge.pawn.auth.model.User;
import ge.pawn.auth.repository.UserRepository;
import ge.pawn.common.model.UserRole;
import ge.pawn.lombard.model.Lombard;
import ge.pawn.lombard.repository.LombardRepository;
import ge.pawn.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final LombardRepository lombardRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        // Registration always creates a CUSTOMER. Seller privileges are granted
        // only after partner application approval (see PartnerService).
        user.setRole(UserRole.CUSTOMER);
        user.setEnabled(true);
        user = userRepository.save(user);
        return issueTokens(user);
    }

    @Transactional
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AccessDeniedException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()) || !user.isEnabled()) {
            throw new AccessDeniedException("Invalid credentials");
        }
        return issueTokens(user);
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        if (!jwtService.isValid(refreshToken)) {
            throw new AccessDeniedException("Invalid refresh token");
        }
        String email = jwtService.parse(refreshToken).getSubject();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
            throw new AccessDeniedException("Refresh token revoked");
        }
        return issueTokens(user);
    }

    @Transactional
    public void logout(Long userId, String refreshToken) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setRefreshToken(null);
            userRepository.save(user);
        });
    }

    /**
     * Grants Lombard Admin access after partner application approval.
     * Creates the tenant Lombard and links the applicant user to it.
     */
    @Transactional
    public User approveAsLombardAdmin(Long userId, Lombard lombard) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setRole(UserRole.LOMBARD_ADMIN);
        user.setLombard(lombard);
        return userRepository.save(user);
    }

    private TokenResponse issueTokens(User user) {
        Long lombardId = user.getLombard() != null ? user.getLombard().getId() : null;
        String access = jwtService.generateAccessToken(user.getEmail(), user.getRole().name(), lombardId);
        String refresh = jwtService.generateRefreshToken(user.getEmail());
        user.setRefreshToken(refresh);
        userRepository.save(user);
        TokenResponse response = new TokenResponse();
        response.setAccessToken(access);
        response.setRefreshToken(refresh);
        response.setRole(user.getRole().name());
        response.setLombardId(lombardId);
        return response;
    }
}
