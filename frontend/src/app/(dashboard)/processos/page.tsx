'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  ScaleIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button, Card, Table, Pagination, Badge, Input, Select, Spinner } from '@/components/ui';
import { processoService } from '@/services/processo.service';
import { formatDate, getStatusColor, formatStatus } from '@/lib/utils';
import type { ProcessoSummary, StatusProcesso, Page } from '@/types';

const statusOptions = [
  { value: '', label: 'Todos os status' },
  { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
  { value: 'AGUARDANDO_AUDIENCIA', label: 'Aguardando Audiência' },
  { value: 'EM_JULGAMENTO', label: 'Em Julgamento' },
  { value: 'SENTENCIADO', label: 'Sentenciado' },
  { value: 'ARQUIVADO', label: 'Arquivado' },
];

interface StatCard {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
}

export default function ProcessosPage() {
  const router = useRouter();
  const [data, setData] = useState<Page<ProcessoSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    if (!data?.content) return { total: 0, emAndamento: 0, sentenciados: 0, arquivados: 0, emJulgamento: 0 };
    
    const content = data.content;
    return {
      total: data.totalElements || 0,
      emAndamento: content.filter(p => p.status === 'EM_ANDAMENTO' || p.status === 'AGUARDANDO_AUDIENCIA').length,
      sentenciados: content.filter(p => p.status === 'SENTENCIADO').length,
      arquivados: content.filter(p => p.status === 'ARQUIVADO').length,
      emJulgamento: content.filter(p => p.status === 'EM_JULGAMENTO').length,
    };
  }, [data]);

  const statCards: StatCard[] = [
    {
      title: 'Total de Processos',
      value: stats.total,
      icon: DocumentTextIcon,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-400/30',
    },
    {
      title: 'Em Andamento',
      value: stats.emAndamento,
      icon: ClockIcon,
      gradient: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-400/30',
    },
    {
      title: 'Em Julgamento',
      value: stats.emJulgamento,
      icon: ScaleIcon,
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-400/30',
    },
    {
      title: 'Sentenciados',
      value: stats.sentenciados,
      icon: CheckCircleIcon,
      gradient: 'from-emerald-500 to-green-600',
      iconBg: 'bg-emerald-400/30',
    },
    {
      title: 'Arquivados',
      value: stats.arquivados,
      icon: ArchiveBoxIcon,
      gradient: 'from-gray-500 to-gray-600',
      iconBg: 'bg-gray-400/30',
    },
  ];

  const columns = [
    { key: 'numero', header: 'Número', render: (item: ProcessoSummary) => (
      <span className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">{item.numero}</span>
    )},
    { key: 'tipoCrimeNome', header: 'Tipo de Crime', render: (item: ProcessoSummary) => (
      item.tipoCrimeNome || <span className="text-gray-400">-</span>
    )},
    { key: 'tribunalNome', header: 'Tribunal', render: (item: ProcessoSummary) => (
      item.tribunalNome || <span className="text-gray-400">-</span>
    )},
    { key: 'provincia', header: 'Província' },
    { key: 'status', header: 'Status', render: (item: ProcessoSummary) => (
      <Badge className={`${getStatusColor(item.status)} transition-all duration-200 hover:scale-105`}>
        {formatStatus(item.status)}
      </Badge>
    )},
    { key: 'dataAbertura', header: 'Data Abertura', render: (item: ProcessoSummary) => (
      formatDate(item.dataAbertura)
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Elemento decorativo angolano sutil */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <pattern id="palanca" patternUnits="userSpaceOnUse" width="20" height="20">
            <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="currentColor" className="text-red-600" />
          </pattern>
          <circle cx="50" cy="50" r="45" fill="url(#palanca)" />
        </svg>
      </div>

      <PageHeader
        title="Processos"
        subtitle="Gestão de processos judiciais"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Processos' },
        ]}
        actions={
          <Button 
            onClick={() => router.push('/processos/novo')}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <PlusIcon className="h-5 w-5" />
            Novo Processo
          </Button>
        }
      />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={stat.title}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.gradient} p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] cursor-default`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Padrão decorativo angolano sutil */}
            <div className="absolute -right-2 -top-2 w-16 h-16 opacity-10">
              <svg viewBox="0 0 40 40">
                <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="white" />
                <circle cx="20" cy="20" r="8" fill="white" opacity="0.5" />
              </svg>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">{stat.title}</p>
                <p className="mt-1 text-3xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`${stat.iconBg} rounded-xl p-3`}>
                <stat.icon className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card padding="none" className="overflow-hidden shadow-lg border-0 ring-1 ring-gray-200/50">
        {/* Barra de pesquisa moderna */}
        <div className="p-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className={`flex-1 relative transition-all duration-300 ${searchFocused ? 'scale-[1.01]' : ''}`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-xl blur-xl transition-opacity duration-300 ${searchFocused ? 'opacity-100' : 'opacity-0'}`} />
              <div className="relative">
                <MagnifyingGlassIcon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${searchFocused ? 'text-primary-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Buscar por número do processo..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 placeholder:text-gray-400 text-gray-700 shadow-sm hover:shadow-md"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                className="w-52 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 hover:shadow-md"
              />
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={`border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 ${showFilters ? 'bg-primary-50 border-primary-500 text-primary-600' : ''}`}
              >
                <FunnelIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-b from-gray-50/50 to-white">
            <Spinner size="lg" />
            <p className="mt-4 text-sm text-gray-500 animate-pulse">A carregar processos...</p>
          </div>
        ) : (
          <>
            <div className="[&_table]:border-separate [&_table]:border-spacing-0 [&_tr]:transition-all [&_tr]:duration-200 [&_tbody_tr:hover]:bg-gradient-to-r [&_tbody_tr:hover]:from-primary-50/50 [&_tbody_tr:hover]:to-transparent [&_tbody_tr:hover]:shadow-sm [&_tbody_tr]:cursor-pointer">
              <Table
                columns={columns}
                data={data?.content || []}
                keyExtractor={(item) => item.id}
                onRowClick={(item) => router.push(`/processos/${item.id}`)}
                emptyMessage="Nenhum processo encontrado"
              />
            </div>
            {data && data.totalPages > 1 && (
              <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <Pagination
                  currentPage={data.number}
                  totalPages={data.totalPages}
                  totalElements={data.totalElements}
                  onPageChange={setPage}
                  isFirst={data.first}
                  isLast={data.last}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Marca sutil de Angola no rodapé */}
      <div className="flex justify-center opacity-30 py-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-4 h-3 rounded-sm overflow-hidden flex flex-col">
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-black" />
          </div>
          <span>Sistema de Gestão Processual Penal</span>
        </div>
      </div>
    </div>
  );
}
