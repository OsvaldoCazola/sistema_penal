'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ScaleIcon, ArrowLeftIcon, ShieldCheckIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const beneficios = [
  {
    icon: DocumentTextIcon,
    titulo: 'Gestão de Processos',
    descricao: 'Acompanhe o andamento de processos com linha do tempo visual',
  },
  {
    icon: ShieldCheckIcon,
    titulo: 'Dados Seguros',
    descricao: 'Informações protegidas com criptografia de ponta',
  },
  {
    icon: UserGroupIcon,
    titulo: 'Colaboração',
    descricao: 'Trabalhe em equipa com outros profissionais do Direito',
  },
];

export function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // Só redireciona se estiver autenticado E não estiver a carregar
    // Verifica também se há token válido no localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!isLoading && isAuthenticated && token) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="min-h-screen flex">
      <Toaster position="top-right" />
      
      {/* Painel esquerdo - Informativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Padrão decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 border border-white/30 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/20 rounded-full" />
        </div>

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12">
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar ao início</span>
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
              <ScaleIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Sistema Penal</h1>
              <p className="text-primary-200 text-sm">República de Angola</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Justiça Digital ao<br />Alcance de Todos
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed mb-12">
            Plataforma moderna para gestão de processos judiciais, 
            desenvolvida para profissionais do Direito em Angola.
          </p>

          <div className="space-y-6">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <beneficio.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{beneficio.titulo}</h3>
                  <p className="text-primary-200 text-sm">{beneficio.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-primary-200 text-sm">
            © {new Date().getFullYear()} Ministério da Justiça e dos Direitos Humanos
          </p>
        </div>
      </div>

      {/* Painel direito - Formulário */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header mobile */}
        <div className="lg:hidden bg-primary-800 p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Sistema Penal</h1>
                <p className="text-primary-200 text-xs">República de Angola</p>
              </div>
            </Link>
            <Link href="/" className="text-white/80 hover:text-white text-sm">
              ← Início
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              {children}
            </div>

            {/* Ajuda */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Precisa de ajuda?{' '}
                <a href="mailto:suporte@sistemapenal.gov.ao" className="text-primary-600 hover:underline">
                  Contacte o suporte
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer mobile */}
        <div className="lg:hidden text-center py-4 px-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Sistema Penal. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
