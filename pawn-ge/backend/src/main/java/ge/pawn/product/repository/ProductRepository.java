package ge.pawn.product.repository;

import ge.pawn.common.model.ProductStatus;
import ge.pawn.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    Page<Product> findByLombardId(Long lombardId, Pageable pageable);
    
    List<Product> findByStatus(ProductStatus status);
    
    Page<Product> findByCategory(String category, Pageable pageable);
    
    Page<Product> findByBrand(String brand, Pageable pageable);
}
