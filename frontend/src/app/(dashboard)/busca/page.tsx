'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  ScaleIcon, 
  LightBulbIcon,
  ArrowPathIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Spinner, Badge, Select } from '@/components/ui';
import { buscaService, CATEGORIAS_JURIDICAS, type AnaliseCasoResponse, type BuscaResultado, CategoriaJuridica } from '@/services/ia.service';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type TabType = 'busca' | 'analise';

export default function BuscaJuridicaPage() {
  const [activeTab, setActiveTab] = useState<TabType>('busca');
  const router = useRouter();
  const { user } = useAuthStore();
  
  // Busca state
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaBusca, setCategoriaBusca] = useState<string>('');
  const [resultadosBusca, setResultadosBusca] = useState<BuscaResultado[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Análise state
  const [descricaoCaso, setDescricaoCaso] = useState('');
  const [categoriaAnalise, setCategoriaAnalise] = useState<string>('');
  const [tipoCrime, setTipoCrime] = useState('');
  const [resultadoAnalise, setResultadoAnalise] = useState<AnaliseCasoResponse | null>(null);
  const [isAnalisando, setIsAnalisando] = useState(false);

  // Verificar acesso - ADMIN não pode usar busca jurídica
  useEffect(() => {
    if (!user) return;
    
    if (user.role === Role.ADMIN) {
      toast.error('Administrador não pode acessar a busca jurídica.');
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleBusca = async () => {
    if (!termoBusca.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await buscaService.buscaSemantica({
        termo: termoBusca,
        categoria: categoriaBusca || undefined,
        limite: 20
      });
      setResultadosBusca(response.resultados);
      toast.success(`Encontrados ${response.total} resultados`);
    } catch (error) {
      toast.error('Erro ao realizar busca');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalise = async () => {
    if (!descricaoCaso.trim()) return;
    
    setIsAnalisando(true);
    try {
      const response = await buscaService.analisarCaso({
        descricao: descricaoCaso,
        categoria: categoriaAnalise || undefined,
        tipoCrime: tipoCrime || undefined,
        limite: 10
      });
      setResultadoAnalise(response);
      toast.success('Análise concluída');
    } catch (error: any) {
      const message = error.message || 'Erro ao analisar caso';
      toast.error(message);
      console.error(error);
    } finally {
      setIsAnalisando(false);
    }
  };

  const getRelevanciaColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Busca Jurídica e IA"
        subtitle="Utilize inteligência artificial para buscar leis e analisar casos jurídicos"
      />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('busca')}
            className={`${
              activeTab === 'busca'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Busca Semântica
          </button>
          <button
            onClick={() => setActiveTab('analise')}
            className={`${
              activeTab === 'analise'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <ScaleIcon className="h-5 w-5" />
            Análise de Casos
          </button>
        </nav>
      </div>

      {/* Busca Tab */}
      {activeTab === 'busca' && (
        <div className="space-y-6">
          {/* Search Form */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termo de Busca
                </label>
                <input
                  type="text"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  placeholder="Digite palavras-chave, artigos, ou conceitos jurídicos..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria (Opcional)
                </label>
                <select
                  value={categoriaBusca}
                  onChange={(e) => setCategoriaBusca(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas as categorias</option>
                  {CATEGORIAS_JURIDICAS.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleBusca}
                disabled={isSearching || !termoBusca.trim()}
                className="w-full"
              >
                {isSearching ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results */}
          {resultadosBusca.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Resultados da Busca
              </h3>
              {resultadosBusca.map((resultado) => (
                <Card key={resultado.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpenIcon className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium text-gray-900 truncate">
                          {resultado.titulo}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {resultado.resumo || 'Sem resumo disponível'}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="default">
                          {resultado.categoria}
                        </Badge>
                        {resultado.referenciaLegal && (
                          <span className="text-xs text-gray-500">
                            {resultado.referenciaLegal}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanciaColor(resultado.score)}`}>
                        {(resultado.score * 100).toFixed(0)}% relevância
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Análise Tab */}
      {activeTab === 'analise' && (
        <div className="space-y-6">
          {/* Analysis Form */}
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Caso
                </label>
                <textarea
                  value={descricaoCaso}
                  onChange={(e) => setDescricaoCaso(e.target.value)}
                  placeholder="Descreva os fatos do caso jurídico..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria de Direito
                  </label>
                  <select
                    value={categoriaAnalise}
                    onChange={(e) => setCategoriaAnalise(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione uma categoria</option>
                    {CATEGORIAS_JURIDICAS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Crime (Opcional)
                  </label>
                  <input
                    type="text"
                    value={tipoCrime}
                    onChange={(e) => setTipoCrime(e.target.value)}
                    placeholder="Ex: Furto, Roubo, Lesão corporal..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <Button
                onClick={handleAnalise}
                disabled={isAnalisando || !descricaoCaso.trim()}
                className="w-full"
              >
                {isAnalisando ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Analisando caso...
                  </>
                ) : (
                  <>
                    <ScaleIcon className="h-5 w-5 mr-2" />
                    Analisar Caso
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Analysis Result */}
          {resultadoAnalise && (
            <div className="space-y-6">
              {/* Classification */}
              <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <LightBulbIcon className="h-5 w-5 text-blue-600" />
                  Classificação do Caso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Tipo de Crime</span>
                    <p className="font-medium text-gray-900">{resultadoAnalise.tipoCrime || 'Não identificado'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Categoria</span>
                    <p className="font-medium text-gray-900">{resultadoAnalise.categoria}</p>
                  </div>
                </div>
              </Card>

              {/* Analysis Text */}
              {resultadoAnalise.analise && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Análise Jurídica
                  </h3>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{resultadoAnalise.analise}</p>
                  </div>
                </Card>
              )}

              {/* Applicable Laws */}
              {resultadoAnalise.leisAplicaveis && resultadoAnalise.leisAplicaveis.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Leis Aplicáveis
                  </h3>
                  {resultadoAnalise.leisAplicaveis.map((lei, index) => (
                    <Card key={lei.id || index} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium text-gray-900">
                              {lei.titulo}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            {lei.referenciaLegal}
                          </p>
                          {lei.explicacao && (
                            <p className="text-sm text-gray-700 mb-2">
                              {lei.explicacao}
                            </p>
                          )}
                          {lei.jurisprudencia && (
                            <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                              <strong>Jurisprudência:</strong> {lei.jurisprudencia}
                            </div>
                          )}
                        </div>
                        <Badge className={getRelevanciaColor(lei.relevancia)}>
                          {(lei.relevancia * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {resultadoAnalise.recomendacoes && resultadoAnalise.recomendacoes.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <LightBulbIcon className="h-5 w-5 text-yellow-600" />
                    Recomendações
                  </h3>
                  <ul className="space-y-2">
                    {resultadoAnalise.recomendacoes.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
