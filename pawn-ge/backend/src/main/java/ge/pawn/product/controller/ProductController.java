package ge.pawn.product.controller;

import ge.pawn.product.dto.ProductDTO;
import ge.pawn.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Product Controller
 * Manages product CRUD operations and search functionality
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get All Products", description = "Returns paginated list of products with optional filters")
    @PreAuthorize("permitAll()") // Public access for marketplace browsing
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice,
            Pageable pageable) {
        
        Page<ProductDTO> products = productService.searchProducts(category, brand, status, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Product by ID", description = "Returns detailed product information")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @Operation(summary = "Create Product", description = "Creates a new product. Requires LOMBARD_ADMIN or LOMBARD_EMPLOYEE role.")
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'LOMBARD_EMPLOYEE')")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Product", description = "Updates an existing product. Requires LOMBARD_ADMIN or LOMBARD_EMPLOYEE role.")
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'LOMBARD_EMPLOYEE')")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO productDTO) {
        
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Product", description = "Deletes a product. Requires LOMBARD_ADMIN role.")
    @PreAuthorize("hasRole('LOMBARD_ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lombard/{lombardId}")
    @Operation(summary = "Get Products by Lombard", description = "Returns all products for a specific pawn shop")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<ProductDTO>> getProductsByLombard(@PathVariable Long lombardId) {
        List<ProductDTO> products = productService.getProductsByLombard(lombardId);
        return ResponseEntity.ok(products);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update Product Status", description = "Updates product status (AVAILABLE, RESERVED, SOLD, UNAVAILABLE)")
    @PreAuthorize("hasAnyRole('LOMBARD_ADMIN', 'LOMBARD_EMPLOYEE')")
    public ResponseEntity<ProductDTO> updateProductStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        
        ProductDTO updatedProduct = productService.updateProductStatus(id, status);
        return ResponseEntity.ok(updatedProduct);
    }
}
