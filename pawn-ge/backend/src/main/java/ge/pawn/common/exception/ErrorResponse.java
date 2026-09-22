package ge.pawn.common.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private HttpStatus status;
    private String message;
    private String code;
    private List<String> errors;
    private String path;

    public static ErrorResponse of(HttpStatus status, String message, String path) {
        return new ErrorResponse(LocalDateTime.now(), status, message, null, null, path);
    }

    public static ErrorResponse of(HttpStatus status, String message, String code, String path) {
        return new ErrorResponse(LocalDateTime.now(), status, message, code, null, path);
    }

    public static ErrorResponse withValidationErrors(HttpStatus status, String message, List<String> errors, String path) {
        return new ErrorResponse(LocalDateTime.now(), status, message, null, errors, path);
    }
}
