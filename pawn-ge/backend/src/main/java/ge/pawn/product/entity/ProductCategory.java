package ge.pawn.product.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ProductCategory {
    SMARTPHONES("Smartphones"),
    LAPTOPS("Laptops"),
    TABLETS("Tablets"),
    SMARTWATCHES("Smartwatches"),
    HEADPHONES("Headphones"),
    CAMERAS("Cameras"),
    GAMING("Gaming"),
    AUDIO("Audio"),
    ACCESSORIES("Accessories"),
    OTHER("Other");

    private final String value;
}
