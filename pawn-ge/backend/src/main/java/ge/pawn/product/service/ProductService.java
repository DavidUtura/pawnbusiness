package ge.pawn.product.service;

import ge.pawn.common.exception.ResourceNotFoundException;
import ge.pawn.common.model.ProductStatus;
import ge.pawn.lombard.model.Lombard;
import ge.pawn.lombard.repository.LombardRepository;
import ge.pawn.product.dto.ProductDTO;
import ge.pawn.product.model.Product;
import ge.pawn.product.model.ProductImage;
import ge.pawn.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final LombardRepository lombardRepository;

    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toDTO(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByLombard(Long lombardId) {
        return productRepository.findByLombardId(lombardId, org.springframework.data.domain.PageRequest.of(0, 1000))
                .getContent().stream()
                .map(this::toDTO)
                .collect(java.util.stream.Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProductDTO updateProductStatus(Long id, String status) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        existing.setStatus(ProductStatus.valueOf(status.toUpperCase()));
        Product updated = productRepository.save(existing);
        return toDTO(updated);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> searchProducts(String keyword, String category, String brand,
                                           String minPrice, String maxPrice, Pageable pageable) {
        // Simple implementation - can be enhanced with specifications
        return productRepository.findAll(pageable).getContent().stream()
                .filter(p -> keyword == null || p.getTitle().toLowerCase().contains(keyword.toLowerCase())
                        || p.getDescription().toLowerCase().contains(keyword.toLowerCase()))
                .filter(p -> category == null || p.getCategory().equalsIgnoreCase(category))
                .filter(p -> brand == null || p.getBrand().equalsIgnoreCase(brand))
                .filter(p -> minPrice == null || p.getPrice().doubleValue() >= Double.parseDouble(minPrice))
                .filter(p -> maxPrice == null || p.getPrice().doubleValue() <= Double.parseDouble(maxPrice))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        // Verify lombard exists
        lombardRepository.findById(productDTO.getLombardId())
                .orElseThrow(() -> new ResourceNotFoundException("Lombard not found with id: " + productDTO.getLombardId()));

        Product product = toEntity(productDTO);
        Product saved = productRepository.save(product);
        return toDTO(saved);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update fields
        if (productDTO.getCategory() != null) {
            existing.setCategory(productDTO.getCategory());
        }
        if (productDTO.getBrand() != null) {
            existing.setBrand(productDTO.getBrand());
        }
        if (productDTO.getModel() != null) {
            existing.setModel(productDTO.getModel());
        }
        if (productDTO.getTitle() != null) {
            existing.setTitle(productDTO.getTitle());
        }
        if (productDTO.getDescription() != null) {
            existing.setDescription(productDTO.getDescription());
        }
        if (productDTO.getPrice() != null) {
            existing.setPrice(productDTO.getPrice());
        }
        if (productDTO.getCondition() != null) {
            existing.setCondition(productDTO.getCondition());
        }
        if (productDTO.getStatus() != null) {
            existing.setStatus(productDTO.getStatus());
        }
        if (productDTO.getStorage() != null) {
            existing.setStorage(productDTO.getStorage());
        }
        if (productDTO.getColor() != null) {
            existing.setColor(productDTO.getColor());
        }
        if (productDTO.getSerialNumber() != null) {
            existing.setSerialNumber(productDTO.getSerialNumber());
        }
        if (productDTO.getImei() != null) {
            existing.setImei(productDTO.getImei());
        }
        if (productDTO.getImei2() != null) {
            existing.setImei2(productDTO.getImei2());
        }
        if (productDTO.getBatteryHealth() != null) {
            existing.setBatteryHealth(productDTO.getBatteryHealth());
        }

        Product updated = productRepository.save(existing);
        return toDTO(updated);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    private ProductDTO toDTO(Product product) {
        List<String> imageUrls = product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        return ProductDTO.builder()
                .id(product.getId())
                .lombardId(product.getLombardId())
                .branchId(product.getBranchId())
                .category(product.getCategory())
                .brand(product.getBrand())
                .model(product.getModel())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .condition(product.getCondition())
                .storage(product.getStorage())
                .color(product.getColor())
                .serialNumber(product.getSerialNumber())
                .imei(product.getImei())
                .imei2(product.getImei2())
                .batteryHealth(product.getBatteryHealth())
                .status(product.getStatus())
                .imageUrls(imageUrls)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    private Product toEntity(ProductDTO dto) {
        Product product = new Product();
        product.setLombardId(dto.getLombardId());
        product.setBranchId(dto.getBranchId());
        product.setCategory(dto.getCategory());
        product.setBrand(dto.getBrand());
        product.setModel(dto.getModel());
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCondition(dto.getCondition());
        product.setStorage(dto.getStorage());
        product.setColor(dto.getColor());
        product.setSerialNumber(dto.getSerialNumber());
        product.setImei(dto.getImei());
        product.setImei2(dto.getImei2());
        product.setBatteryHealth(dto.getBatteryHealth());
        product.setStatus(dto.getStatus() != null ? dto.getStatus() : ge.pawn.common.model.ProductStatus.DRAFT);
        return product;
    }
}
