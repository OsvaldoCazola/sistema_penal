package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.dashboard.DashboardResponse;
import com.api.sistema_penal.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Estatísticas e métricas do sistema")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR', 'FUNCIONARIO', 'PESQUISADOR', 'ESTUDANTE', 'ADVOGADO', 'CIDADAO')")
    @Operation(summary = "Dashboard principal com todas as métricas")
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboard());
    }

    @GetMapping("/tipos-crime")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Estatísticas por tipo de crime")
    public ResponseEntity<Map<String, Object>> getEstatisticasTipoCrime() {
        return ResponseEntity.ok(service.getEstatisticasTipoCrime());
    }
}
