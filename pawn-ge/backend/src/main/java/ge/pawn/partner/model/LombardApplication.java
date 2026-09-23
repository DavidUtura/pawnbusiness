package ge.pawn.partner.model;

import ge.pawn.common.model.ApplicationStatus;
import ge.pawn.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "lombard_applications")
@Getter
@Setter
public class LombardApplication extends BaseEntity {

    @Column(nullable = false)
    private Long applicantUserId;

    private Long lombardId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    // Business information submitted by the applicant
    private String displayName;
    private String legalName;
    private String taxId;
    private String contactName;
    private String phone;
    private String email;
    private String website;
    private Integer branchCount;
    private String categories;   // comma-separated
    private String address;
    private String workingHours;
    private Boolean deliveryAvailable;
    private Boolean pickupAvailable;

    private Instant submittedAt;
    private Instant reviewedAt;
    private Long reviewerId;
    @Column(length = 2000)
    private String reviewNotes;
}
