package ge.pawn.lombard.repository;

import ge.pawn.lombard.model.Lombard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LombardRepository extends JpaRepository<Lombard, Long> {
    Optional<Lombard> findBySlug(String slug);
    Optional<Lombard> findByName(String name);
}
