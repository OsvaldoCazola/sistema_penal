'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '@/store/auth.store';
import { Spinner } from '@/components/ui/Spinner';
import { ScaleIcon } from '@heroicons/react/24/outline';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, setLoading } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [router, setLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mb-6">
          <ScaleIcon className="h-8 w-8 text-white" />
        </div>
        <Spinner size="lg" className="text-white" />
        <p className="mt-4 text-primary-200 text-sm">A carregar o sistema...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/40 to-white">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Sidebar />
      <Header />
      <main className="ml-72 pt-20 min-h-screen transition-all duration-300">
        <div className="p-8">
          {children}
        </div>
      </main>

      <footer className="ml-72 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex h-1">
          <div className="flex-1 bg-gradient-to-r from-red-600 to-red-500"></div>
          <div className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800"></div>
          <div className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-400"></div>
        </div>
        <div className="py-4 px-8">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>© {new Date().getFullYear()} Sistema Penal - República de Angola</p>
            <p>Ministério da Justiça e dos Direitos Humanos</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
