package ge.pawn.product.service;

import ge.pawn.common.exception.ApiException;
import ge.pawn.lombard.entity.Branch;
import ge.pawn.lombard.entity.Lombard;
import ge.pawn.lombard.repository.BranchRepository;
import ge.pawn.lombard.repository.LombardRepository;
import ge.pawn.product.dto.ProductCreateRequest;
import ge.pawn.product.dto.ProductDto;
import ge.pawn.product.dto.ProductImageDto;
import ge.pawn.product.dto.ProductUpdateRequest;
import ge.pawn.product.entity.Product;
import ge.pawn.product.entity.ProductImage;
import ge.pawn.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final LombardRepository lombardRepository;
    private final BranchRepository branchRepository;

    @Transactional(readOnly = true)
    public Page<ProductDto> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Page<ProductDto> getProductsByLombard(Long lombardId, Pageable pageable) {
        Lombard lombard = lombardRepository.findById(lombardId)
            .orElseThrow(() -> ApiException.notFound("Lombard", lombardId));
        return productRepository.findByLombard(lombard, pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> ApiException.notFound("Product", id));
        return toDto(product);
    }

    @Transactional
    public ProductDto createProduct(ProductCreateRequest request) {
        Lombard lombard = lombardRepository.findById(request.lombardId())
            .orElseThrow(() -> ApiException.notFound("Lombard", request.lombardId()));

        Branch branch = null;
        if (request.branchId() != null) {
            branch = branchRepository.findById(request.branchId())
                .orElseThrow(() -> ApiException.notFound("Branch", request.branchId()));
        }

        Product product = Product.builder()
            .lombard(lombard)
            .branch(branch)
            .category(request.category())
            .brand(request.brand())
            .model(request.model())
            .title(request.title())
            .description(request.description())
            .price(request.price())
            .condition(request.condition())
            .storage(request.storage())
            .color(request.color())
            .serialNumber(request.serialNumber())
            .imei(request.imei())
            .batteryHealth(request.batteryHealth())
            .processor(request.processor())
            .ram(request.ram())
            .screen(request.screen())
            .build();

        productRepository.save(product);
        return toDto(product);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> ApiException.notFound("Product", id));

        if (request.branchId() != null) {
            Branch branch = branchRepository.findById(request.branchId())
                .orElseThrow(() -> ApiException.notFound("Branch", request.branchId()));
            product.setBranch(branch);
        }

        if (request.category() != null) product.setCategory(request.category());
        if (request.brand() != null) product.setBrand(request.brand());
        if (request.model() != null) product.setModel(request.model());
        if (request.title() != null) product.setTitle(request.title());
        if (request.description() != null) product.setDescription(request.description());
        if (request.price() != null) product.setPrice(request.price());
        if (request.condition() != null) product.setCondition(request.condition());
        if (request.storage() != null) product.setStorage(request.storage());
        if (request.color() != null) product.setColor(request.color());
        if (request.serialNumber() != null) product.setSerialNumber(request.serialNumber());
        if (request.imei() != null) product.setImei(request.imei());
        if (request.batteryHealth() != null) product.setBatteryHealth(request.batteryHealth());
        if (request.processor() != null) product.setProcessor(request.processor());
        if (request.ram() != null) product.setRam(request.ram());
        if (request.screen() != null) product.setScreen(request.screen());
        if (request.status() != null) product.setStatus(request.status());

        productRepository.save(product);
        return toDto(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw ApiException.notFound("Product", id);
        }
        productRepository.deleteById(id);
    }

    private ProductDto toDto(Product product) {
        Set<ProductImageDto> imageDtos = product.getImages().stream()
            .map(img -> new ProductImageDto(
                img.getId(),
                img.getImageUrl(),
                img.getImageKey(),
                img.getSize(),
                img.getContentType(),
                img.getSortOrder(),
                img.getCreatedAt()
            ))
            .collect(Collectors.toSet());

        return new ProductDto(
            product.getId(),
            product.getLombard().getId(),
            product.getLombard().getName(),
            product.getBranch() != null ? product.getBranch().getId() : null,
            product.getBranch() != null ? product.getBranch().getName() : null,
            product.getCategory(),
            product.getBrand(),
            product.getModel(),
            product.getTitle(),
            product.getDescription(),
            product.getPrice(),
            product.getCondition(),
            product.getStorage(),
            product.getColor(),
            product.getSerialNumber(),
            product.getImei(),
            product.getBatteryHealth(),
            product.getProcessor(),
            product.getRam(),
            product.getScreen(),
            product.getStatus(),
            imageDtos,
            product.getCreatedAt(),
            product.getUpdatedAt()
        );
    }
}
