package com.api.sistema_penal.domain.entity;

/**
 * Categorias jurídicas disponíveis no sistema
 * Usado para classificar leis, artigos e conhecimentos jurídicos
 */
public enum CategoriaJuridica {
    CRIMINAL("Criminal", "Direito Criminal"),
    CIVIL("Civil", "Direito Civil"),
    CONSTITUCIONAL("Constitucional", "Direito Constitucional"),
    TRABALHO("Trabalho", "Direito do Trabalho"),
    TRIBUTARIO("Tributário", "Direito Tributário"),
    ADMINISTRATIVO("Administrativo", "Direito Administrativo"),
    PROCESSUAL("Processual", "Direito Processual"),
    FAMILIA("Família", "Direito de Família"),
    AMBIENTAL("Ambiental", "Direito Ambiental"),
    COMERCIAL("Comercial", "Direito Comercial"),
    INTERNACIONAL("Internacional", "Direito Internacional"),
    PENITENCIARIO("Penitenciário", "Direito Penitenciário");

    private final String descricao;
    private final String nomeCompleto;

    CategoriaJuridica(String descricao, String nomeCompleto) {
        this.descricao = descricao;
        this.nomeCompleto = nomeCompleto;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }
}
