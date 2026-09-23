package ge.pawn.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDtos {

    @Data
    public static class RegisterRequest {
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 8) private String password;
        @NotBlank private String firstName;
        private String lastName;
        @NotBlank private String phoneNumber;
    }

    @Data
    public static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;
    }

    @Data
    public static class RefreshRequest {
        @NotBlank private String refreshToken;
    }

    @Data
    public static class TokenResponse {
        private String accessToken;
        private String refreshToken;
        private String role;
        private Long lombardId;
    }

    @Data
    public static class MeResponse {
        private Long id;
        private String email;
        private String firstName;
        private String lastName;
        private String role;
        private Long lombardId;
        private String applicationStatus;
    }
}
