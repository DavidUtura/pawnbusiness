package ge.pawn.lombard.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lombards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lombard {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String tin;
    
    @Column(length = 500)
    private String description;
    
    @Column(length = 200)
    private String phone;
    
    @Column(length = 200)
    private String email;
    
    @Column(length = 500)
    private String website;
    
    @Column(length = 1000)
    private String logoUrl;
    
    @Column(length = 1000)
    private String coverImageUrl;
    
    @Column(precision = 10, scale = 2)
    private Double rating;
    
    @Column(nullable = false)
    private Integer reviewCount = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LombardStatus status = LombardStatus.ACTIVE;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
