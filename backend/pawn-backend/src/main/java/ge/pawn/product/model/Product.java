package ge.pawn.product.model;

import ge.pawn.branch.model.Branch;
import ge.pawn.common.model.BaseEntity;
import ge.pawn.common.model.ProductCondition;
import ge.pawn.common.model.ProductStatus;
import ge.pawn.lombard.model.Lombard;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lombard_id", nullable = false)
    private Lombard lombard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCondition condition;

    private String storage;

    private String color;

    private String serialNumber;

    private String imei;

    private String imei2;

    private String batteryHealth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.AVAILABLE;

    @Column(nullable = false)
    private Integer quantity = 1;
}
