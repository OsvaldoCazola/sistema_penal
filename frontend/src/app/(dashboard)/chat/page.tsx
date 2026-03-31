'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  TrashIcon,
  SparklesIcon,
  BookOpenIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, Button, Spinner, Badge } from '@/components/ui';
import { chatService, ChatMessage } from '@/services/chat.service';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const EXEMPLOS_PERGUNTAS = [
  "Qual a pena para homicídio em Angola?",
  "O que diz o artigo sobre roubo?",
  "Quais são os crimes contra a honra?",
  "O que é o crime de peculato?",
  "Quais são as penas accessórias em Angola?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuthStore();

  // Verificar acesso - conforme tabela de permissões
  // JUIZ, PROCURADOR, ADVOGADO, ESTUDANTE podem acessar | ADMIN não pode (Chat é Assistente IA)
  useEffect(() => {
    if (!user) return;
    
    if (user.role === Role.ADMIN) {
      toast.error('Acesso restrito. Apenas profissionais jurídicos podem usar o assistente.');
      router.push('/dashboard');
    }
  }, [user, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensagem inicial
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Olá! Sou o Assistente Jurídico do Sistema Penal de Angola. Posso responder às suas perguntas sobre legislação angolana, como:\n\n• "Qual a pena para homicídio?"\n• "O que diz o artigo sobre roubo?"\n• "Quais são os crimes contra a honra?"\n\nPergunte-me o que deseja saber!',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        mensagem: userMessage.content,
        buscarContexto: contextEnabled,
      });

      if (response.sucesso && response.resposta) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.resposta,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        toast.error(response.mensagem || 'Erro ao processar mensagem');
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Desculpe, não consegui processar sua pergunta. Por favor, tente novamente.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error: any) {
      toast.error('Erro ao enviar mensagem');
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ocorreu um erro ao processar sua pergunta. Por favor, tente novamente mais tarde.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExemploClick = (pergunta: string) => {
    setInputMessage(pergunta);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Chat limpo! Em que posso ajudá-lo hoje?',
        timestamp: new Date(),
      },
    ]);
    toast.success('Chat limpo');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <PageHeader
        title="Assistente Jurídico IA"
        subtitle="Tire dúvidas sobre legislação angolana com inteligência artificial"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Assistente Jurídico' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Sidebar com exemplos */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-primary-600" />
              Exemplos de Perguntas
            </h3>
            <div className="space-y-2">
              {EXEMPLOS_PERGUNTAS.map((pergunta, index) => (
                <button
                  key={index}
                  onClick={() => handleExemploClick(pergunta)}
                  className="w-full text-left text-sm p-2 rounded-lg bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 transition-colors"
                >
                  {pergunta}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <InformationCircleIcon className="h-5 w-5 text-blue-600" />
              Como Usar
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Digite sua pergunta jurídica</li>
              <li>• Pressione Enter para enviar</li>
              <li>• Use Shift+Enter para nova linha</li>
              <li>• O assistente usa contexto da base de dados</li>
            </ul>
          </Card>

          {/* Toggle contexto */}
          <Card className="p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={contextEnabled}
                onChange={(e) => setContextEnabled(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                Buscar contexto na base de dados
              </span>
            </label>
          </Card>
        </div>

        {/* Área de Chat */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' && (
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-primary-200' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('pt-AO', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" />
                      <span className="text-sm text-gray-600">A processar...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearChat}
                  title="Limpar chat"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua pergunta jurídica..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    rows={1}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <PaperAirplaneIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by GPT-4 • Utilize para fins informativos
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
