package ge.pawn.partner.repository;

import ge.pawn.common.model.ApplicationStatus;
import ge.pawn.partner.model.LombardApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LombardApplicationRepository extends JpaRepository<LombardApplication, Long> {
    Optional<LombardApplication> findFirstByApplicantUserIdOrderByCreatedAtDesc(Long applicantUserId);
    List<LombardApplication> findByStatus(ApplicationStatus status);
}
