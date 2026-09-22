package ge.pawn.common;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Audit Log Entity
 * Tracks every sensitive administrative action for compliance and debugging.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String action; // CREATE, UPDATE, DELETE, LOGIN, APPROVE, etc.

    @Column(nullable = false)
    private String entityType; // PRODUCT, ORDER, USER, etc.

    @Column(nullable = false)
    private UUID entityId;

    @Column(columnDefinition = "TEXT")
    private String previousValue; // JSON snapshot

    @Column(columnDefinition = "TEXT")
    private String newValue; // JSON snapshot

    @Column(nullable = false)
    private String ipAddress;

    @Column(nullable = false)
    private String userAgent;

    @Column(nullable = false)
    private UUID lombardId; // Tenant ID (null for Super Admin actions)

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant timestamp;
}
