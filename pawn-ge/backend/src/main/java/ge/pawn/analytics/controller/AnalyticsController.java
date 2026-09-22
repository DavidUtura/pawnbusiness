package ge.pawn.analytics.controller;

import ge.pawn.analytics.dto.AnalyticsDashboardDTO;
import ge.pawn.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

/**
 * Analytics Controller
 * Provides analytics endpoints for Lombard Admin and Super Admin
 */
@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Analytics and reporting endpoints")
@SecurityRequirement(name = "bearerAuth")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get Lombard Dashboard Analytics", 
               description = "Returns KPIs for a specific pawn shop. Requires LOMBARD_ADMIN or LOMBARD_EMPLOYEE role.")
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'LOMBARD_EMPLOYEE')")
    public ResponseEntity<AnalyticsDashboardDTO> getLombardDashboard(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // TODO: Extract lombardId from authenticated user's context
        Long lombardId = 1L; // Placeholder - should come from SecurityContext
        
        AnalyticsDashboardDTO analytics = analyticsService.getLombardAnalytics(lombardId, startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/platform")
    @Operation(summary = "Get Platform-wide Analytics", 
               description = "Returns platform-wide KPIs. Requires SUPER_ADMIN role.")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<AnalyticsDashboardDTO> getPlatformDashboard(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        AnalyticsDashboardDTO analytics = analyticsService.getPlatformAnalytics(startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/sales")
    @Operation(summary = "Get Sales Analytics", description = "Detailed sales metrics")
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'LOMBARD_EMPLOYEE', 'SUPER_ADMIN')")
    public ResponseEntity<Object> getSalesAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // TODO: Implement detailed sales analytics
        return ResponseEntity.ok().build();
    }

    @GetMapping("/products")
    @Operation(summary = "Get Product Performance Analytics", description = "Product performance metrics")
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'LOMBARD_EMPLOYEE', 'SUPER_ADMIN')")
    public ResponseEntity<Object> getProductAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // TODO: Implement product performance analytics
        return ResponseEntity.ok().build();
    }

    @GetMapping("/inventory")
    @Operation(summary = "Get Inventory Analytics", description = "Inventory turnover and status metrics")
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'LOMBARD_EMPLOYEE', 'SUPER_ADMIN')")
    public ResponseEntity<Object> getInventoryAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        // TODO: Implement inventory analytics
        return ResponseEntity.ok().build();
    }
}
