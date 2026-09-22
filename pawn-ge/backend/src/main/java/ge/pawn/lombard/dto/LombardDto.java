package ge.pawn.lombard.dto;

import ge.pawn.lombard.entity.LombardStatus;
import java.time.LocalDateTime;

public record LombardDto(
    Long id,
    String name,
    String tin,
    String description,
    String phone,
    String email,
    String website,
    String logoUrl,
    String coverImageUrl,
    Double rating,
    Integer reviewCount,
    LombardStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
