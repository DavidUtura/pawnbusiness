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
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
public class Product extends BaseEntity {

    @Column(name = "lombard_id", nullable = false)
    private Long lombardId;

    @Column(name = "branch_id")
    private Long branchId;

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
    private ProductStatus status = ProductStatus.DRAFT;

    @Column(nullable = false)
    private Integer quantity = 1;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();
}
