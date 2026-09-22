package ge.pawn.lombard.repository;

import ge.pawn.lombard.entity.Lombard;
import ge.pawn.lombard.entity.LombardStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LombardRepository extends JpaRepository<Lombard, Long> {
    Optional<Lombard> findByTin(String tin);
    Page<Lombard> findByStatus(LombardStatus status, Pageable pageable);
    
    @Query("SELECT l FROM Lombard l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Lombard> searchByName(String name, Pageable pageable);
}
