'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ScaleIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentPlusIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';

const navigation = [
  // Dashboard e Estatísticas
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR, Role.FUNCIONARIO],
    description: 'Estatísticas e overview'
  },
  // Análise de Casos (IA)
  { 
    name: 'Análise de Casos IA', 
    href: '/busca', 
    icon: MagnifyingGlassIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO, Role.FUNCIONARIO, Role.ESTUDANTE, Role.PESQUISADOR, Role.CIDADAO],
    description: 'Busca semântica e análise'
  },
  // Gestão de Casos
  { 
    name: 'Gestão de Casos', 
    href: '/processos', 
    icon: ScaleIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO, Role.FUNCIONARIO],
    description: 'Processos judiciais'
  },
  // Jurisprudência
  { 
    name: 'Jurisprudência', 
    href: '/jurisprudencia', 
    icon: ScaleIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO, Role.ESTUDANTE, Role.PESQUISADOR, Role.FUNCIONARIO, Role.CIDADAO],
    description: 'Base de decisões judiciais'
  },
  // Gestão de Leis
  { 
    name: 'Gestão de Leis', 
    href: '/legislacao', 
    icon: BookOpenIcon, 
    roles: [Role.ADMIN, Role.JUIZ, Role.PROCURADOR, Role.ADVOGADO, Role.ESTUDANTE, Role.PESQUISADOR, Role.CIDADAO, Role.FUNCIONARIO],
    description: 'Leis e artigos'
  },
  // Usuários e Segurança (apenas Admin)
  { 
    name: 'Usuários e Segurança', 
    href: '/usuarios', 
    icon: ScaleIcon, 
    roles: [Role.ADMIN],
    description: 'Gestão de utilizadores'
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Filtrar menus por role
  const filteredNavigation = navigation.filter((item) => {
    if (!user) return false;
    const userRole = user.role;
    // ADMIN vê tudo
    if (userRole === 'ADMIN') return true;
    // Outros roles: verificar se está na lista
    return item.roles.includes(userRole as Role);
  });

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300',
        'bg-white border-r border-gray-200',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Logo e Toggle */}
      <div className="flex h-20 items-center justify-between px-4 border-b border-gray-100">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <ScaleIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">Sistema Penal</span>
              <p className="text-xs text-primary-600">República de Angola</p>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <ScaleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors',
            isCollapsed && 'absolute -right-3 top-7 bg-white shadow-lg border border-gray-200'
          )}
          aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 overflow-y-auto py-6 scrollbar-thin">
        <ul className="space-y-1.5 px-3">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    isCollapsed && 'justify-center px-3'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-white' : 'text-primary-600')} />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{item.name}</span>
                      {!isActive && (
                        <span className="text-xs text-gray-400 truncate block">{item.description}</span>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer com info do usuário */}
      {user && (
        <div className={cn(
          'p-4 border-t border-gray-100',
          isCollapsed && 'flex justify-center'
        )}>
          <div className={cn(
            'flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors',
            isCollapsed && 'p-0'
          )}>
            <div className="h-10 w-10 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-white">
                {user.nome.charAt(0).toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.nome}</p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {user.role.toLowerCase().replace('_', ' ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decoração Angolana sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-black to-yellow-500 opacity-60" />
    </aside>
  );
}
