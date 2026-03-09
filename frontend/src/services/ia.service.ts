import api from '@/lib/api';

// Tipos para Busca Semântica
export interface BuscaSemanticaRequest {
  termo: string;
  categoria?: string;
  limite?: number;
  threshold?: number;
}

export interface BuscaResultado {
  id: string;
  titulo: string;
  resumo?: string;
  categoria: string;
  score: number;
  referenciaLegal?: string;
}

export interface ListaResultados {
  resultados: BuscaResultado[];
  total: number;
  termoBuscado: string;
  categoria?: string;
  threshold?: number;
}

export interface AnaliseCasoRequest {
  descricao: string;
  tipoCrime?: string;
  categoria?: string;
  limite?: number;
}

export interface LeiAplicavel {
  id: string;
  titulo: string;
  referenciaLegal: string;
  categoria: string;
  relevancia: number;
  explicacao: string;
  jurisprudencia?: string;
  palavrasRelacionadas?: string[];
}

/**
 * Palavra-chave detectada na descrição do caso
 */
export interface PalavraDetectada {
  palavra: string;
  tipo: string;
  relevancia: number;
}

/**
 * Mapeamento de palavra-chave para artigo
 * Exemplo: "roubo" → Artigo 157
 */
export interface PalavraArtigoMapping {
  palavra: string;
  tipo: string;
  artigoId: string;
  artigoTitulo: string;
  justificativa: string;
}

export interface AnaliseCasoResponse {
  descricaoAnalisada: string;
  tipoCrime: string;
  categoria: string;
  leisAplicaveis: LeiAplicavel[];
  analise: string;
  recomendacoes: string[];
  palavrasDetectadas?: PalavraDetectada[];
  mapeamentoPalavrasArtigos?: Record<string, PalavraArtigoMapping[]>;
}

export type CategoriaJuridica = 
  | 'ADMINISTRATIVO'
  | 'AMBIENTAL'
  | 'CIVIL'
  | 'COMERCIAL'
  | 'CONSTITUCIONAL'
  | 'CRIMINAL'
  | 'ELEITORAL'
  | 'FAMILIA'
  | 'INTERNACIONAL'
  | 'MILITAR'
  | 'PREVIDENCIARIO'
  | 'PROCESSUAL'
  | 'SUCESSOES'
  | 'TRABALHO'
  | 'TRIBUTARIO';

export const CATEGORIAS_JURIDICAS: { value: CategoriaJuridica; label: string }[] = [
  { value: 'ADMINISTRATIVO', label: 'Direito Administrativo' },
  { value: 'AMBIENTAL', label: 'Direito Ambiental' },
  { value: 'CIVIL', label: 'Direito Civil' },
  { value: 'COMERCIAL', label: 'Direito Comercial' },
  { value: 'CONSTITUCIONAL', label: 'Direito Constitucional' },
  { value: 'CRIMINAL', label: 'Direito Criminal' },
  { value: 'ELEITORAL', label: 'Direito Eleitoral' },
  { value: 'FAMILIA', label: 'Direito de Família' },
  { value: 'INTERNACIONAL', label: 'Direito Internacional' },
  { value: 'MILITAR', label: 'Direito Militar' },
  { value: 'PREVIDENCIARIO', label: 'Direito Previdenciário' },
  { value: 'PROCESSUAL', label: 'Direito Processual' },
  { value: 'SUCESSOES', label: 'Direito das Sucessões' },
  { value: 'TRABALHO', label: 'Direito do Trabalho' },
  { value: 'TRIBUTARIO', label: 'Direito Tributário' },
];

// Tipos para Chat
export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  conteudo: string;
  fontes?: FonteReferencia[];
  createdAt: string;
}

export interface FonteReferencia {
  tipo: string;
  titulo: string;
  referencia?: string;
  relevancia?: number;
  conteudo?: string;
}

export interface ChatSession {
  id: string;
  titulo: string;
  status: 'ATIVA' | 'ARQUIVADA';
  totalMensagens: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRequest {
  sessaoId?: string;
  mensagem: string;
}

export interface ChatResponse {
  sessaoId: string;
  resposta: string;
  fontes?: FonteReferencia[];
  tokensUsados?: number;
}

// Tipos para Previsão
export interface PrevisaoRequest {
  processoId?: string;
  tipoCrimeId: string;
  reuPrimario?: boolean;
  confissao?: boolean;
  agravantes?: string[];
  atenuantes?: string[];
  idadeReu?: number;
  tentativa?: boolean;
  numeroVitimas?: number;
  valorPrejuizo?: number;
  violencia?: boolean;
  armaFogo?: boolean;
}

export interface PrevisaoResponse {
  id: string;
  processoId?: string;
  tipoCrime: string;
  penaPrevistaMeses: number;
  penaFormatada: string;
  confianca: number;
  explicacao: Record<string, unknown>;
  inputFeatures: Record<string, unknown>;
  sentencaRealMeses?: number;
  createdAt: string;
}

// Services
class BuscaService {
  async buscaSemantica(request: BuscaSemanticaRequest): Promise<ListaResultados> {
    const response = await api.post<ListaResultados>('/busca/semantica', request);
    return response.data;
  }

  async analisarCaso(request: AnaliseCasoRequest): Promise<AnaliseCasoResponse> {
    const response = await api.post<AnaliseCasoResponse>('/busca/analisar-caso', request);
    return response.data;
  }

  async getCategorias(): Promise<CategoriaJuridica[]> {
    const response = await api.get<CategoriaJuridica[]>('/busca/categorias');
    return response.data;
  }

  async buscarRelacionadas(categoria: CategoriaJuridica, limite?: number): Promise<ListaResultados> {
    const params = new URLSearchParams();
    params.append('categoria', categoria);
    if (limite) params.append('limite', limite.toString());
    const response = await api.post<ListaResultados>(`/busca/relacionadas?${params.toString()}`, {});
    return response.data;
  }
}

class ChatService {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/chat', request);
    return response.data;
  }

  async getSessoes(): Promise<ChatSession[]> {
    const response = await api.get<ChatSession[]>('/chat/sessoes');
    return response.data;
  }

  async getMensagens(sessaoId: string): Promise<ChatMessage[]> {
    const response = await api.get<ChatMessage[]>(`/chat/sessoes/${sessaoId}/mensagens`);
    return response.data;
  }

  async arquivarSessao(sessaoId: string): Promise<void> {
    await api.patch(`/chat/sessoes/${sessaoId}/arquivar`);
  }

  async deleteSessao(sessaoId: string): Promise<void> {
    await api.delete(`/chat/sessoes/${sessaoId}`);
  }
}

class PrevisaoService {
  async preverSentenca(request: PrevisaoRequest): Promise<PrevisaoResponse> {
    const response = await api.post<PrevisaoResponse>('/previsao', request);
    return response.data;
  }

  async getHistorico(): Promise<PrevisaoResponse[]> {
    const response = await api.get<PrevisaoResponse[]>('/previsao/historico');
    return response.data;
  }
}

export const buscaService = new BuscaService();
export const chatService = new ChatService();
export const previsaoService = new PrevisaoService();
