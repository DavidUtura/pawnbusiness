package ge.pawn.lombard.service;

import ge.pawn.lombard.dto.LombardDto;
import ge.pawn.lombard.entity.Lombard;
import ge.pawn.lombard.entity.LombardStatus;
import ge.pawn.lombard.repository.LombardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class LombardService {

    private final LombardRepository lombardRepository;

    @Transactional(readOnly = true)
    public Page<LombardDto> getAllLombards(Pageable pageable) {
        return lombardRepository.findAll(pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public LombardDto getLombardById(Long id) {
        Lombard lombard = lombardRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Lombard not found with id: " + id));
        return toDto(lombard);
    }

    @Transactional(readOnly = true)
    public LombardDto getLombardByTin(String tin) {
        Lombard lombard = lombardRepository.findByTin(tin)
            .orElseThrow(() -> new RuntimeException("Lombard not found with TIN: " + tin));
        return toDto(lombard);
    }

    public LombardDto createLombard(LombardDto dto) {
        Lombard lombard = new Lombard();
        lombard.setName(dto.name());
        lombard.setTin(dto.tin());
        lombard.setDescription(dto.description());
        lombard.setPhone(dto.phone());
        lombard.setEmail(dto.email());
        lombard.setWebsite(dto.website());
        lombard.setLogoUrl(dto.logoUrl());
        lombard.setCoverImageUrl(dto.coverImageUrl());
        lombard.setStatus(LombardStatus.ACTIVE);
        lombard.setRating(0.0);
        lombard.setReviewCount(0);
        lombard.setCreatedAt(LocalDateTime.now());
        lombard.setUpdatedAt(LocalDateTime.now());
        
        Lombard saved = lombardRepository.save(lombard);
        return toDto(saved);
    }

    public LombardDto updateLombard(Long id, LombardDto dto) {
        Lombard lombard = lombardRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Lombard not found with id: " + id));
        
        lombard.setName(dto.name());
        lombard.setDescription(dto.description());
        lombard.setPhone(dto.phone());
        lombard.setEmail(dto.email());
        lombard.setWebsite(dto.website());
        lombard.setLogoUrl(dto.logoUrl());
        lombard.setCoverImageUrl(dto.coverImageUrl());
        lombard.setUpdatedAt(LocalDateTime.now());
        
        Lombard updated = lombardRepository.save(lombard);
        return toDto(updated);
    }

    public void deleteLombard(Long id) {
        lombardRepository.deleteById(id);
    }

    private LombardDto toDto(Lombard lombard) {
        return new LombardDto(
            lombard.getId(),
            lombard.getName(),
            lombard.getTin(),
            lombard.getDescription(),
            lombard.getPhone(),
            lombard.getEmail(),
            lombard.getWebsite(),
            lombard.getLogoUrl(),
            lombard.getCoverImageUrl(),
            lombard.getRating(),
            lombard.getReviewCount(),
            lombard.getStatus(),
            lombard.getCreatedAt(),
            lombard.getUpdatedAt()
        );
    }
}
