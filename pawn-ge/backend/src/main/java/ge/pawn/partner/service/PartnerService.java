package ge.pawn.partner.service;

import ge.pawn.auth.service.AuthService;
import ge.pawn.common.model.ApplicationStatus;
import ge.pawn.lombard.model.Lombard;
import ge.pawn.lombard.repository.LombardRepository;
import ge.pawn.partner.dto.PartnerDtos.*;
import ge.pawn.partner.model.LombardApplication;
import ge.pawn.partner.repository.LombardApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartnerService {

    private final LombardApplicationRepository applicationRepository;
    private final LombardRepository lombardRepository;
    private final AuthService authService;

    @Transactional
    public ApplicationResponse submitApplication(Long applicantUserId, SubmitApplicationRequest request) {
        LombardApplication app = applicationRepository
                .findFirstByApplicantUserIdOrderByCreatedAtDesc(applicantUserId)
                .filter(a -> a.getStatus() == ApplicationStatus.PENDING
                        || a.getStatus() == ApplicationStatus.MORE_INFORMATION_REQUIRED)
                .orElseGet(() -> {
                    LombardApplication a = new LombardApplication();
                    a.setApplicantUserId(applicantUserId);
                    return a;
                });

        if (app.getStatus() == ApplicationStatus.APPROVED || app.getStatus() == ApplicationStatus.REJECTED) {
            throw new IllegalStateException("Application already decided");
        }

        app.setDisplayName(request.getDisplayName());
        app.setLegalName(request.getLegalName());
        app.setTaxId(request.getTaxId());
        app.setContactName(request.getContactName());
        app.setPhone(request.getPhone());
        app.setEmail(request.getEmail());
        app.setWebsite(request.getWebsite());
        app.setBranchCount(request.getBranchCount());
        app.setCategories(joinCategories(request.getCategories()));
        app.setAddress(request.getAddress());
        app.setWorkingHours(request.getWorkingHours());
        app.setDeliveryAvailable(request.getDeliveryAvailable());
        app.setPickupAvailable(request.getPickupAvailable());
        app.setStatus(ApplicationStatus.PENDING);
        app.setSubmittedAt(Instant.now());

        return toResponse(applicationRepository.save(app));
    }

    @Transactional(readOnly = true)
    public ApplicationResponse getMyApplication(Long applicantUserId) {
        return applicationRepository.findFirstByApplicantUserIdOrderByCreatedAtDesc(applicantUserId)
                .map(this::toResponse)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> listByStatus(ApplicationStatus status) {
        List<LombardApplication> apps = status == null
                ? applicationRepository.findAll()
                : applicationRepository.findByStatus(status);
        return apps.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * Super Admin review. On APPROVAL:
     *  - creates the Lombard tenant
     *  - promotes the applicant to LOMBARD_ADMIN bound to that tenant
     */
    @Transactional
    public ApplicationResponse review(Long reviewerUserId, Long applicationId, ReviewRequest request) {
        LombardApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));

        ApplicationStatus decision;
        try {
            decision = ApplicationStatus.valueOf(request.getDecision());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid decision");
        }
        if (decision == ApplicationStatus.PENDING) {
            throw new IllegalArgumentException("Invalid decision");
        }

        app.setStatus(decision);
        app.setReviewedAt(Instant.now());
        app.setReviewerId(reviewerUserId);
        app.setReviewNotes(request.getReviewNotes());

        if (decision == ApplicationStatus.APPROVED && app.getLombardId() == null) {
            Lombard lombard = new Lombard();
            lombard.setName(app.getDisplayName());
            lombard.setSlug(slugify(app.getDisplayName()));
            lombard.setPhoneNumber(app.getPhone());
            lombard.setEmail(app.getEmail());
            lombard.setWebsite(app.getWebsite());
            lombard.setAddress(app.getAddress());
            lombard.setActive(true);
            lombard = lombardRepository.save(lombard);

            app.setLombardId(lombard.getId());
            authService.approveAsLombardAdmin(app.getApplicantUserId(), lombard);
        }

        return toResponse(applicationRepository.save(app));
    }

    private String slugify(String name) {
        String base = name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        String slug = base.isEmpty() ? "lombard" : base;
        int i = 1;
        while (lombardRepository.findBySlug(slug).isPresent()) {
            slug = base + "-" + (++i);
        }
        return slug;
    }

    private String joinCategories(List<String> categories) {
        return categories == null || categories.isEmpty() ? null : String.join(",", categories);
    }

    private List<String> splitCategories(String categories) {
        return categories == null || categories.isBlank()
                ? List.of()
                : Arrays.stream(categories.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
    }

    private ApplicationResponse toResponse(LombardApplication app) {
        ApplicationResponse r = new ApplicationResponse();
        r.setId(app.getId());
        r.setStatus(app.getStatus().name());
        r.setDisplayName(app.getDisplayName());
        r.setLegalName(app.getLegalName());
        r.setContactName(app.getContactName());
        r.setPhone(app.getPhone());
        r.setEmail(app.getEmail());
        r.setWebsite(app.getWebsite());
        r.setBranchCount(app.getBranchCount());
        r.setCategories(splitCategories(app.getCategories()));
        r.setAddress(app.getAddress());
        r.setWorkingHours(app.getWorkingHours());
        r.setDeliveryAvailable(app.getDeliveryAvailable());
        r.setPickupAvailable(app.getPickupAvailable());
        r.setSubmittedAt(app.getSubmittedAt() != null ? app.getSubmittedAt().toString() : null);
        r.setReviewedAt(app.getReviewedAt() != null ? app.getReviewedAt().toString() : null);
        r.setReviewNotes(app.getReviewNotes());
        r.setLombardId(app.getLombardId());
        return r;
    }
}
