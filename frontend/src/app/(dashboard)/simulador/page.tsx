'use client';

import { useState } from 'react';
import {
  BeakerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BookOpenIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import { simuladorService, EnquadramentoRequest, EnquadramentoResponse } from '@/services/simulador.service';
import toast from 'react-hot-toast';

const TIPOS_CRIME = [
  { value: '', label: 'Seleccione o tipo de crime' },
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

const CIRCUNSTANCIAS = [
  'Flagrante delito', 'Reincidência', 'Uso de arma',
  'Violência contra pessoa vulnerável', 'Dano em propriedade pública',
  'Crime organizado', 'Polícia no exercício de funções',
];

const labelInput = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';
const inputCls = 'w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all';

export default function SimuladorPenalPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnquadramentoResponse | null>(null);
  const [formData, setFormData] = useState<EnquadramentoRequest>({
    descricaoCaso: '', tipoCrime: '', circunstancias: [], flagrante: false,
  });

  const toggleCircunstancia = (c: string) => {
    const cur = formData.circunstancias || [];
    setFormData(prev => ({
      ...prev,
      circunstancias: cur.includes(c) ? cur.filter(x => x !== c) : [...cur, c],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricaoCaso || !formData.tipoCrime) {
      toast.error('Preencha a descrição e o tipo de crime');
      return;
    }
    setLoading(true);
    try {
      const r = await simuladorService.enquadrar(formData);
      setResult(r);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao processar simulação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Simulador Penal"
        subtitle="Enquadramento jurídico de casos com base na legislação angolana"
        icon={BeakerIcon}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Simulador Penal' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-4">Dados do Caso</p>

            <div className="space-y-4">
              <div>
                <label className={labelInput}>Descrição dos factos</label>
                <textarea
                  rows={5}
                  placeholder="Descreva os factos do caso de forma objectiva e detalhada..."
                  value={formData.descricaoCaso}
                  onChange={e => setFormData(p => ({ ...p, descricaoCaso: e.target.value }))}
                  className={inputCls + ' resize-none'}
                />
              </div>

              <div>
                <label className={labelInput}>Tipo de crime</label>
                <select
                  value={formData.tipoCrime}
                  onChange={e => setFormData(p => ({ ...p, tipoCrime: e.target.value }))}
                  className={inputCls}
                >
                  {TIPOS_CRIME.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className={labelInput}>Circunstâncias agravantes</label>
                <div className="grid grid-cols-1 gap-2">
                  {CIRCUNSTANCIAS.map(c => (
                    <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.circunstancias || []).includes(c)}
                        onChange={() => toggleCircunstancia(c)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.flagrante}
                  onChange={e => setFormData(p => ({ ...p, flagrante: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-amber-800">Em flagrante delito</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243561] transition-colors disabled:opacity-60"
            >
              {loading ? <><Spinner size="sm" /> A processar...</> : <><BeakerIcon className="h-4 w-4" /> Analisar Caso</>}
            </button>
            {result && (
              <button
                type="button"
                onClick={() => setResult(null)}
                className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Resultado */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <BeakerIcon className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">Resultado da análise</p>
              <p className="text-xs text-gray-400">Preencha o formulário e clique em "Analisar Caso"</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Spinner size="lg" />
              <p className="mt-4 text-sm text-gray-400">A processar a análise jurídica...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Resultado da Análise</p>

              {result.tipoCrimeIdentificado && (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Crime identificado</p>
                  <p className="text-sm font-bold text-blue-900">{result.tipoCrimeIdentificado}</p>
                </div>
              )}

              {result.artigos && result.artigos.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Artigos aplicáveis</p>
                  <div className="space-y-2">
                    {result.artigos.map((artigo: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <BookOpenIcon className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{artigo.numero}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{artigo.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.penaMinima && result.penaMaxima && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Pena prevista</p>
                  <p className="text-sm font-bold text-amber-900">
                    {result.penaMinima} a {result.penaMaxima} anos de prisão
                  </p>
                </div>
              )}

              {result.explicacao && (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Fundamentação</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.explicacao}</p>
                </div>
              )}

              <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-start gap-2">
                <InformationCircleIcon className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700">
                  Esta análise tem carácter indicativo. A decisão final compete ao tribunal competente.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
