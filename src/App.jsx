// src/App.jsx

import { useState } from 'react';
import { Bot, Clipboard, Check } from 'lucide-react';

// Componente para o ícone de carregamento (Spinner)
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
  </div>
);

// Hook customizado para copiar para a área de transferência
const useCopyToClipboard = (timeout = 2000) => {
    const [copied, setCopied] = useState(false);
  
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      });
    };
  
    return [copied, copyToClipboard];
  };

// Componente para um Card de Caso de Teste
const TestCaseCard = ({ testCase }) => {
    const [copied, copyToClipboard] = useCopyToClipboard();
    const fullText = `ID: ${testCase.id}\nTítulo: ${testCase.title}\nPassos: ${testCase.steps}\nResultado Esperado: ${testCase.expectedResult}`;

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 relative group">
             <button onClick={() => copyToClipboard(fullText)} className="absolute top-3 right-3 p-1.5 bg-gray-700 rounded-md text-gray-400 hover:bg-gray-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                {copied ? <Check size={16} /> : <Clipboard size={16} />}
            </button>
            <p className="font-mono text-xs text-cyan-400 mb-1">{testCase.id}</p>
            <h4 className="font-semibold text-gray-100 mb-2">{testCase.title}</h4>
            <div className="text-sm text-gray-300 space-y-2">
                <p><strong className="font-medium text-gray-400">Passos:</strong> {testCase.steps}</p>
                <p><strong className="font-medium text-gray-400">Resultado Esperado:</strong> {testCase.expectedResult}</p>
            </div>
        </div>
    );
};

function App() {
  const [featureDescription, setFeatureDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [testCases, setTestCases] = useState(null);
  const [activeTab, setActiveTab] = useState('unit');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateTests = async () => {
    if (!featureDescription.trim()) {
      setError("Por favor, descreva a funcionalidade.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTestCases(null);

    try {
      // --- MUDANÇA IMPORTANTE AQUI ---
      // A URL foi alterada para um caminho relativo, que funciona na Vercel
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featureDescription, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha na resposta do servidor.');
      }

      const parsedResult = await response.json();
      setTestCases(parsedResult);
      setActiveTab('unit');
      
    } catch (err) {
      console.error("Erro ao gerar casos de teste:", err);
      setError(`Não foi possível gerar os casos de teste. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const TABS = [
    { id: 'unit', label: 'Unitários' },
    { id: 'integration', label: 'Integração' },
    { id: 'e2e', label: 'End-to-End' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bot size={28} className="text-cyan-400" />
            <h1 className="text-3xl font-bold text-gray-100">QA Buddy</h1>
          </div>
          <p className="text-gray-400">Descreva uma funcionalidade e o contexto para gerar casos de teste estruturados.<br></br>A ia pode demorar um pouco para responder, dependendo da fila de requisições.  (max de 1min)
          </p>
        </div>

        <div className="flex flex-col gap-4">
            <div>
                <label htmlFor="feature" className="block text-sm font-medium text-cyan-400 mb-2">
                    Descrição da Funcionalidade
                </label>
                <textarea
                    id="feature"
                    rows="4"
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 transition-all placeholder-gray-500"
                    placeholder="Ex: Uma tela de login com email, senha e botão 'Entrar'."
                    value={featureDescription}
                    onChange={(e) => setFeatureDescription(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="language" className="block text-sm font-medium text-cyan-400 mb-2">
                    Linguagem / Framework
                </label>
                <input
                    id="language"
                    type="text"
                    className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 transition-all placeholder-gray-500"
                    placeholder="Ex: JavaScript, Jest, Python, PyTest, C#"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                />
            </div>
        </div>

        <button
          onClick={generateTests}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analisando...' : 'Gerar Casos de Teste'}
        </button>
        
        {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center"><p>{error}</p></div>}
        
        {isLoading && <LoadingSpinner />}
        
        {testCases && (
          <div className="mt-6 border border-gray-700 rounded-lg">
            <div className="flex border-b border-gray-700">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-6 font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-gray-900/50 text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  {tab.label} ({testCases[tab.id]?.length || 0})
                </button>
              ))}
            </div>
            <div className="p-6 bg-gray-900/30">
              <div className="space-y-4">
                {testCases[activeTab] && testCases[activeTab].length > 0 ? (
                  testCases[activeTab].map((tc) => <TestCaseCard key={tc.id} testCase={tc} />)
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum caso de teste encontrado para esta categoria.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="text-center mt-8 text-gray-500 text-sm"><p>Arquitetura com Frontend (React + Vite) + Backend (Express.js).</p></footer>
    </div>
  );
}

export default App;