// api/generate.js

import { GoogleGenerativeAI } from '@google/generative-ai';

// A função exportada é o que a Vercel vai executar
export default async function handler(req, res) {
  // Permitir requisições de qualquer origem (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // O Vercel lida com requisições OPTIONS automaticamente para CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Só permitir o método POST
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
    - CRÍTICO: Sua resposta DEVE ser APENAS o objeto JSON, sem nenhum texto ou formatação.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("A resposta da IA não continha um formato JSON reconhecível.");
    }
    const cleanJsonText = jsonMatch[0];
    const parsedJson = JSON.parse(cleanJsonText);
    
    // Envia a resposta de sucesso
    return res.status(200).json(parsedJson);

  } catch (error) {
    console.error('Erro na Serverless Function:', error);
    return res.status(500).json({ error: error.message || 'Falha ao se comunicar com a API do Gemini.' });
  }
}