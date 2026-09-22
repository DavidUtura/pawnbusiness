package ge.pawn.product.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProductStatus {
    AVAILABLE("AVAILABLE"),
    RESERVED("RESERVED"),
    SOLD("SOLD"),
    UNAVAILABLE("UNAVAILABLE");

    private final String value;
}
