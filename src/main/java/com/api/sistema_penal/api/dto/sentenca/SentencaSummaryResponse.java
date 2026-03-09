package com.api.sistema_penal.api.dto.sentenca;

import com.api.sistema_penal.domain.entity.Sentenca;

import java.time.LocalDate;
import java.util.UUID;

public record SentencaSummaryResponse(
        UUID id,
        String processoNumero,
        String tipoDecisao,
        Integer penaMeses,
        String regime,
        LocalDate dataSentenca,
        String juizNome,
        Boolean transitadoJulgado
) {
    public static SentencaSummaryResponse from(Sentenca s) {
        return new SentencaSummaryResponse(
                s.getId(),
                s.getProcesso() != null ? s.getProcesso().getNumero() : null,
                s.getTipoDecisao().name(),
                s.getPenaMeses(),
                s.getRegime(),
                s.getDataSentenca(),
                s.getJuizNome(),
                s.getTransitadoJulgado()
        );
    }
}
