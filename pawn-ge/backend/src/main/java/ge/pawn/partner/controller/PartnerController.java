package ge.pawn.partner.controller;

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

@RestController
@RequestMapping("/api/v1/partner")
@RequiredArgsConstructor
public class PartnerController {

    private final PartnerService partnerService;

    /** Applicants may submit without seller privileges. */
    @PostMapping("/applications")
    @Auditable(action = "PARTNER_APPLICATION_SUBMIT", entityType = "LombardApplication")
    public ResponseEntity<ApplicationResponse> submit(@Valid @RequestBody SubmitApplicationRequest request) {
        // Tenant/applicant identity resolved server-side only.
        Long userId = CurrentUser.require().getId();
        return ResponseEntity.ok(partnerService.submitApplication(userId, request));
    }

    @GetMapping("/application")
    public ResponseEntity<ApplicationResponse> myApplication() {
        Long userId = CurrentUser.require().getId();
        ApplicationResponse response = partnerService.getMyApplication(userId);
        return response == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(response);
    }

    @PutMapping("/application")
    public ResponseEntity<ApplicationResponse> updateApplication(@Valid @RequestBody SubmitApplicationRequest request) {
        Long userId = CurrentUser.require().getId();
        return ResponseEntity.ok(partnerService.submitApplication(userId, request));
    }
}
