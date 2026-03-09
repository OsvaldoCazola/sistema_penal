package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.dashboard.DashboardResponse;
import com.api.sistema_penal.api.dto.dashboard.DashboardResponse.ResumoGeral;
import com.api.sistema_penal.api.dto.dashboard.DashboardResponse.TendenciasResponse;
import com.api.sistema_penal.domain.entity.Processo.StatusProcesso;
import com.api.sistema_penal.domain.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProcessoRepository processoRepository;
    private final SentencaRepository sentencaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        return new DashboardResponse(
                getResumoGeral(),
                getProcessosPorStatus(),
                new HashMap<>(),
                new HashMap<>(),
                new HashMap<>(),
                getSentencasEstatisticas(),
                getTendencias()
        );
    }

    private ResumoGeral getResumoGeral() {
        return new ResumoGeral(
                processoRepository.count(),
                processoRepository.countByStatus(StatusProcesso.EM_ANDAMENTO),
                sentencaRepository.count(),
                0L,
                0L,
                usuarioRepository.count()
        );
    }

    private Map<String, Long> getProcessosPorStatus() {
        return processoRepository.countGroupByStatus().stream()
                .collect(Collectors.toMap(
                        arr -> ((StatusProcesso) arr[0]).name(),
                        arr -> (Long) arr[1],
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }

    private Map<String, Object> getSentencasEstatisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", sentencaRepository.count());
        return stats;
    }

    private TendenciasResponse getTendencias() {
        Map<String, Long> processosUltimos30Dias = new LinkedHashMap<>();
        
        java.time.LocalDate hoje = java.time.LocalDate.now();
        for (int i = 29; i >= 0; i--) {
            java.time.LocalDate data = hoje.minusDays(i);
            String dataStr = data.toString();
            processosUltimos30Dias.put(dataStr, 0L);
        }

        return new TendenciasResponse(processosUltimos30Dias, new LinkedHashMap<>());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getEstatisticasTipoCrime() {
        Map<String, Object> stats = new HashMap<>();
        // Retorna mapa vazio - funcionalidade desabilitada sem TipoCrime
        return stats;
    }
}
