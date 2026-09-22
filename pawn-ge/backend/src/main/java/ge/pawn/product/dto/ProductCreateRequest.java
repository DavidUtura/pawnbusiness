package ge.pawn.product.dto;

import ge.pawn.product.entity.ProductCategory;
import ge.pawn.product.entity.ProductCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductCreateRequest(
    @NotNull(message = "Lombard ID is required")
    Long lombardId,
    
    Long branchId,
    
    @NotNull(message = "Category is required")
    ProductCategory category,
    
    @NotBlank(message = "Brand is required")
    String brand,
    
    @NotBlank(message = "Model is required")
    String model,
    
    @NotBlank(message = "Title is required")
    String title,
    
    String description,
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    BigDecimal price,
    
    @NotNull(message = "Condition is required")
    ProductCondition condition,
    
    String storage,
    String color,
    String serialNumber,
    String imei,
    String imei2,
    String batteryHealth,
    String processor,
    String ram,
    String screen
) {}
