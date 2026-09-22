package ge.pawn.product.dto;

import java.time.LocalDateTime;

public record ProductImageDto(
    Long id,
    String imageUrl,
    String imageKey,
    Long size,
    String contentType,
    Integer sortOrder,
    LocalDateTime createdAt
) {}
