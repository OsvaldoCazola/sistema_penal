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
  UsersIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { Spinner } from '@/components/ui';
import { dashboardService } from '@/services/dashboard.service';
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
    blue: 'from-primary-500 to-primary-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-primary-100 hover:-translate-y-1 transition-all duration-300 group cursor-default">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <ArrowTrendingUpIcon className={`h-4 w-4 ${!trend.isPositive && 'rotate-180'}`} />
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
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
      className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
        <ArrowRightIcon className="h-5 w-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
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
    <div className="bg-white rounded-2xl border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Actividade Recente</h3>
        <p className="text-sm text-gray-500">Últimas movimentações no sistema</p>
      </div>
      <div className="divide-y divide-gray-50">
        {activities.map((activity, idx) => (
          <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
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
        <Link href="/processos" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          Ver todas as actividades →
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getDashboard();
        setData(response);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500">A carregar dados...</p>
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
    { title: 'Jurisprudência', description: 'Base de decisões judiciais', icon: ScaleIcon, href: '/jurisprudencia' },
    { title: 'Análise de Casos IA', description: 'Buscar e analisar casos com IA', icon: SparklesIcon, href: '/busca' },
    { title: 'Gestão de Utilizadores', description: 'Admin: gerir usuários do sistema', icon: UsersIcon, href: '/usuarios', adminOnly: true },
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho com boas-vindas */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-500 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
              <p className="text-primary-100 text-lg">
                Plataforma de Gestão Judicial da República de Angola
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
              <CalendarDaysIcon className="h-5 w-5" />
              <div>
                <p className="text-xs text-primary-200">Data actual</p>
                <p className="text-sm font-medium">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{data?.resumoGeral.totalProcessos.toLocaleString('pt-AO') || '0'}</p>
              <p className="text-sm text-primary-200">Processos Totais</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{data?.resumoGeral.processosEmAndamento.toLocaleString('pt-AO') || '0'}</p>
              <p className="text-sm text-primary-200">Em Andamento</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{data?.resumoGeral.processosEmAndamento.toLocaleString('pt-AO') || '0'}</p>
              <p className="text-sm text-primary-200">Processos Activos</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">{data?.resumoGeral.totalSentencas.toLocaleString('pt-AO') || '0'}</p>
              <p className="text-sm text-primary-200">Sentenças</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas detalhadas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Indicadores Principais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Acesso Rápido e Actividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

      <div className="mt-8">
      {/* Card motivacional com ilustração */}
        <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl p-8 text-white relative overflow-hidden group hover:shadow-xl transition-all duration-300">
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
                <p className="text-primary-100 mb-6">
                  O Sistema Penal de Angola trabalha para garantir uma justiça célere, 
                  transparente e acessível a todos os cidadãos.
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="text-center group/stat">
                    <p className="text-3xl font-bold group-hover/stat:scale-110 transition-transform">98%</p>
                    <p className="text-xs text-primary-200">Satisfação</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center group/stat">
                    <p className="text-3xl font-bold group-hover/stat:scale-110 transition-transform">24h</p>
                    <p className="text-xs text-primary-200">Resposta média</p>
                  </div>
                  <div className="w-px h-10 bg-white/20" />
                  <div className="text-center group/stat">
                    <p className="text-3xl font-bold group-hover/stat:scale-110 transition-transform">18</p>
                    <p className="text-xs text-primary-200">Províncias</p>
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
