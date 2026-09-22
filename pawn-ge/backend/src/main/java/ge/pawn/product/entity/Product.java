package ge.pawn.product.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import ge.pawn.lombard.entity.Branch;
import ge.pawn.lombard.entity.Lombard;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_product_lombard", columnList = "lombard_id"),
    @Index(name = "idx_product_branch", columnList = "branch_id"),
    @Index(name = "idx_product_category", columnList = "category"),
    @Index(name = "idx_product_status", columnList = "status"),
    @Index(name = "idx_product_price", columnList = "price"),
    @Index(name = "idx_product_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lombard_id", nullable = false)
    private Lombard lombard;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCategory category;
    
    @Column(nullable = false, length = 100)
    private String brand;
    
    @Column(nullable = false, length = 200)
    private String model;
    
    @Column(nullable = false, length = 300)
    private String title;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductCondition condition;
    
    @Column(length = 50)
    private String storage;
    
    @Column(length = 50)
    private String color;
    
    @Column(length = 100)
    private String serialNumber;
    
    @Column(length = 50)
    private String imei;
    
    @Column(length = 50)
    private String imei2;
    
    @Column(length = 20)
    private String batteryHealth;
    
    @Column(length = 100)
    private String processor;
    
    @Column(length = 50)
    private String ram;
    
    @Column(length = 50)
    private String screen;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.AVAILABLE;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ProductImage> images = new HashSet<>();
    
    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
