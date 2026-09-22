package ge.pawn.product.dto;

import ge.pawn.common.model.ProductCondition;
import ge.pawn.common.model.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private Long lombardId;
    private Long branchId;
    private String category;
    private String brand;
    private String model;
    private String title;
    private String description;
    private BigDecimal price;
    private ProductCondition condition;
    private String storage;
    private String color;
    private String serialNumber;
    private String imei;
    private String imei2;
    private String batteryHealth;
    private ProductStatus status;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
