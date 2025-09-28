import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Função auxiliar para extrair o primeiro objeto JSON completo de uma string.
 * Ela lida com casos onde a IA adiciona texto antes ou depois do JSON.
 * @param {string} str - A string que pode conter o JSON.
 * @returns {string|null} - A string JSON extraída ou null se não for encontrada.
 */
function extractJsonFromString(str) {
  const startIndex = str.indexOf('{');
  if (startIndex === -1) {
    return null; // Não encontrou o início de um JSON
  }

  let bracketCount = 0;
  for (let i = startIndex; i < str.length; i++) {
    if (str[i] === '{') {
      bracketCount++;
    } else if (str[i] === '}') {
      bracketCount--;
    }

    if (bracketCount === 0) {
      // Encontrou o JSON completo
      return str.substring(startIndex, i + 1);
    }
  }

  return null; // JSON incompleto na string
}


// A função principal que a Vercel vai executar
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "A chave da API não foi configurada no ambiente Vercel." });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

  const { featureDescription, language } = req.body;

  if (!featureDescription) {
    return res.status(400).json({ error: 'A descrição da funcionalidade é obrigatória.' });
  }

  const languageContext = language ? `Contexto da Linguagem/Framework: "${language}". Adapte os exemplos e a sintaxe para este ecossistema.` : '';

  const prompt = `
    Aja como um Engenheiro de QA Sênior.
    Especificação: """${featureDescription}"""
    ${languageContext}
    REQUISITOS DE SAÍDA:
    - Para cada teste, forneça: id, title, steps, e expectedResult.
    - CRÍTICO: Sua resposta DEVE ser APENAS o objeto JSON, sem nenhum texto introdutório, sem explicações e sem formatação de markdown como \`\`\`json.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // **AQUI ESTÁ A CORREÇÃO**
    // Usamos nossa nova função para extrair apenas o JSON da resposta.
    const cleanJsonText = extractJsonFromString(text);

    if (!cleanJsonText) {
      console.error("Resposta da IA não continha um JSON extraível:", text);
      throw new Error("Não foi possível extrair um JSON válido da resposta da IA.");
    }

    const parsedJson = JSON.parse(cleanJsonText);
    
    return res.status(200).json(parsedJson);

  } catch (error) {
    // Este log agora será mais útil na Vercel
    console.error('Erro na Serverless Function:', error);
    return res.status(500).json({ error: error.message || 'Falha ao se comunicar com a API do Gemini.' });
  }
}
