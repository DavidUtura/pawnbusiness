package ge.pawn.auth.service;

import ge.pawn.auth.UserRole;
import ge.pawn.auth.dto.AuthRequest;
import ge.pawn.auth.dto.AuthResponse;
import ge.pawn.auth.dto.RegisterRequest;
import ge.pawn.auth.entity.User;
import ge.pawn.auth.jwt.JwtTokenProvider;
import ge.pawn.auth.repository.UserRepository;
import ge.pawn.common.exception.ApiException;
import ge.pawn.lombard.entity.Lombard;
import ge.pawn.lombard.repository.LombardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final LombardRepository lombardRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomUserDetailsService userDetailsService;

    @Transactional
    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> ApiException.unauthorized("User not found"));

            String accessToken = tokenProvider.generateAccessToken(userDetails);
            String refreshToken = tokenProvider.generateRefreshToken(userDetails);

            user.setRefreshToken(refreshToken);
            userRepository.save(user);

            return new AuthResponse(accessToken, refreshToken, user.getRole().getValue());
        } catch (BadCredentialsException e) {
            throw ApiException.unauthorized("Invalid email or password");
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.badRequest("Email already registered");
        }

        Lombard lombard = null;
        if (request.getLombardId() != null && 
            (request.getRole() == UserRole.LOMBARD_ADMIN || request.getRole() == UserRole.LOMBARD_EMPLOYEE)) {
            lombard = lombardRepository.findById(request.getLombardId())
                .orElseThrow(() -> ApiException.notFound("Lombard", request.getLombardId()));
        }

        User user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .role(request.getRole())
            .lombard(lombard)
            .enabled(true)
            .build();

        userRepository.save(user);

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            user.isEnabled(),
            user.isAccountNonExpired(),
            user.isCredentialsNonExpired(),
            user.isAccountNonLocked(),
            java.util.Collections.singletonList(
                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                    "ROLE_" + user.getRole().getValue()
                )
            )
        );

        String accessToken = tokenProvider.generateAccessToken(userDetails);
        String refreshToken = tokenProvider.generateRefreshToken(userDetails);

        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return new AuthResponse(accessToken, refreshToken, user.getRole().getValue());
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken, 
            userDetailsService.loadUserByUsername(tokenProvider.getUsernameFromToken(refreshToken)))) {
            throw ApiException.unauthorized("Invalid refresh token");
        }

        String email = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> ApiException.unauthorized("User not found"));

        if (!refreshToken.equals(user.getRefreshToken())) {
            throw ApiException.unauthorized("Invalid refresh token");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String newAccessToken = tokenProvider.generateAccessToken(userDetails);
        String newRefreshToken = tokenProvider.generateRefreshToken(userDetails);

        user.setRefreshToken(newRefreshToken);
        userRepository.save(user);

        return new AuthResponse(newAccessToken, newRefreshToken, user.getRole().getValue());
    }

    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> ApiException.notFound("User", 0L));
        user.setRefreshToken(null);
        userRepository.save(user);
    }
}
