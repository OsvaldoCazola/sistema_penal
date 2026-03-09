package com.api.sistema_penal.api.dto.sentenca;

import com.api.sistema_penal.domain.entity.Sentenca;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record SentencaResponse(
        UUID id,
        String processoNumero,
        String tipoDecisao,
        Integer penaMeses,
        String tipoPena,
        String regime,
        LocalDate dataSentenca,
        String ementa,
        String fundamentacao,
        String dispositivo,
        String juizNome,
        Map<String, Object> circunstancias,
        Boolean transitadoJulgado,
        LocalDateTime createdAt
) {
    public static SentencaResponse from(Sentenca s) {
        return new SentencaResponse(
                s.getId(),
                s.getProcesso() != null ? s.getProcesso().getNumero() : null,
                s.getTipoDecisao().name(),
                s.getPenaMeses(),
                s.getTipoPena(),
                s.getRegime(),
                s.getDataSentenca(),
                s.getEmenta(),
                s.getFundamentacao(),
                s.getDispositivo(),
                s.getJuizNome(),
                s.getCircunstancias(),
                s.getTransitadoJulgado(),
                s.getCreatedAt()
        );
    }
}
