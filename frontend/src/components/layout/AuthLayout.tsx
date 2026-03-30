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
      
      {/* Painel esquerdo - Informativo com visual formal */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-900 to-primary-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Padrão formal sutil */}
        <div className="absolute inset-0 bg-pattern"></div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors mb-12">
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar ao início</span>
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
              <ScaleIcon className="w-7 h-7 text-primary-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Sistema Penal</h1>
              <p className="text-primary-300 text-sm">República de Angola</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-4">
            Plataforma Oficial de<br />Gestão Judicial
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed mb-12">
            Sistema integrado para gestão de processos judiciais, 
            desenvolvido para profissionais do Direito em Angola.
          </p>

          <div className="space-y-5">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center flex-shrink-0 border border-white/20">
                  <beneficio.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{beneficio.titulo}</h3>
                  <p className="text-primary-300 text-sm">{beneficio.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          {/* Barra tricolor oficial */}
          <div className="flex h-0.5 mb-4 rounded-full overflow-hidden">
            <div className="flex-1 bg-primary-800"></div>
            <div className="flex-1 bg-primary-700"></div>
            <div className="flex-1 bg-primary-600"></div>
          </div>
          <p className="text-primary-300 text-sm">
            © {new Date().getFullYear()} Ministério da Justiça e dos Direitos Humanos
          </p>
        </div>
      </div>

      {/* Painel direito - Formulário */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Pattern de fundo sutil */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239ca3af\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />
        
        {/* Header mobile */}
        <div className="lg:hidden bg-primary-900 p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-primary-900" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Sistema Penal</h1>
                <p className="text-primary-300 text-xs">República de Angola</p>
              </div>
            </Link>
            <Link href="/" className="text-primary-200 hover:text-white text-sm">
              ← Início
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100/50 p-8 ring-1 ring-gray-900/5">
              {children}
            </div>

            {/* Ajuda */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Precisa de ajuda?{' '}
                <a href="mailto:suporte@sistemapenal.gov.ao" className="text-primary-700 hover:underline font-medium">
                  Contacte o suporte
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer mobile */}
        <div className="lg:hidden text-center py-4 px-6 border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Sistema Penal. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
