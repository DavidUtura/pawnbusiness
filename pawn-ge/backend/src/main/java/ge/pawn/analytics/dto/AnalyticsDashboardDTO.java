package ge.pawn.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for Analytics Dashboard KPIs
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDashboardDTO {
    
    // Sales Metrics
    private BigDecimal totalRevenue;
    private Integer totalOrders;
    private BigDecimal averageOrderValue;
    private Double conversionRate;
    
    // Product Metrics
    private Long mostViewedProductId;
    private Long mostReservedProductId;
    private Long mostSoldProductId;
    private Long slowMovingProductId;
    
    // Inventory Metrics
    private BigDecimal totalInventoryValue;
    private Integer availableItems;
    private Integer soldItems;
    private Integer averageDaysToSell;
    
    // Marketplace Metrics
    private Long productViews;
    private Long searches;
    private Long reservations;
    private Long marketplaceOrders;
    private Double marketplaceConversion;
    
    // Period
    private LocalDate startDate;
    private LocalDate endDate;
}
