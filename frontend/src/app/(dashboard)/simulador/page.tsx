'use client';

import { useState, useEffect } from 'react';
import { 
  ScaleIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  BookOpenIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Input, Badge } from '@/components/ui';
import { simuladorService, EnquadramentoRequest, EnquadramentoResponse } from '@/services/simulador.service';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const TIPOS_CRIME = [
  { value: 'roubo', label: 'Roubo' },
  { value: 'furto', label: 'Furto' },
  { value: 'homicidio', label: 'Homicídio' },
  { value: 'lesao', label: 'Lesão Corporal' },
  { value: 'violencia', label: 'Violência Doméstica' },
  { value: 'estelionato', label: 'Estelionato' },
  { value: 'dano', label: 'Dano' },
  { value: 'ameaca', label: 'Ameaça' },
  { value: 'violacao', label: 'Violação de Domicílio' },
];

const CIRCUNSTANCIAS_AGRAVANTES = [
  'Flagrante delito',
  'Reincidência',
  'Uso de arma',
  'Violência contra pessoa vulnerable',
  'Dano em propriedade pública',
  'Crime organizado',
  'Polícia no exercício de funções',
];

export default function SimuladorPenalPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnquadramentoResponse | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState<EnquadramentoRequest>({
    descricaoCaso: '',
    tipoCrime: '',
    circunstancias: [],
    flagrante: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricaoCaso || !formData.tipoCrime) {
      toast.error('Preencha a descrição e o tipo de crime');
      return;
    }

    setLoading(true);
    try {
      const response = await simuladorService.enquadrar(formData);
      setResult(response);
      toast.success('Análise concluída!');
    } catch (error: any) {
      const message = error.message || error.response?.data?.message || 'Erro ao processar simulação';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCircunstancia = (circ: string) => {
    const current = formData.circunstancias || [];
    if (current.includes(circ)) {
      setFormData({ 
        ...formData, 
        circunstancias: current.filter(c => c !== circ) 
      });
    } else {
      setFormData({ 
        ...formData, 
        circunstancias: [...current, circ] 
      });
    }
  };

  const getProbabilidadeColor = (prob: number) => {
    if (prob >= 70) return 'success';
    if (prob >= 50) return 'warning';
    return 'danger';
  };

  const getFaseIcon = (fase: string) => {
    switch (fase) {
      case 'ANALISE': return <DocumentTextIcon className="w-5 h-5" />;
      case 'COMPARACAO': return <BookOpenIcon className="w-5 h-5" />;
      case 'AVALIACAO': return <ScaleIcon className="w-5 h-5" />;
      case 'CONCLUSAO': return <BeakerIcon className="w-5 h-5" />;
      default: return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  // Verificar acesso - ADMIN não pode usar simulador
  useEffect(() => {
    // Early return se user não está carregado
    if (!user) return;
    
    if (user.role === Role.ADMIN) {
      toast.error('Administrador não pode acessar o simulador penal.');
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulador de Enquadramento Penal"
        subtitle="Analise casos jurídicos com explicabilidade completa"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Simulador Penal' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Entrada */}
        <Card title="Descrição do Caso" subtitle="Forneça os factos para análise">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Crime *
              </label>
              <select
                value={formData.tipoCrime}
                onChange={(e) => setFormData({ ...formData, tipoCrime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Selecione o tipo de crime</option>
                {TIPOS_CRIME.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição do Caso *
              </label>
              <textarea
                value={formData.descricaoCaso}
                onChange={(e) => setFormData({ ...formData, descricaoCaso: e.target.value })}
                placeholder="Descreva os factos relevantes..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Circunstâncias Agravantes
              </label>
              <div className="flex flex-wrap gap-2">
                {CIRCUNSTANCIAS_AGRAVANTES.map((circ) => (
                  <button
                    key={circ}
                    type="button"
                    onClick={() => toggleCircunstancia(circ)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      formData.circunstancias?.includes(circ)
                        ? 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {circ}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="flagrante"
                checked={formData.flagrante || false}
                onChange={(e) => setFormData({ ...formData, flagrante: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary-600"
              />
              <label htmlFor="flagrante" className="text-sm text-gray-700">
                Flagrante delito
              </label>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full"
            >
              <ScaleIcon className="w-5 h-5 mr-2" />
              Analisar Caso
            </Button>
          </form>
        </Card>

        {/* Resultados */}
        <div className="space-y-4">
          {!result ? (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ScaleIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Aguardando análise...</p>
                <p className="text-sm mt-1">Preencha o formulário para iniciar</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Advertências */}
              {result.advertencias && result.advertencias.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Avisos Importantes</p>
                      <ul className="mt-1 text-sm text-amber-700 space-y-1">
                        {result.advertencias.map((adv, i) => (
                          <li key={i}>• {adv}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Conclusão */}
              {result.conclusao && (
                <Card 
                  title="Conclusão" 
                  subtitle={`Nível de confiança: ${result.conclusao.nivelConfianca}`}
                  className={result.conclusao.nivelConfianca === 'Alto' ? 'border-green-300' : 'border-amber-300'}
                >
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">{result.conclusao.recomendacao}</p>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Artigo mais próximo:</span>
                      <Badge variant="default">{result.conclusao.artigoMaisProximo}</Badge>
                    </div>
                    {result.conclusao.requerAnaliseJuridica && (
                      <div className="flex items-center gap-2 text-sm text-amber-600">
                        <InformationCircleIcon className="w-4 h-4" />
                        <span>Recomenda-se análise por profissional jurídico</span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Crimes Possíveis */}
              {result.crimesPossiveis && result.crimesPossiveis.length > 0 && (
                <Card title="Crimes Possíveis" subtitle={`${result.crimesPossiveis.length} crime(s) identificado(s)`}>
                  <div className="space-y-3">
                    {result.crimesPossiveis.map((crime, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Art. {crime.artigoNumero}º - {crime.artigoTitulo}
                            </p>
                            <p className="text-sm text-gray-500">{crime.tipoCrime}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getProbabilidadeColor(crime.probabilidade)}>
                              {Math.round(crime.probabilidade)}%
                            </Badge>
                            {crime.concurso && (
                              <p className="text-xs text-amber-600 mt-1">Concurso de crimes</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Pena mínima:</span>
                            <p className="font-medium">{crime.penaMinima}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <span className="text-gray-500">Pena máxima:</span>
                            <p className="font-medium">{crime.penaMaxima}</p>
                          </div>
                        </div>

                        {/* Elementos Encontrados */}
                        {crime.elementosEncontrados && crime.elementosEncontrados.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Elementos identificados:</p>
                            <div className="flex flex-wrap gap-1">
                              {crime.elementosEncontrados.map((elem, i) => (
                                <span key={i} className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1">
                                  <CheckCircleIcon className="w-3 h-3" />
                                  {elem.elemento}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Elementos Faltantes */}
                        {crime.elementosFaltantes && crime.elementosFaltantes.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Elementos não verificados:</p>
                            <div className="flex flex-wrap gap-1">
                              {crime.elementosFaltantes.map((elem, i) => (
                                <span key={i} className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                                  {elem.elemento}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Justificativa */}
                        {crime.justificativa && (
                          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                            <strong>Justificativa:</strong> {crime.justificativa}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Passos Explicativos */}
              {result.passosExplicativos && result.passosExplicativos.length > 0 && (
                <Card title="Passos da Análise" subtitle="Explicação detalhada do processo">
                  <div className="space-y-3">
                    {result.passosExplicativos.map((passo, index) => (
                      <div 
                        key={index} 
                        className={`flex gap-3 p-3 rounded-lg ${
                          passo.success ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                      >
                        <div className={`mt-0.5 ${
                          passo.success ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {getFaseIcon(passo.fase)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">{passo.fase}</span>
                            <span className="text-xs text-gray-400">Passo {passo.ordem}</span>
                          </div>
                          <p className="font-medium text-gray-900 mt-0.5">{passo.titulo}</p>
                          <p className="text-sm text-gray-600">{passo.descricao}</p>
                          {passo.detalhes && (
                            <p className="text-xs text-gray-500 mt-1 bg-white p-1 rounded">
                              {passo.detalhes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Button
                variant="outline"
                onClick={() => setResult(null)}
                className="w-full"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Nova Análise
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
