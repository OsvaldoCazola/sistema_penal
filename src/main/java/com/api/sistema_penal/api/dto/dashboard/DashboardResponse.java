package com.api.sistema_penal.api.dto.dashboard;

import java.util.Map;

public record DashboardResponse(
        ResumoGeral resumoGeral,
        Map<String, Long> processosPorStatus,
        Map<String, Long> processosPorTribunal,
        Map<String, Long> denunciasPorStatus,
        Map<String, Long> denunciasPorProvincia,
        Map<String, Object> sentencasEstatisticas,
        TendenciasResponse tendencias
) {
    public record ResumoGeral(
            long totalProcessos,
            long processosEmAndamento,
            long totalSentencas,
            long totalDenuncias,
            long denunciasHoje,
            long usuariosAtivos
    ) {}

    public record TendenciasResponse(
            Map<String, Long> processosUltimos30Dias,
            Map<String, Long> denunciasUltimos30Dias
    ) {}
}
