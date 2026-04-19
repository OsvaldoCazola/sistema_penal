'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ScaleIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui';
import { processoService } from '@/services/processo.service';
import { formatDate, formatStatus } from '@/lib/utils';
import type { ProcessoSummary, StatusProcesso, Page } from '@/types';

const statusOptions = [
  { value: '', label: 'Todos os estados' },
  { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
  { value: 'AGUARDANDO_AUDIENCIA', label: 'Aguardando Audiência' },
  { value: 'EM_JULGAMENTO', label: 'Em Julgamento' },
  { value: 'SENTENCIADO', label: 'Sentenciado' },
  { value: 'ARQUIVADO', label: 'Arquivado' },
];

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  EM_ANDAMENTO:          { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  AGUARDANDO_AUDIENCIA:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  EM_JULGAMENTO:         { bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-500' },
  SENTENCIADO:           { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  ARQUIVADO:             { bg: 'bg-gray-100',   text: 'text-gray-500',    dot: 'bg-gray-400' },
};

export default function ProcessosPage() {
  const router = useRouter();
  const [data, setData] = useState<Page<ProcessoSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await processoService.listar({
        page,
        size: 20,
        status: statusFilter as StatusProcesso || undefined,
      });
      setData(response);
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = useMemo(() => {
    if (!data?.content) return { total: 0, emAndamento: 0, sentenciados: 0, arquivados: 0, emJulgamento: 0 };
    return {
      total: data.totalElements || 0,
      emAndamento: data.content.filter(p => p.status === 'EM_ANDAMENTO' || p.status === 'AGUARDANDO_AUDIENCIA').length,
      emJulgamento: data.content.filter(p => p.status === 'EM_JULGAMENTO').length,
      sentenciados: data.content.filter(p => p.status === 'SENTENCIADO').length,
      arquivados: data.content.filter(p => p.status === 'ARQUIVADO').length,
    };
  }, [data]);

  const statCards = [
    { title: 'Total de Processos', value: stats.total, icon: DocumentTextIcon, color: 'blue' },
    { title: 'Em Andamento', value: stats.emAndamento, icon: ClockIcon, color: 'amber' },
    { title: 'Em Julgamento', value: stats.emJulgamento, icon: ScaleIcon, color: 'purple' },
    { title: 'Sentenciados', value: stats.sentenciados, icon: CheckCircleIcon, color: 'green' },
  ];

  const palette: Record<string, { bar: string; icon: string; iconText: string }> = {
    blue:   { bar: '#1D4ED8', icon: '#EFF6FF', iconText: '#1D4ED8' },
    amber:  { bar: '#D97706', icon: '#FFFBEB', iconText: '#D97706' },
    purple: { bar: '#7C3AED', icon: '#F5F3FF', iconText: '#7C3AED' },
    green:  { bar: '#059669', icon: '#ECFDF5', iconText: '#059669' },
  };

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Gestão de Processos"
        subtitle="Acompanhamento e gestão de processos judiciais"
        icon={ScaleIcon}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Processos' },
        ]}
        actions={
          <Link href="/processos/novo">
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#1a2744] rounded-lg hover:bg-[#243561] transition-colors">
              <PlusIcon className="h-4 w-4" />
              Novo Processo
            </button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const p = palette[s.color];
          return (
            <div key={s.title} className="bg-white rounded-xl border border-gray-100 p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: p.bar }} />
              <div className="flex items-center gap-3 mt-1">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: p.icon }}>
                  <s.icon className="h-4 w-4" style={{ color: p.iconText }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar processo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="relative">
          <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-56 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-gray-400">A carregar processos...</p>
        </div>
      ) : data && data.content.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr_140px_120px_130px_36px] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Processo</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Réu</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Data</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</p>
            <div />
          </div>

          {data.content.map((proc) => {
            const st = statusStyles[proc.status] ?? statusStyles.ARQUIVADO;
            return (
              <div
                key={proc.id}
                onClick={() => router.push(`/processos/${proc.id}`)}
                className="grid grid-cols-[1fr_140px_120px_130px_36px] gap-4 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-blue-50/30 cursor-pointer transition-colors group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                    {proc.numero}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{proc.tipoCrime}</p>
                </div>
                <p className="text-sm text-gray-600 truncate">{proc.nomeReu}</p>
                <p className="text-xs text-gray-500">{proc.dataAbertura ? formatDate(proc.dataAbertura) : '—'}</p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md w-fit ${st.bg} ${st.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                  {formatStatus(proc.status)}
                </span>
                <ArrowRightIcon className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
            <ScaleIcon className="h-7 w-7 text-gray-300" />
          </div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Nenhum processo encontrado</h3>
          <p className="text-xs text-gray-400 mb-5">Tente ajustar os filtros ou criar um novo processo.</p>
          <Link href="/processos/novo">
            <button className="text-xs font-semibold text-white bg-[#1a2744] px-4 py-2 rounded-lg hover:bg-[#243561] transition-colors">
              Registar processo
            </button>
          </Link>
        </div>
      )}

      {/* Paginação */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-xs font-medium px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-4 py-2">
            {page + 1} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
            disabled={page >= data.totalPages - 1}
            className="text-xs font-medium px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Seguinte →
          </button>
        </div>
      )}
    </div>
  );
}
