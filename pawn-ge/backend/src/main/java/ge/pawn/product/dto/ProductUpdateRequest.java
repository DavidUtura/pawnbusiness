package ge.pawn.product.dto;

import ge.pawn.product.entity.ProductCategory;
import ge.pawn.product.entity.ProductCondition;
import ge.pawn.product.entity.ProductStatus;
import java.math.BigDecimal;

public record ProductUpdateRequest(
    Long branchId,
    ProductCategory category,
    String brand,
    String model,
    String title,
    String description,
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    BigDecimal price,
    ProductCondition condition,
    String storage,
    String color,
    String serialNumber,
    String imei,
    String imei2,
    String batteryHealth,
    String processor,
    String ram,
    String screen,
    ProductStatus status
) {}
