package ge.pawn.product.dto;

import ge.pawn.lombard.entity.Branch;
import ge.pawn.product.entity.ProductCategory;
import ge.pawn.product.entity.ProductCondition;
import ge.pawn.product.entity.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public record ProductDto(
    Long id,
    Long lombardId,
    String lombardName,
    Long branchId,
    String branchName,
    ProductCategory category,
    String brand,
    String model,
    String title,
    String description,
    BigDecimal price,
    ProductCondition condition,
    String storage,
    String color,
    String serialNumber,
    String imei,
    String batteryHealth,
    String processor,
    String ram,
    String screen,
    ProductStatus status,
    Set<ProductImageDto> images,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
