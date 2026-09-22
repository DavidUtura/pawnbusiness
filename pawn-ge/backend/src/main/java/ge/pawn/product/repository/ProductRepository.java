package ge.pawn.product.repository;

import ge.pawn.lombard.entity.Lombard;
import ge.pawn.product.entity.Product;
import ge.pawn.product.entity.ProductCategory;
import ge.pawn.product.entity.ProductCondition;
import ge.pawn.product.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByLombard(Lombard lombard, Pageable pageable);
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    Page<Product> findByLombardAndStatus(Lombard lombard, ProductStatus status, Pageable pageable);
    Page<Product> findByCategory(ProductCategory category, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = :status " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND (:category IS NULL OR p.category = :category) " +
           "AND (:condition IS NULL OR p.condition = :condition) " +
           "AND (:brand IS NULL OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) " +
           "AND (:search IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchProducts(
        @Param("status") ProductStatus status,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("category") ProductCategory category,
        @Param("condition") ProductCondition condition,
        @Param("brand") String brand,
        @Param("search") String search,
        Pageable pageable
    );
    
    List<Product> findByIdIn(List<Long> ids);
}
