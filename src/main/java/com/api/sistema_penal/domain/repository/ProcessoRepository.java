package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Processo;
import com.api.sistema_penal.domain.entity.Processo.StatusProcesso;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProcessoRepository extends JpaRepository<Processo, UUID>, JpaSpecificationExecutor<Processo> {

    Optional<Processo> findByNumero(String numero);

    boolean existsByNumero(String numero);

    Page<Processo> findByStatus(StatusProcesso status, Pageable pageable);

    Page<Processo> findByProvincia(String provincia, Pageable pageable);

    @Query("SELECT p FROM Processo p WHERE p.dataAbertura BETWEEN :inicio AND :fim")
    Page<Processo> findByPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Processo p WHERE p.status = :status")
    long countByStatus(@Param("status") StatusProcesso status);

    @Query("SELECT p.status, COUNT(p) FROM Processo p GROUP BY p.status")
    java.util.List<Object[]> countGroupByStatus();

    @Query("""
            SELECT p FROM Processo p 
            WHERE (:inicio IS NULL OR p.dataAbertura >= :inicio)
            AND (:fim IS NULL OR p.dataAbertura <= :fim)
            AND (:provincia IS NULL OR p.provincia = :provincia)
            AND (:status IS NULL OR p.status = :status)
            """)
    Page<Processo> findByFilters(
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim,
            @Param("provincia") String provincia,
            @Param("status") String status,
            Pageable pageable);
}
