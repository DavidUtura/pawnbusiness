package ge.pawn.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException ex, 
            org.springframework.web.context.request.WebRequest request) {
        log.warn("API Exception: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(ex.getStatus(), ex.getMessage(), ex.getCode(), 
            request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(error, ex.getStatus());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex,
            org.springframework.web.context.request.WebRequest request) {
        log.warn("Business Exception: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(HttpStatus.BAD_REQUEST, ex.getMessage(), 
            request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex,
            org.springframework.web.context.request.WebRequest request) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> String.format("%s: %s", error.getField(), error.getDefaultMessage()))
            .collect(Collectors.toList());
        
        log.warn("Validation Exception: {}", errors);
        ErrorResponse error = ErrorResponse.withValidationErrors(
            HttpStatus.BAD_REQUEST, "Validation failed", errors, 
            request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex,
            org.springframework.web.context.request.WebRequest request) {
        log.warn("Bad Credentials: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(HttpStatus.UNAUTHORIZED, "Invalid credentials", 
            request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex,
            org.springframework.web.context.request.WebRequest request) {
        log.warn("Access Denied: {}", ex.getMessage());
        ErrorResponse error = ErrorResponse.of(HttpStatus.FORBIDDEN, "Access denied", 
            request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFoundException(NoResourceFoundException ex,
            org.springframework.web.context.request.WebRequest request) {
        ErrorResponse error = ErrorResponse.of(HttpStatus.NOT_FOUND, "Resource not found", 
            request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex,
            org.springframework.web.context.request.WebRequest request) {
        log.error("Unexpected exception", ex);
        ErrorResponse error = ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, 
            "An unexpected error occurred", request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
