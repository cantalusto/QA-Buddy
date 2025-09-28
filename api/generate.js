// api/generate.js

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
    return res.status(500).json({ error: "A chave da API não foi configurada." });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

  const { featureDescription, language } = req.body;
  if (!featureDescription) {
    return res.status(400).json({ error: 'A descrição é obrigatória.' });
  }

  const languageContext = language ? `Contexto da Linguagem/Framework: "${language}". Adapte a sintaxe para este ecossistema.` : '';

  const prompt = `
    Aja como um Engenheiro de QA Sênior.
    Sua tarefa é criar casos de teste com base na descrição de uma funcionalidade.

    DESCRIÇÃO: """${featureDescription}"""
    ${languageContext}

    REQUISITOS DE SAÍDA:
    1.  Crie casos de teste para TRÊS categorias: 'unit', 'integration', e 'e2e'.
    2.  Para cada teste, forneça: id, title, steps, e expectedResult.
    3.  A saída DEVE ser um objeto JSON válido, seguindo o exemplo abaixo.
    4.  NÃO inclua nenhum texto, explicação ou formatação markdown como \`\`\`json fora do objeto JSON.

    EXEMPLO DO FORMATO JSON DE SAÍDA:
    {
      "unit": [
        { "id": "UNIT-01", "title": "Exemplo de Título Unitário", "steps": "Passos do teste.", "expectedResult": "Resultado esperado." }
      ],
      "integration": [
        { "id": "INT-01", "title": "Exemplo de Título de Integração", "steps": "Passos do teste.", "expectedResult": "Resultado esperado." }
      ],
      "e2e": [
        { "id": "E2E-01", "title": "Exemplo de Título E2E", "steps": "Passos do teste.", "expectedResult": "Resultado esperado." }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanJsonText = extractJsonFromString(text);
    if (!cleanJsonText) {
      console.error("Resposta da IA não continha um JSON extraível:", text);
      throw new Error("Não foi possível extrair um JSON válido da resposta da IA.");
    }

    const parsedJson = JSON.parse(cleanJsonText);
    return res.status(200).json(parsedJson);

  } catch (error) {
    console.error('Erro na Serverless Function:', error);
    return res.status(500).json({ error: error.message || 'Falha ao se comunicar com a API.' });
  }
}