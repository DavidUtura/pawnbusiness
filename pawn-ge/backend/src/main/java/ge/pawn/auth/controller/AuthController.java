package ge.pawn.auth.controller;

import ge.pawn.auth.dto.AuthDtos.*;
import ge.pawn.auth.model.User;
import ge.pawn.auth.service.AuthService;
import ge.pawn.partner.repository.LombardApplicationRepository;
import ge.pawn.security.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final LombardApplicationRepository applicationRepository;

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request.getRefreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        User user = CurrentUser.require();
        authService.logout(user.getId(), user.getRefreshToken());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> me() {
        User user = CurrentUser.require();
        MeResponse me = new MeResponse();
        me.setId(user.getId());
        me.setEmail(user.getEmail());
        me.setFirstName(user.getFirstName());
        me.setLastName(user.getLastName());
        me.setRole(user.getRole().name());
        me.setLombardId(user.getLombard() != null ? user.getLombard().getId() : null);
        applicationRepository.findFirstByApplicantUserIdOrderByCreatedAtDesc(user.getId())
                .ifPresent(app -> me.setApplicationStatus(app.getStatus().name()));
        return ResponseEntity.ok(me);
    }
}
