package ge.pawn.common;

import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;

/**
 * Aspect for automatically logging administrative actions.
 * Can be enhanced to capture method parameters and return values as JSON.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @Pointcut("@annotation(ge.pawn.common.Auditable)")
    public void auditableMethod() {}

    @Before("auditableMethod()")
    public void logBefore(JoinPoint joinPoint) {
        // Capture action before execution if needed
    }

    @AfterReturning(pointcut = "auditableMethod()", returning = "result")
    public void logAfter(JoinPoint joinPoint, Object result) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        
        // Extract user context from security context (simplified)
        String userId = "system"; // Should extract from SecurityContext
        String userName = "System";
        UUID lombardId = null;

        AuditLog auditLog = AuditLog.builder()
                .userId(userId)
                .userName(userName)
                .action(joinPoint.getSignature().getName())
                .entityType(extractEntityType(joinPoint))
                .entityId(UUID.randomUUID()) // Should extract from method arguments
                .ipAddress(request.getRemoteAddr())
                .userAgent(request.getHeader("User-Agent"))
                .lombardId(lombardId)
                .build();

        auditLogRepository.save(auditLog);
    }

    private String extractEntityType(JoinPoint joinPoint) {
        // Extract entity type from method signature or annotations
        return "UNKNOWN";
    }
}
