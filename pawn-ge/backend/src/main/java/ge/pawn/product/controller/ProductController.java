package ge.pawn.product.controller;

import ge.pawn.common.exception.ErrorResponse;
import ge.pawn.product.dto.ProductCreateRequest;
import ge.pawn.product.dto.ProductDto;
import ge.pawn.product.dto.ProductUpdateRequest;
import ge.pawn.product.entity.ProductCategory;
import ge.pawn.product.entity.ProductCondition;
import ge.pawn.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management APIs")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve paginated list of products with optional filters")
    public ResponseEntity<Page<ProductDto>> getProducts(
        @Parameter(description = "Category filter") @RequestParam(required = false) ProductCategory category,
        @Parameter(description = "Minimum price") @RequestParam(required = false) BigDecimal minPrice,
        @Parameter(description = "Maximum price") @RequestParam(required = false) BigDecimal maxPrice,
        @Parameter(description = "Condition filter") @RequestParam(required = false) ProductCondition condition,
        @Parameter(description = "Brand search") @RequestParam(required = false) String brand,
        @Parameter(description = "Search term") @RequestParam(required = false) String search,
        Pageable pageable
    ) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve a specific product by its ID")
    @ApiResponse(responseCode = "200", description = "Product found", 
        content = @Content(schema = @Schema(implementation = ProductDto.class)))
    @ApiResponse(responseCode = "404", description = "Product not found",
        content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'LOMBARD_EMPLOYEE')")
    @Operation(summary = "Create product", description = "Create a new product (requires Lombard role)")
    public ResponseEntity<ProductDto> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'LOMBARD_EMPLOYEE')")
    @Operation(summary = "Update product", description = "Update an existing product (requires Lombard role)")
    public ResponseEntity<ProductDto> updateProduct(
        @PathVariable Long id, 
        @Valid @RequestBody ProductUpdateRequest request
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Delete product", description = "Delete a product (requires Lombard Admin or Super Admin role)")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
