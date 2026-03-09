'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ScaleIcon,
  DocumentTextIcon,
  MapIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  BellAlertIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  PlayCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { JusticeIllustration, AngolaMap } from '@/components/illustrations';
import { useAuthStore } from '@/store/auth.store';
import { noticiaService, Atualizacao } from '@/services/noticia.service';
import AtualizacaoCard from '@/components/noticias/AtualizacaoCard';

const modulos = [
  {
    icon: DocumentTextIcon,
    titulo: 'Gestão de Processos',
    descricao: 'Acompanhe processos judiciais com linha do tempo visual, desde a denúncia até o trânsito em julgado.',
  },
  {
    icon: ScaleIcon,
    titulo: 'Simulador de Penas',
    descricao: 'Calcule estimativas de pena considerando agravantes, atenuantes e circunstâncias do caso.',
  },
  {
    icon: MapIcon,
    titulo: 'Mapa Criminal',
    descricao: 'Visualize estatísticas de ocorrências por província e município em mapa interactivo de Angola.',
  },
  {
    icon: ChartBarIcon,
    titulo: 'Indicadores Judiciais',
    descricao: 'Relatórios automáticos com tempo médio de julgamento, taxa de reincidência e mais.',
  },
  {
    icon: BuildingLibraryIcon,
    titulo: 'Base Legislativa',
    descricao: 'Consulte leis, decretos e artigos com comparador de versões para alterações legislativas.',
  },
  {
    icon: AcademicCapIcon,
    titulo: 'Modo de Estudo',
    descricao: 'Estudantes podem simular julgamentos e praticar aplicação das leis em casos reais.',
  },
  {
    icon: ChatBubbleLeftRightIcon,
    titulo: 'Assistente Jurídico',
    descricao: 'Tire dúvidas sobre legislação penal angolana com assistente inteligente.',
  },
  {
    icon: ShieldCheckIcon,
    titulo: 'Transparência IA',
    descricao: 'Todas as sugestões do sistema incluem explicação clara do raciocínio utilizado.',
  },
];

const estatisticas = [
  { numero: '18', label: 'Províncias Cobertas', icon: MapIcon },
  { numero: '100+', label: 'Leis Registadas', icon: DocumentTextIcon },
  { numero: '24/7', label: 'Disponibilidade', icon: ClockIcon },
  { numero: '100%', label: 'Seguro e Privado', icon: ShieldCheckIcon },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { clearAuth, isAuthenticated, accessToken } = useAuthStore();
  
  // Verificar token - só no cliente
  const [hasToken, setHasToken] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('accessToken');
    setHasToken(!!token);
    
    if (!token && isAuthenticated) {
      clearAuth();
    }
  }, [isAuthenticated, clearAuth]);
  const [atualizacoes, setAtualizacoes] = useState<Atualizacao[]>([]);
  const [loadingAtualizacoes, setLoadingAtualizacoes] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const carregarAtualizacoes = async () => {
      try {
        const result = await noticiaService.listarAtualizacoes(0, 3);
        setAtualizacoes(result.content);
      } catch (error) {
        console.error('Erro ao carregar atualizações:', error);
      } finally {
        setLoadingAtualizacoes(false);
      }
    };
    carregarAtualizacoes();
  }, []);

  // Função para ir para login, limpando qualquer sessão anterior
  const goToLogin = () => {
    clearAuth();
    router.push('/login');
  };

  // Função para ir para registo
  const goToRegister = () => {
    clearAuth();
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navegação */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-lg ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                  Sistema Penal
                </h1>
                <p className={`text-xs ${scrolled ? 'text-gray-500' : 'text-gray-200'}`}>
                  República de Angola
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#modulos"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-primary-600' : 'text-gray-100 hover:text-white'
                }`}
              >
                Funcionalidades
              </a>
              <a
                href="#noticias"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-primary-600' : 'text-gray-100 hover:text-white'
                }`}
              >
                Notícias
              </a>
              <a
                href="#sobre"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-primary-600' : 'text-gray-100 hover:text-white'
                }`}
              >
                Sobre
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {mounted && hasToken ? (
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-primary-600/30"
                >
                  Ir para Dashboard
                </Link>
              ) : (
                <>
                  <button
                    onClick={goToLogin}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      scrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    onClick={goToRegister}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-primary-600/30"
                  >
                    Criar Conta
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 overflow-hidden">
        {/* Padrão decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 border border-white/30 rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 border border-white/20 rounded-full" />
          <div className="absolute top-40 right-40 w-32 h-32 border border-white/20 rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/90 text-sm mb-6">
                <BellAlertIcon className="w-4 h-4" />
                <span>Sistema oficial de gestão judicial</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Justiça Digital para{' '}
                <span className="text-primary-300">Angola</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
                Plataforma integrada para gestão de processos penais, consulta de legislação 
                e análise de dados judiciais. Desenvolvido para magistrados, advogados, 
                procuradores e estudantes de Direito.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={goToRegister}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-xl"
                >
                  Começar Agora
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
                <a
                  href="#modulos"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Conhecer Funcionalidades
                </a>
              </div>

              <div className="flex items-center gap-6 text-gray-200">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Gratuito para órgãos públicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Dados seguros</span>
                </div>
              </div>
            </div>

            {/* Ilustração/Card demonstrativo */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Ilustração principal */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <JusticeIllustration variant="hero" className="w-full max-w-md mx-auto opacity-90" />
                </div>
                
                {/* Card flutuante - Processo */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-2xl border border-gray-100 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                      <CheckCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">1.234</p>
                      <p className="text-sm text-gray-500">Processos resolvidos</p>
                    </div>
                  </div>
                </div>

                {/* Card flutuante - Tempo */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Tempo médio</p>
                      <p className="text-xs text-gray-500">45 dias por processo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {estatisticas.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.numero}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Módulos/Funcionalidades */}
      <section id="modulos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades do Sistema
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ferramentas desenvolvidas para facilitar o trabalho de profissionais do Direito, 
              com interface intuitiva e adaptada ao contexto jurídico angolano.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modulos.map((modulo, index) => (
              <div
                key={index}
                className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-primary-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 group-hover:bg-primary-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <modulo.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{modulo.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{modulo.descricao}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={goToRegister}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-600/30"
            >
              Aceder ao Sistema
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Notícias e Atualizações */}
      <section id="noticias" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Actualizações Legislativas e Jurisprudenciais
              </h2>
              <p className="text-lg text-gray-600">
                Mantenha-se informado sobre novas leis, alterações de artigos e jurisprudência relevante.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loadingAtualizacoes ? (
              <div className="col-span-3 flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : atualizacoes.length > 0 ? (
              atualizacoes.map((atualizacao) => (
                <AtualizacaoCard key={atualizacao.id} atualizacao={atualizacao} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                <p>Nenhuma atualização disponível no momento.</p>
              </div>
            )}
          </div>
          
          {/* Link para todas as atualizações */}
          {atualizacoes.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href="/jurisprudencia"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Ver todas as actualizações
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Mapa de Angola - Cobertura Nacional */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 text-sm font-medium mb-6">
                <MapIcon className="w-4 h-4" />
                <span>Cobertura Nacional</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Presente em Todas as 18 Províncias de Angola
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                O Sistema Penal abrange todo o território nacional, permitindo gestão 
                unificada de processos judiciais desde Cabinda ao Cunene.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { provincia: 'Luanda', processos: '45%', icon: '🏛️' },
                  { provincia: 'Benguela', processos: '12%', icon: '⚖️' },
                  { provincia: 'Huambo', processos: '8%', icon: '📋' },
                  { provincia: 'Huíla', processos: '7%', icon: '🔍' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 hover:bg-primary-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{item.provincia}</p>
                        <p className="text-sm text-gray-500">{item.processos} dos processos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre/Para quem é */}
      <section id="sobre" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Desenvolvido para Profissionais do Direito em Angola
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                O Sistema Penal foi concebido com foco na simplicidade e eficiência, 
                permitindo que magistrados, advogados e estudantes concentrem-se no que 
                realmente importa: fazer justiça.
              </p>

              <div className="space-y-4">
                {[
                  { icon: UserGroupIcon, text: 'Magistrados e Juízes - Gestão completa de processos e decisões' },
                  { icon: BuildingLibraryIcon, text: 'Procuradores - Acompanhamento de denúncias e acusações' },
                  { icon: ScaleIcon, text: 'Advogados - Consulta de jurisprudência e legislação' },
                  { icon: AcademicCapIcon, text: 'Estudantes - Modo de estudo com casos práticos' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <p className="text-gray-700 pt-2">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Pronto para começar?
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie a sua conta gratuitamente e tenha acesso a todas as funcionalidades do sistema.
                </p>
                <button
                  onClick={goToRegister}
                  className="block w-full py-4 bg-primary-600 hover:bg-primary-700 text-white text-center font-semibold rounded-xl transition-colors"
                >
                  Criar Conta Gratuita
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Já tem conta?{' '}
                  <button onClick={goToLogin} className="text-primary-600 hover:underline font-medium">
                    Entrar
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <ScaleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Sistema Penal</h4>
                  <p className="text-xs">República de Angola</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-md">
                Plataforma oficial para gestão de processos judiciais penais, desenvolvida 
                para modernizar e facilitar o acesso à justiça em Angola.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-4">Acesso Rápido</h5>
              <ul className="space-y-2 text-sm">
                <li><button onClick={goToLogin} className="hover:text-white transition-colors">Entrar no Sistema</button></li>
                <li><button onClick={goToRegister} className="hover:text-white transition-colors">Criar Conta</button></li>
                <li><a href="#modulos" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#noticias" className="hover:text-white transition-colors">Notícias</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-4">Contacto</h5>
              <ul className="space-y-2 text-sm">
                <li>Ministério da Justiça</li>
                <li>Luanda, Angola</li>
                <li>suporte@sistemapenal.gov.ao</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} Sistema Penal. Todos os direitos reservados.
            </p>
            <p className="text-sm">
              Desenvolvido para o Ministério da Justiça e dos Direitos Humanos
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
