// server.js

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("A chave VITE_GEMINI_API_KEY não foi encontrada no arquivo .env");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

app.post('/api/generate', async (req, res) => {
  // ATUALIZADO: Receber a linguagem do corpo da requisição
  const { featureDescription, language } = req.body;

  if (!featureDescription) {
    return res.status(400).json({ error: 'A descrição da funcionalidade é obrigatória.' });
  }

  // ATUALIZADO: Lógica para incluir a linguagem no prompt, se ela for fornecida
  let languageContext = '';
  if (language) {
    languageContext = `
      CONTEXTO ADICIONAL:
      A base de código utiliza a seguinte linguagem/framework: "${language}".
      Adapte os exemplos de teste, especialmente os unitários, para refletir as convenções,
      a sintaxe e as ferramentas comuns deste ecossistema.
    `;
  }

  // ATUALIZADO: Injetar o contexto da linguagem no prompt
  const prompt = `
    Aja como um Engenheiro de QA Sênior especialista em automação de testes.
    Sua tarefa é criar um conjunto abrangente de casos de teste com base na descrição de uma funcionalidade e no contexto fornecido.

    DESCRIÇÃO DA FUNCIONALIDADE:
    """
    ${featureDescription}
    """
    
    ${languageContext}

    REQUISITOS DE SAÍDA:
    1.  Gere casos de teste para três categorias: 'unit', 'integration', e 'e2e'.
    2.  A saída DEVE ser um objeto JSON válido, sem nenhum texto ou formatação fora do JSON.
    3.  Para cada caso de teste, forneça:
        - id: Um identificador único (ex: "UNIT-01").
        - title: Um título curto e descritivo para o teste.
        - steps: Uma string descrevendo os passos. Se for um teste unitário e o contexto da linguagem for fornecido, pode incluir um pequeno trecho de código ou pseudocódigo como exemplo.
        - expectedResult: Uma string descrevendo o resultado esperado.
    4.  Inclua testes de "caminho feliz" (happy path) e "caminho infeliz" (edge cases, entradas inválidas).

    EXEMPLO DO FORMATO JSON DE SAÍDA:
    {
      "unit": [
        { "id": "UNIT-01", "title": "Validação de e-mail com formato válido", "steps": "Chamar a função 'validateEmail' com o e-mail 'teste@exemplo.com'.", "expectedResult": "A função deve retornar 'true'." }
      ],
      "integration": [
        { "id": "INT-01", "title": "Login com credenciais válidas", "steps": "Enviar uma requisição POST para a API /login com um e-mail e senha corretos.", "expectedResult": "A API deve retornar um status 200 OK e um token de autenticação." }
      ],
      "e2e": [
        { "id": "E2E-01", "title": "Fluxo completo de login do usuário", "steps": "1. O usuário abre a página. 2. Preenche os campos. 3. Clica em 'Entrar'.", "expectedResult": "O usuário é redirecionado para o painel de controle." }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanJsonText = text.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(cleanJsonText));

  } catch (error) {
    console.error('Erro no servidor ao chamar a API do Gemini:', error);
    res.status(500).json({ error: 'Falha ao se comunicar com a API do Gemini.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
});