'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um email válido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnUrlParam = searchParams.get('returnUrl');
    if (returnUrlParam) {
      localStorage.setItem('returnUrl', returnUrlParam);
    }
  }, [searchParams]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Barra decorativa institucional */}
      <div className="flex h-1 rounded-sm overflow-hidden mb-6">
        <div className="flex-1 bg-primary-800"></div>
        <div className="flex-1 bg-primary-600"></div>
        <div className="flex-1 bg-primary-800"></div>
      </div>

      {/* Cabeçalho com emblema */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-900 rounded shadow-lg mb-3">
          <ScaleIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Acesso ao Sistema
        </h2>
        <p className="text-sm text-gray-500">
          Sistema Penal - República de Angola
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email institucional
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <EnvelopeIcon className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="exemplo@tribunal.gov.ao"
              className={`block w-full pl-9 pr-3 py-2.5 text-sm border rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 ${
                errors.email 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Campo Senha */}
        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <LockClosedIcon className="h-4 w-4" />
            </div>
            <input
              id="senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className={`block w-full pl-9 pr-10 py-2.5 text-sm border rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 ${
                errors.senha 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              {...register('senha')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.senha && (
            <p className="mt-1 text-xs text-red-600">{errors.senha.message}</p>
          )}
        </div>

        {/* Opções */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-600" 
            />
            <span className="text-gray-600">Manter-me ligado</span>
          </label>
          <Link 
            href="/esqueci-senha" 
            className="text-primary-700 hover:text-primary-800 font-medium hover:underline text-sm"
          >
            Esqueceu a senha?
          </Link>
        </div>

        {/* Botão de Login */}
        <Button 
          type="submit" 
          className="w-full py-2.5 font-semibold bg-primary-800 hover:bg-primary-900 text-white rounded shadow-sm" 
          size="lg" 
          isLoading={isLoading}
        >
          <span className="flex items-center justify-center gap-2">
            {!isLoading && <ShieldCheckIcon className="w-4 h-4" />}
            Entrar no Sistema
          </span>
        </Button>
      </form>

      {/* Separador */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-500">Ainda não tem conta?</span>
        </div>
      </div>

      {/* Link para registo */}
      <Link
        href="/register"
        className="block w-full py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded text-center text-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
      >
        Criar Nova Conta
      </Link>

      {/* Informação adicional */}
      <div className="mt-5 p-3 bg-gray-50 rounded border-l-4 border-primary-700">
        <p className="text-xs text-gray-600">
          <strong>Nota:</strong> Este sistema é de uso exclusivo para profissionais do sector judicial de Angola.
        </p>
      </div>

      {/* Badge de segurança */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <ShieldCheckIcon className="w-3.5 h-3.5" />
        <span>Conexão segura • Dados encriptados</span>
      </div>
    </div>
  );
}
