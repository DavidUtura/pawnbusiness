package ge.pawn.lombard.repository;

import ge.pawn.lombard.entity.Branch;
import ge.pawn.lombard.entity.Lombard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    Page<Branch> findByLombard(Lombard lombard, Pageable pageable);
    List<Branch> findByLombardId(Long lombardId);
}
