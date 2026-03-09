'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  BookOpenIcon, 
  DocumentTextIcon,
  ScaleIcon,
  BuildingLibraryIcon,
  DocumentCheckIcon,
  BookmarkIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Badge, Spinner, Button } from '@/components/ui';
import api from '@/lib/api';
import { formatDate, getStatusColor, formatStatus } from '@/lib/utils';
import type { Lei, Page } from '@/types';

const categorias = [
  { id: '', label: 'Todos', icon: BookOpenIcon, cor: 'from-gray-600 to-gray-700' },
  { id: 'LEI', label: 'Leis', icon: ScaleIcon, cor: 'from-blue-600 to-blue-700' },
  { id: 'DECRETO', label: 'Decretos', icon: DocumentCheckIcon, cor: 'from-purple-600 to-purple-700' },
  { id: 'DECRETO_LEI', label: 'Decretos-Lei', icon: BookmarkIcon, cor: 'from-indigo-600 to-indigo-700' },
  { id: 'CONSTITUICAO', label: 'Constituição', icon: BuildingLibraryIcon, cor: 'from-red-700 to-yellow-600' },
  { id: 'CODIGO', label: 'Códigos', icon: DocumentTextIcon, cor: 'from-emerald-600 to-emerald-700' },
];

export default function LegislacaoPage() {
  const router = useRouter();
  const [data, setData] = useState<Page<Lei> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('busca', search);
      if (tipoFilter) params.append('tipo', tipoFilter);
      params.append('size', '20');
      
      const response = await api.get<Page<Lei>>(`/leis?${params}`);
      setData(response.data);
    } catch (error) {
      console.error('Erro ao carregar legislação:', error);
    } finally {
      setIsLoading(false);
    }
  }, [search, tipoFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    VIGENTE: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    REVOGADA: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    PARCIALMENTE_REVOGADA: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    SUSPENSA: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  };

  return (
    <div>
      <PageHeader
        title="Legislação"
        subtitle="Base de dados de leis e regulamentos penais de Angola"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Legislação' },
        ]}
      />

      {/* Botão Nova Lei */}
      <div className="mb-4 flex justify-end gap-3">
        <button
          onClick={() => router.push('/legislacao/artigos/revisao')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <DocumentCheckIcon className="h-5 w-5" />
          Revisão Artigos
        </button>
        <button
          onClick={() => router.push('/legislacao/revisao')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          <DocumentCheckIcon className="h-5 w-5" />
          Revisão Leis
        </button>
        <button
          onClick={() => router.push('/legislacao/artigos/novo')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          <DocumentPlusIcon className="h-5 w-5" />
          Novo Artigo
        </button>
        <button
          onClick={() => router.push('/legislacao/novo')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          <PlusIcon className="h-5 w-5" />
          Nova Lei
        </button>
      </div>

      {/* Header decorativo com padrão angolano */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-red-900 to-yellow-600 rounded-2xl p-6 mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          />
        </div>
        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
            <ScaleIcon className="h-8 w-8 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">Biblioteca Jurídica</h2>
            <p className="text-white/70">Acesso completo à legislação penal angolana</p>
          </div>
          {data && (
            <div className="ml-auto bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="text-yellow-300 font-bold text-2xl">{data.totalElements}</span>
              <span className="text-white/70 text-sm ml-2">documentos</span>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Pesquisa Melhorada */}
      <div className={`relative mb-6 transition-all duration-300 ${searchFocused ? 'transform scale-[1.01]' : ''}`}>
        <div className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 ${
          searchFocused ? 'border-primary-400 shadow-lg shadow-primary-100' : 'border-gray-100'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 p-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ${
                searchFocused ? 'text-primary-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Buscar por título, número ou conteúdo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-0 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <span className="text-gray-400 text-sm">✕</span>
                </button>
              )}
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categorias Interativas */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Categorias</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categorias.map((cat) => {
            const Icon = cat.icon;
            const isActive = tipoFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setTipoFilter(cat.id)}
                className={`relative group p-4 rounded-xl border-2 transition-all duration-300 ${
                  isActive 
                    ? 'border-transparent shadow-lg scale-105' 
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.cor} rounded-xl opacity-100`}></div>
                )}
                <div className="relative flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'
                  }`}>
                    <Icon className={`h-5 w-5 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <span className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-gray-700'
                  }`}>
                    {cat.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista de Legislação */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
            <Spinner size="lg" />
          </div>
          <p className="text-gray-500 animate-pulse">A carregar legislação...</p>
        </div>
      ) : data && data.content.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.content.map((lei, index) => {
            const status = statusStyles[lei.status] || statusStyles.REVOGADA;
            return (
              <div
                key={lei.id}
                onClick={() => router.push(`/legislacao/${lei.id}`)}
                className="group bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Ícone com gradiente */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-yellow-500/20 rounded-xl blur group-hover:blur-md transition-all"></div>
                    <div className="relative p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <BookOpenIcon className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-50 text-primary-700 text-xs font-semibold">
                        {lei.tipo}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        {formatStatus(lei.status)}
                      </span>
                    </div>
                    
                    {/* Título */}
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                      {lei.tipo} nº {lei.numero}/{lei.ano}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{lei.titulo}</p>
                    
                    {/* Ementa */}
                    {lei.ementa && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {lei.ementa}
                      </p>
                    )}
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      {lei.dataPublicacao && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          📅 {formatDate(lei.dataPublicacao)}
                        </span>
                      )}
                      <span className="text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        Ver detalhes →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-xl"></div>
            <div className="relative p-6 bg-white rounded-2xl shadow-sm">
              <DocumentTextIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma legislação encontrada</h3>
          <p className="text-gray-500 mb-6">Tente ajustar os filtros ou termos de pesquisa</p>
          <Button 
            variant="outline" 
            onClick={() => { setSearch(''); setTipoFilter(''); }}
            className="hover:bg-primary-50"
          >
            Limpar filtros
          </Button>
        </div>
      )}

      {/* Paginação */}
      {data && data.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <span className="px-3 py-2 text-sm text-gray-500">
              Página {data.number + 1} de {data.totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
