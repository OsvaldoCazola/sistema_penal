'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
  CommandLineIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

function AngolaAccent() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 flex">
      <div className="flex-1 bg-red-600" />
      <div className="flex-1 bg-black" />
      <div className="flex-1 bg-yellow-500" />
    </div>
  );
}

function AngolaEmblem() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-1 h-4 rounded-full bg-red-600" />
      <div className="w-1 h-4 rounded-full bg-black" />
      <div className="w-1 h-4 rounded-full bg-yellow-500" />
    </div>
  );
}

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const profileRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-AO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-AO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <header className="fixed top-0 right-0 left-72 z-30 h-18 bg-white border-b border-gray-100/80 shadow-sm shadow-gray-100/50">
      <AngolaAccent />
      <div className="flex items-center justify-between h-full px-6">
        {/* Lado esquerdo - Data e Saudação */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:block">
            <AngolaEmblem />
          </div>
          <div>
            <p className="text-xs text-gray-400 capitalize tracking-wide">{formatDate(currentTime)}</p>
            <h1 className="text-base font-medium text-gray-800">
              Olá, <span className="font-semibold text-gray-900">{user?.nome.split(' ')[0]}</span>
            </h1>
          </div>
        </div>

        {/* Centro - Busca Profissional */}
        <div className="flex-1 max-w-lg mx-6">
          <div className={cn(
            "relative group transition-all duration-200",
            searchFocused && "scale-[1.02]"
          )}>
            <div className={cn(
              "absolute inset-0 rounded-xl transition-all duration-200",
              searchFocused 
                ? "bg-white shadow-lg shadow-gray-200/60 ring-1 ring-gray-200" 
                : "bg-gray-50/80"
            )} />
            <MagnifyingGlassIcon className={cn(
              "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors z-10",
              searchFocused ? "text-primary-500" : "text-gray-400"
            )} />
            <input
              type="text"
              placeholder="Pesquisar processos, legislação..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="relative w-full pl-10 pr-20 py-2.5 bg-transparent rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none z-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 rounded border border-gray-200">
                <CommandLineIcon className="h-2.5 w-2.5" />
                <span>K</span>
              </kbd>
            </div>
          </div>
        </div>

        {/* Lado direito - Ações */}
        <div className="flex items-center gap-1">
          {/* Hora */}
          <div className="hidden md:flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg mr-2">
            {formatTime(currentTime)}
          </div>

          {/* Ajuda */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-150"
            aria-label="Ajuda"
            title="Centro de Ajuda"
          >
            <QuestionMarkCircleIcon className="h-5 w-5" />
          </button>

          {/* Separador */}
          <div className="w-px h-6 bg-gray-100 mx-2" />

          {/* Perfil */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={cn(
                'flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-all duration-150',
                isProfileOpen ? 'bg-gray-50' : 'hover:bg-gray-50'
              )}
            >
              <div className="relative">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                  <span className="text-sm font-semibold text-white">
                    {user?.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {user?.nome.split(' ').slice(0, 2).join(' ')}
                </p>
                <p className="text-[11px] text-gray-400 capitalize leading-tight">
                  {user?.role.toLowerCase().replace('_', ' ')}
                </p>
              </div>
              <ChevronDownIcon className={cn(
                'h-3.5 w-3.5 text-gray-400 transition-transform duration-200',
                isProfileOpen && 'rotate-180'
              )} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg shadow-gray-200/80 border border-gray-100 overflow-hidden animate-fade-in">
                <div className="relative px-4 py-3 bg-gradient-to-br from-primary-500 to-primary-600">
                  <div className="absolute top-0 left-0 right-0 h-0.5 flex">
                    <div className="flex-1 bg-red-500" />
                    <div className="flex-1 bg-black" />
                    <div className="flex-1 bg-yellow-400" />
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{user?.nome}</p>
                  <p className="text-xs text-primary-100 truncate">{user?.email}</p>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={logout}
                    className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Terminar Sessão</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
