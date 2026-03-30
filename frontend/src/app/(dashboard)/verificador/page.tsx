'use client';

import { useState, useEffect } from 'react';
import { 
  ScaleIcon, 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  MinusCircleIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Badge } from '@/components/ui';
import { verificadorService, VerificarPenaRequest, VerificarPenaResponse } from '@/services/verificador.service';
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
];

const CIRCUNSTANCIAS_OPCOES = [
  { id: '1', tipo: 'AGRAVANTE', label: 'Reincidência específica' },
  { id: '2', tipo: 'AGRAVANTE', label: 'Crueldade' },
  { id: '3', tipo: 'AGRAVANTE', label: 'Abuso de poder' },
  { id: '4', tipo: 'ATENUANTE', label: 'Confissão espontânea' },
  { id: '5', tipo: 'ATENUANTE', label: 'Arrependimento' },
  { id: '6', tipo: 'ATENUANTE', label: 'Menor importância' },
];

export default function VerificadorPenasPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificarPenaResponse | null>(null);
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState<VerificarPenaRequest>({
    artigoId: '',
    tipoCrime: '',
    circunstanciasIds: [],
    flagrante: false,
    reincidencia: false,
    confissao: false,
    reparacaoDano: false,
  });

  // Verificar acesso - apenas JUIZ, PROCURADOR e ADVOGADO (ADMIN não pode acessar)
  useEffect(() => {
    if (user && (user.role === Role.ADMIN || user.role === Role.ESTUDANTE)) {
      toast.error('Acesso restrito. Apenas profissionais jurídicos qualificados podem usar o verificador.');
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.artigoId || !formData.tipoCrime) {
      toast.error('Selecione o artigo e o tipo de crime');
      return;
    }

    setLoading(true);
    try {
      const response = await verificadorService.calcularPena(formData);
      setResult(response);
      toast.success('Pena calculada com sucesso!');
    } catch (error: any) {
      const message = error.message || error.response?.data?.message || 'Erro ao calcular pena';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCircunstancia = (id: string) => {
    const current = formData.circunstanciasIds || [];
    if (current.includes(id)) {
      setFormData({ 
        ...formData, 
        circunstanciasIds: current.filter(c => c !== id) 
      });
    } else {
      setFormData({ 
        ...formData, 
        circunstanciasIds: [...current, id] 
      });
    }
  };

  const formatPena = (pena: any) => {
    const parts = [];
    if (pena.anos) parts.push(`${pena.anos} ano(s)`);
    if (pena.meses) parts.push(`${pena.meses} mês(es)`);
    if (pena.dias) parts.push(`${pena.dias} dia(s)`);
    if (pena.multa) parts.push(`${pena.multa} dias de multa`);
    return parts.join(', ');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verificador de Penas"
        subtitle="Calcule a pena com base no crime e circunstâncias"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Verificador de Penas' }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Entrada */}
        <Card title="Dados do Caso" subtitle="Forneça as informações para cálculo">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Artigo do Código Penal *
              </label>
              <input
                type="text"
                value={formData.artigoId}
                onChange={(e) => setFormData({ ...formData, artigoId: e.target.value })}
                placeholder="UUID do artigo (ex: abc123-def456...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              />
              <p className="text-xs text-gray-500 mt-1">
                Informe o UUID do artigo conforme disponível no Repositório Jurídico
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Crime *
              </label>
              <select
                value={formData.tipoCrime}
                onChange={(e) => setFormData({ ...formData, tipoCrime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
              >
                <option value="">Selecione</option>
                {TIPOS_CRIME.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Circunstâncias
              </label>
              <div className="space-y-2">
                {CIRCUNSTANCIAS_OPCOES.map((circ) => (
                  <label key={circ.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.circunstanciasIds?.includes(circ.id) || false}
                      onChange={() => toggleCircunstancia(circ.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600"
                    />
                    <span className="text-sm text-gray-700">{circ.label}</span>
                    <Badge variant={circ.tipo === 'AGRAVANTE' ? 'danger' : 'success'}>
                      {circ.tipo}
                    </Badge>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.flagrante || false}
                  onChange={(e) => setFormData({ ...formData, flagrante: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm text-gray-700">Flagrante delito</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reincidencia || false}
                  onChange={(e) => setFormData({ ...formData, reincidencia: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm text-gray-700">Reincidência</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.confissao || false}
                  onChange={(e) => setFormData({ ...formData, confissao: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm text-gray-700">Confissão espontânea</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reparacaoDano || false}
                  onChange={(e) => setFormData({ ...formData, reparacaoDano: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600"
                />
                <span className="text-sm text-gray-700">Reparação do dano</span>
              </label>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full"
            >
              <ScaleIcon className="w-5 h-5 mr-2" />
              Calcular Pena
            </Button>
          </form>
        </Card>

        {/* Resultados */}
        <div className="space-y-4">
          {!result ? (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ScaleIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Aguardando cálculo...</p>
                <p className="text-sm mt-1">Preencha o formulário para calcular</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Pena Final */}
              <Card title="Pena Calculada" className="border-primary-300">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500 mb-1">Pena Final</p>
                  <p className="text-3xl font-bold text-primary-800">
                    {formatPena(result.penaFinal)}
                  </p>
                  {result.regimeRecomendado && (
                    <Badge variant="default" className="mt-2">
                      Regime: {result.regimeRecomendado}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Pena Base</p>
                    <p className="font-semibold">{formatPena(result.penaBase)}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Total Ajustes</p>
                    <p className="font-semibold">{result.ajustes?.length || 0} ajustes</p>
                  </div>
                </div>
              </Card>

              {/* Ajustes */}
              {result.ajustes && result.ajustes.length > 0 && (
                <Card title="Ajustes à Pena">
                  <div className="space-y-2">
                    {result.ajustes.map((ajuste, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-2 rounded ${
                          ajuste.aplicado ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {ajuste.aplicado ? (
                            <PlusCircleIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <MinusCircleIcon className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-sm">{ajuste.descricao}</span>
                        </div>
                        <Badge variant={ajuste.aplicado ? 'success' : 'default'}>
                          {ajuste.percentual ? `${ajuste.percentual}%` : ajuste.tipo}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Justificação */}
              {result.justificacao && result.justificacao.length > 0 && (
                <Card title="Justificação">
                  <div className="space-y-2">
                    {result.justificacao.map((passo, index) => (
                      <div 
                        key={index} 
                        className={`flex gap-2 p-2 rounded ${
                          passo.favoravel ? 'bg-blue-50' : 'bg-amber-50'
                        }`}
                      >
                        <div className="mt-0.5">
                          {passo.favoravel ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{passo.titulo}</p>
                          <p className="text-xs text-gray-600">{passo.descricao}</p>
                          {passo.artigoReferencia && (
                            <p className="text-xs text-gray-400 mt-1">Ref: {passo.artigoReferencia}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Base Legal */}
              {result.baseLegal && (
                <Card title="Base Legal">
                  <div className="space-y-2 text-sm">
                    <p><strong>Artigo Principal:</strong> {result.baseLegal.artigoPrincipal}</p>
                    {result.baseLegal.artigoAgregador && (
                      <p><strong>Artigo Agregador:</strong> {result.baseLegal.artigoAgregador}</p>
                    )}
                    {result.baseLegal.artigosRelevantes && result.baseLegal.artigosRelevantes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-500 mb-1">Artigos Relevantes:</p>
                        <div className="flex flex-wrap gap-1">
                          {result.baseLegal.artigosRelevantes.map((art, i) => (
                            <Badge key={i} variant="default">{art}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <Button
                variant="outline"
                onClick={() => setResult(null)}
                className="w-full"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Novo Cálculo
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
