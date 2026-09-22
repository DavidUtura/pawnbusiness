package ge.pawn.lombard.controller;

import ge.pawn.lombard.dto.LombardDto;
import ge.pawn.lombard.service.LombardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/lombards")
@RequiredArgsConstructor
@Tag(name = "Lombards", description = "Pawn shop management APIs")
public class LombardController {

    private final LombardService lombardService;

    @GetMapping
    public ResponseEntity<Page<LombardDto>> getAllLombards(Pageable pageable) {
        return ResponseEntity.ok(lombardService.getAllLombards(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LombardDto> getLombardById(@PathVariable Long id) {
        return ResponseEntity.ok(lombardService.getLombardById(id));
    }

    @PostMapping
    public ResponseEntity<LombardDto> createLombard(@RequestBody LombardDto dto) {
        return ResponseEntity.ok(lombardService.createLombard(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LombardDto> updateLombard(@PathVariable Long id, @RequestBody LombardDto dto) {
        return ResponseEntity.ok(lombardService.updateLombard(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLombard(@PathVariable Long id) {
        lombardService.deleteLombard(id);
        return ResponseEntity.noContent().build();
    }
}
