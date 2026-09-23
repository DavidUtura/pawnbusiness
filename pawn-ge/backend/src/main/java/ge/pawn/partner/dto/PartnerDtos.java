package ge.pawn.partner.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

public class PartnerDtos {

    @Data
    public static class SubmitApplicationRequest {
        @NotBlank private String displayName;
        @NotBlank private String legalName;
        private String taxId;
        @NotBlank private String contactName;
        @NotBlank private String phone;
        @NotBlank @Email private String email;
        private String website;
        private Integer branchCount;
        private List<String> categories;
        @NotBlank private String address;
        private String workingHours;
        private Boolean deliveryAvailable;
        private Boolean pickupAvailable;
    }

    @Data
    public static class ApplicationResponse {
        private Long id;
        private String status;
        private String displayName;
        private String legalName;
        private String contactName;
        private String phone;
        private String email;
        private String website;
        private Integer branchCount;
        private List<String> categories;
        private String address;
        private String workingHours;
        private Boolean deliveryAvailable;
        private Boolean pickupAvailable;
        private String submittedAt;
        private String reviewedAt;
        private String reviewNotes;
        private Long lombardId;
    }

    @Data
    public static class ReviewRequest {
        /** APPROVED | REJECTED | MORE_INFORMATION_REQUIRED */
        @NotBlank private String decision;
        private String reviewNotes;
    }
}
