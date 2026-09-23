package ge.pawn.superadmin.controller;

import ge.pawn.common.Auditable;
import ge.pawn.common.model.ApplicationStatus;
import ge.pawn.partner.dto.PartnerDtos.*;
import ge.pawn.partner.service.PartnerService;
import ge.pawn.security.CurrentUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Platform-level management. Route pattern /api/v1/super-admin/** is
 * restricted to SUPER_ADMIN in SecurityConfig.
 */
@RestController
@RequestMapping("/api/v1/super-admin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final PartnerService partnerService;

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> listApplications(
            @RequestParam(required = false) String status) {
        ApplicationStatus s = (status == null || status.isBlank())
                ? null : ApplicationStatus.valueOf(status);
        return ResponseEntity.ok(partnerService.listByStatus(s));
    }

    @PostMapping("/applications/{id}/review")
    @Auditable(action = "PARTNER_APPLICATION_REVIEW", entityType = "LombardApplication")
    public ResponseEntity<ApplicationResponse> review(
            @PathVariable Long id, @Valid @RequestBody ReviewRequest request) {
        Long reviewerId = CurrentUser.require().getId();
        return ResponseEntity.ok(partnerService.review(reviewerId, id, request));
    }
}
