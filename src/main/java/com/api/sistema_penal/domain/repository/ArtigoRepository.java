package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Artigo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ArtigoRepository extends JpaRepository<Artigo, UUID> {

    List<Artigo> findByLeiIdOrderByOrdemAsc(UUID leiId);

    Optional<Artigo> findByLeiIdAndNumero(UUID leiId, String numero);

    @Query(value = """
            SELECT * FROM artigos 
            WHERE numero LIKE CONCAT('%', :termo, '%') OR conteudo LIKE CONCAT('%', :termo, '%')
            ORDER BY ordem
            """, nativeQuery = true)
    Page<Artigo> buscarPorTexto(@Param("termo") String termo, Pageable pageable);

    @Query(value = """
            SELECT a.* FROM artigos a
            JOIN leis l ON a.lei_id = l.id
            WHERE a.conteudo ILIKE CONCAT('%', :termo, '%')
            ORDER BY l.ano DESC, a.ordem
            """, nativeQuery = true)
    Page<Artigo> buscarPorConteudo(@Param("termo") String termo, Pageable pageable);
}
