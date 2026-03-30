'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ScaleIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  MapIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Spinner } from '@/components/ui';
import { dashboardService, CrimeEstatisticas } from '@/services/dashboard.service';
import { useAuthStore } from '@/store/auth.store';
import { JusticeIllustration, AngolaFlag, PalancaNegra, AngolaEmblem, AngolaPattern } from '@/components/illustrations';
import { DashboardResponse, Role } from '@/types';

// Card de estatística redesenhado
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'blue',
  subtitle 
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  subtitle?: string;
}) {
  const colors = {
    blue: 'from-[#5DADE2] to-[#5DADE2]',
    green: 'from-[#6FCF97] to-[#6FCF97]',
    yellow: 'from-[#F7DC6F] to-[#F7DC6F]',
    red: 'from-[#E57373] to-[#E57373]',
    purple: 'from-[#8E44AD] to-[#8E44AD]',
  };

  const barColors = {
    blue: 'bg-[#EAF6FD]',
    green: 'bg-[#E8F8F0]',
    yellow: 'bg-[#FEF7E8]',
    red: 'bg-[#FCEDEE]',
    purple: 'bg-[#F5E9F8]',
  };

  return (
    <div className="bg-transparent rounded-[12px] p-5 border border-transparent shadow-none hover:shadow-none transition-all duration-300 group cursor-default">
      {/* Barra colorida no topo */}
      <div className={`h-1 ${barColors[color]} rounded-t-[12px]`} />
      <div className="flex items-start justify-between mb-4 mt-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-[#6FCF97]' : 'text-[#E57373]'}`}>
            <ArrowTrendingUpIcon className={`h-4 w-4 ${!trend.isPositive && 'rotate-180'}`} />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-[#4F4F4F] mb-1">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

// Card de acesso rápido
function QuickAccessCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  color = 'blue' 
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color?: string;
}) {
  return (
    <Link 
      href={href}
      className="group bg-transparent rounded-[12px] p-5 border border-transparent shadow-none hover:shadow-none transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F5F6FA] group-hover:bg-[#5B5FEF]/10 flex items-center justify-center transition-colors">
          <Icon className="h-6 w-6 text-[#5B5FEF]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#4F4F4F] group-hover:text-[#5B5FEF] transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
        <ArrowRightIcon className="h-5 w-5 text-[#7A7A7A] group-hover:text-[#5DADE2] group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

// Card de atividade recente
function ActivityCard({ activities }: { activities: Array<{ tipo: string; descricao: string; data: string; status: string }> }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EM_ANDAMENTO': return 'bg-blue-100 text-blue-700';
      case 'SENTENCIADO': return 'bg-green-100 text-green-700';
      case 'RECEBIDA': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-transparent rounded-[12px] border border-transparent shadow-none">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-[#4F4F4F]">Actividade Recente</h3>
        <p className="text-sm text-[#7A7A7A]">Últimas movimentações no sistema</p>
      </div>
      <div className="divide-y divide-gray-50">
        {activities.map((activity, idx) => (
          <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-[#5DADE2] mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.tipo}</p>
                <p className="text-sm text-gray-500 mt-0.5">{activity.descricao}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(activity.status)}`}>
                {activity.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-gray-100">
        <Link href="/processos" className="text-sm text-[#5DADE2] hover:text-[#3498DB] font-medium">
          Ver todas as actividades →
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [crimeStats, setCrimeStats] = useState<CrimeEstatisticas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [atualizacoes, setAtualizacoes] = useState<{
    leis: Array<{ id: string; titulo: string; tipo: string; dataVigencia?: string; dataPublicacao?: string }>;
    jurisprudencias: Array<{ id: string; titulo: string; numero: string; data: string }>;
  }>({ leis: [], jurisprudencias: [] });
  const [loadingAtualizacoes, setLoadingAtualizacoes] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, crimeData] = await Promise.all([
          dashboardService.getDashboard(),
          dashboardService.getCrimeEstatisticas()
        ]);
        setData(dashboardData);
        setCrimeStats(crimeData);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        // Tentar carregar apenas dashboard se crime stats falhar
        try {
          const dashboardData = await dashboardService.getDashboard();
          setData(dashboardData);
        } catch (e) {
          console.error('Erro ao carregar dados:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAtualizacoes = async () => {
      try {
        // Importar o axios configurado para manter os headers de autenticação
        const api = (await import('@/lib/api')).default;
        
        // Buscar leis mais recentes
        const leisResponse = await api.get('/leis?page=0&size=5&sort=dataVigencia,desc');
        // Buscar sentenças mais recentes
        const sentencasResponse = await api.get('/sentencas?page=0&size=5&sort=createdAt,desc');
        
        setAtualizacoes({
          leis: leisResponse.data.content || [],
          jurisprudencias: sentencasResponse.data.content || []
        });
      } catch (error) {
        console.error('Erro ao carregar actualizações:', error);
        // Mantém array vazio em caso de erro
        setAtualizacoes({ leis: [], jurisprudencias: [] });
      } finally {
        setLoadingAtualizacoes(false);
      }
    };

    fetchData();
    fetchAtualizacoes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner size="lg" />
        <p className="mt-4 text-[#7A7A7A]">A carregar dados...</p>
      </div>
    );
  }

  const activities = [
    { tipo: 'Novo Processo', descricao: 'Processo 2024/001234 registado no Tribunal de Luanda', status: 'EM_ANDAMENTO', data: new Date().toISOString() },
    { tipo: 'Sentença Proferida', descricao: 'Processo 2024/000987 - Decisão do Tribunal Provincial', status: 'SENTENCIADO', data: new Date().toISOString() },
    { tipo: 'Actualização Legislativa', descricao: 'Lei 23/24 publicada no Diário da República', status: 'EM_ANDAMENTO', data: new Date().toISOString() },
  ];

  const quickAccess = [
    { title: 'Novo Processo', description: 'Registar um novo processo judicial', icon: ScaleIcon, href: '/processos/novo' },
    { title: 'Consultar Legislação', description: 'Pesquisar leis e artigos', icon: BookOpenIcon, href: '/legislacao' },
    { title: 'Jurisprudência', description: 'Base de decisões judiciais', icon: DocumentTextIcon, href: '/jurisprudencia' },
    { title: 'Análise de Casos IA', description: 'Buscar e analisar casos com IA', icon: SparklesIcon, href: '/busca' },
  ];

  return (
    <div className="bg-transparent min-h-screen p-5 md:p-6 font-sans text-[#4F4F4F] space-y-5">
      {/* Cabeçalho com boas-vindas */}
      <div className="bg-transparent rounded-[12px] p-6 text-[#4F4F4F] relative overflow-hidden shadow-none border border-transparent">
        {/* Padrão decorativo angolano */}
        <div className="absolute inset-0 opacity-5">
          <AngolaPattern className="w-full h-full" />
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 border border-white rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-32 h-32 border border-white rounded-full translate-y-1/2" />
        </div>
        {/* Bandeira decorativa */}
        <div className="absolute top-4 right-4 w-16 opacity-30 hover:opacity-50 transition-opacity">
          <AngolaFlag />
        </div>
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Bem-vindo ao Sistema Penal
              </h1>
              <p className="text-[#7A7A7A] text-lg">
                Plataforma de Gestão Judicial da República de Angola
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-transparent rounded-[12px] border border-transparent p-3">
              <CalendarDaysIcon className="h-5 w-5 text-[#5DADE2]" />
              <div>
                <p className="text-xs text-[#7A7A7A]">Data actual</p>
                <p className="text-sm font-semibold text-[#4F4F4F]">
                  {new Date().toLocaleDateString('pt-AO', { 
                    weekday: 'short',
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Estatísticas rápidas no banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
            <div className="bg-white rounded-[12px] p-4 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <p className="text-3xl font-bold text-[#4F4F4F]">{data?.resumoGeral.totalProcessos.toLocaleString('pt-AO') || '0'}</p>
              <p className="text-sm text-[#7A7A7A]">Processos Totais</p>
            </div>
            <div className="bg-white rounded-[12px] p-4 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <p className="text-3xl font-bold text-[#4F4F4F]">{data?.resumoGeral.processosEmAndamento.toLocaleString('pt-AO') || '0'}</p>
              <p className="text-sm text-[#7A7A7A]">Em Andamento</p>
            </div>
            <div className="bg-white rounded-[12px] p-4 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <p className="text-3xl font-bold text-[#4F4F4F]">{data?.resumoGeral.processosEmAndamento.toLocaleString('pt-AO') || '0'}</p>
              <p className="text-sm text-[#7A7A7A]">Processos Activos</p>
            </div>
            <div className="bg-white rounded-[12px] p-4 border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
              <p className="text-3xl font-bold text-[#4F4F4F]">{data?.resumoGeral.totalSentencas.toLocaleString('pt-AO') || '0'}</p>
              <p className="text-sm text-[#7A7A7A]">Sentenças</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas detalhadas */}
      <div>
        <h2 className="text-lg font-semibold text-[#4F4F4F] mb-4">Indicadores Principais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Processos em Andamento"
            value={data?.resumoGeral.processosEmAndamento.toLocaleString('pt-AO') || '0'}
            icon={ClockIcon}
            color="blue"
            trend={{ value: 12, isPositive: true }}
            subtitle="Activos no sistema"
          />
          <StatCard
            title="Casos Recebidos"
            value={data?.resumoGeral.totalDenuncias.toLocaleString('pt-AO') || '0'}
            icon={ShieldExclamationIcon}
            color="yellow"
            subtitle="Total registados"
          />
          <StatCard
            title="Sentenças Proferidas"
            value={data?.resumoGeral.totalSentencas.toLocaleString('pt-AO') || '0'}
            icon={CheckCircleIcon}
            color="green"
            trend={{ value: 8, isPositive: true }}
            subtitle="Decisões finais"
          />
          <StatCard
            title="Utilizadores Activos"
            value={data?.resumoGeral.usuariosAtivos.toLocaleString('pt-AO') || '0'}
            icon={UserGroupIcon}
            color="purple"
            subtitle="No sistema"
          />
        </div>
      </div>

      {/* Gráficos de Estatísticas de Crimes */}
      {crimeStats && (crimeStats.crimesPorRegiao.length > 0 || crimeStats.crimesMaisSimulados.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Gráfico de Crimes por Região */}
          <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg font-semibold text-[#4F4F4F] mb-4">Crimes por Região</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crimeStats.crimesPorRegiao} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#7A7A7A" fontSize={12} />
                  <YAxis type="category" dataKey="regiao" stroke="#7A7A7A" fontSize={12} width={75} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E0E0E0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      color: '#1F2937'
                    }}
                    formatter={(value: number) => [`${value} processos`, 'Quantidade']}
                  />
                  <Bar dataKey="quantidade" fill="#5DADE2" radius={[0, 4, 4, 0]} name="Processos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Crimes Mais Simulados */}
          <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <h3 className="text-lg font-semibold text-[#4F4F4F] mb-4">Crimes Mais Simulados</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={crimeStats.crimesMaisSimulados.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ tipoCrime, percentual }) => `${tipoCrime}: ${percentual.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8E44AD"
                    dataKey="quantidade"
                    nameKey="tipoCrime"
                  >
                    {crimeStats.crimesMaisSimulados.slice(0, 6).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#5DADE2', '#8E44AD', '#6FCF97', '#E57373', '#BFC9DE', '#A0A0A0'][index % 6]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value} simulações`, 
                      name === 'quantidade' ? 'Quantidade' : name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Acesso Rápido e Actividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Acesso Rápido */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickAccess.map((item, idx) => (
              <QuickAccessCard key={idx} {...item} />
            ))}
          </div>
        </div>

        {/* Actividade Recente */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actividade Recente</h2>
          <ActivityCard activities={activities} />
        </div>
      </div>

      {/* Painel de Actualizações Legislativas e Jurisprudenciais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Actualizações Legislativas */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#4F4F4F] flex items-center gap-2">
              <BuildingLibraryIcon className="h-5 w-5 text-primary-600" />
              Actualizações Legislativas
            </h3>
            <Link href="/legislacao" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {loadingAtualizacoes ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : atualizacoes.leis.length > 0 ? (
              atualizacoes.leis.slice(0, 5).map((lei, idx) => (
                <Link 
                  key={lei.id || idx} 
                  href={`/legislacao/${lei.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">{lei.titulo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{lei.tipo}</span>
                    <span className="text-xs text-gray-500">{lei.dataVigencia || lei.dataPublicacao}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BuildingLibraryIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">Nenhuma actualização legislativa recente</p>
                <Link href="/legislacao/novo" className="text-sm text-primary-600 hover:underline mt-2 inline-block">
                  Adicionar nova lei
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Actualizações Jurisprudenciais */}
        <div className="bg-white rounded-[12px] border border-gray-200 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#4F4F4F] flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5 text-primary-600" />
              Actualizações Jurisprudenciais
            </h3>
            <Link href="/jurisprudencia" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {loadingAtualizacoes ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : atualizacoes.jurisprudencias.length > 0 ? (
              atualizacoes.jurisprudencias.slice(0, 5).map((juris, idx) => (
                <Link 
                  key={juris.id || idx} 
                  href={`/jurisprudencia/${juris.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <p className="text-sm font-medium text-gray-900 truncate">{juris.titulo}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">{juris.numero}</span>
                    <span className="text-xs text-gray-500">{juris.data}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">Nenhuma jurisprudência recente</p>
                <Link href="/jurisprudencia" className="text-sm text-primary-600 hover:underline mt-2 inline-block">
                  Consultar jurisprudência
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
      {/* Card motivacional com ilustração */}
        <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-lg p-8 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          {/* Padrão decorativo angolano */}
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <AngolaPattern className="w-full h-full" />
          </div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 border border-white rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border border-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold">Justiça para Todos</h3>
                  <div className="w-8 h-8 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <AngolaEmblem className="w-full h-full" />
                  </div>
                </div>
                <p className="text-[#7A7A7A] mb-6">
                  O Sistema Penal de Angola trabalha para garantir uma justiça célere, 
                  transparente e acessível a todos os cidadãos.
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="text-center group/stat">
                    <p className="text-3xl font-bold group-hover/stat:scale-110 transition-transform">98%</p>
                    <p className="text-xs text-[#7A7A7A]">Satisfação</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center group/stat">
                    <p className="text-3xl font-bold group-hover/stat:scale-110 transition-transform">24h</p>
                    <p className="text-xs text-[#7A7A7A]">Resposta média</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center group/stat">
                    <p className="text-3xl font-bold group-hover/stat:scale-110 transition-transform">18</p>
                    <p className="text-xs text-[#7A7A7A]">Províncias</p>
                  </div>
                </div>
              </div>

              {/* Ilustração com Palanca Negra */}
              <div className="hidden md:flex flex-col items-center gap-2 w-32">
                <div className="w-20 h-20 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <PalancaNegra className="w-full h-full" />
                </div>
                <JusticeIllustration variant="scales" className="w-full opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>
            </div>

            {/* Barra de cores da bandeira angolana */}
            <div className="mt-6 flex gap-1 rounded-full overflow-hidden">
              <div className="h-2 flex-1 bg-[#CC092F] group-hover:h-3 transition-all" />
              <div className="h-2 flex-1 bg-black group-hover:h-3 transition-all" />
              <div className="h-2 flex-1 bg-[#FFCC00] group-hover:h-3 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
