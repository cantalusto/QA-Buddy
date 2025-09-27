# 🤖 QA Buddy - Gerador de Testes Inteligente com IA

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)

##  

Uma aplicação web full-stack inovadora que utiliza a API do Google Gemini para gerar automaticamente casos de teste (Unitários, Integração e End-to-End) a partir de descrições de funcionalidades em linguagem natural. Desenvolvida para demonstrar a integração de modelos de linguagem avançados em arquiteturas modernas.

## 🎯 Objetivo do Projeto

Criar uma ferramenta inteligente que acelere o processo de criação de testes para:

- **🚀 Desenvolvedores:** Gerar testes rapidamente durante o desenvolvimento
- **🧪 QAs e Testers:** Criar suítes de teste completas e estruturadas
- **🎓 Estudantes:** Aprender padrões e boas práticas de teste
- **🏢 Equipes Ágeis:** Otimizar processos de qualidade contínua

## ✨ Funcionalidades Principais

### 🤖 **Geração Inteligente com IA**
- **Descrição Natural:** Descreva funcionalidades em linguagem humana
- **Contexto Específico:** Especifique linguagens e frameworks (JavaScript, Python, Jest, etc.)
- **Respostas Estruturadas:** Saída organizada em JSON para fácil manipulação

### 📋 **Múltiplos Tipos de Teste**
- **🧩 Testes Unitários:** Validação de componentes individuais
- **🔗 Testes de Integração:** Verificação de interfaces entre módulos
- **🌐 Testes End-to-End (E2E):** Fluxos completos de usuário
- **🎯 Cenários Realistas:** Casos de uso baseados em situações reais

### 💻 **Interface Moderna e Intuitiva**
- **Design Responsivo:** Experiência perfeita em desktop e mobile
- **Abas Organizadas:** Navegação clara entre tipos de teste
- **Funcionalidades de Cópia:** Exportação fácil para projetos
- **Histórico de Gerações:** Acompanhamento das solicitações

### 🔒 **Arquitetura Segura e Escalável**
- **Proxy Seguro:** Backend protegendo chaves de API
- **Centralização de Lógica:** Business logic no servidor
- **Comunicação REST:** API bem definida entre frontend e backend

## 🛠️ Stack Tecnológica

### **Frontend Avançado**
- **Framework:** React 18+ com Hooks
- **Build Tool:** Vite para desenvolvimento rápido
- **Estilização:** Tailwind CSS para design moderno
- **Ícones:** Lucide React para interface consistente

### **Backend Robusto**
- **Ambiente:** Node.js com Express.js
- **Segurança:** CORS configurado e dotenv para variáveis
- **API:** RESTful endpoints para comunicação

### **Inteligência Artificial**
- **Modelo:** Google Gemini API
- **Prompts Otimizados:** Templates para geração de testes
- **Processamento:** Análise contextual de requisitos

## 🚀 Implementação Rápida

### ⚡ **Pré-requisitos**
- Node.js (versão 18 ou superior)
- npm ou yarn
- Chave da API Google Gemini

### 🛠️ **Configuração em 5 Passos**

1. **Clone o Repositório:**
```bash
git clone https://github.com/cantalusto/QA-Buddy.git
cd QA-Buddy
```

2. **Instalação de Dependências:**
```bash
npm install
```

3. **Configuração de Ambiente:**
```bash
# Crie arquivo .env na raiz
echo "VITE_GEMINI_API_KEY=SUA_CHAVE_API_AQUI" > .env
```

4. **Execução dos Serviços:**
```bash
npm run dev
```

5. **Acesso à Aplicação:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### 🔑 **Obtenção da Chave API**
1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crie uma nova chave API
3. Adicione ao arquivo `.env`

## 📊 Fluxo de Utilização

### 1. **Descrição da Funcionalidade**
```
"Sistema de login com validação de email e senha, incluindo recuperação de senha"
```

### 2. **Especificação do Contexto**
- Linguagem: `JavaScript`
- Framework: `Jest`
- Tipo: `Unitário, Integração, E2E`

### 3. **Geração Inteligente**
A IA analisa o contexto e gera:
- ✅ Casos de teste estruturados
- 🔍 Cenários de sucesso e erro
- 📝 Código pronto para implementar

### 4. **Exportação e Uso**
- 📋 Cópia para clipboard
- 💾 Download em formato JSON
- 🔗 Integração com projetos existentes

## 🏗️ Arquitetura do Sistema

```
QA-Buddy/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Utilitários
├── server/                 # Backend Node.js
│   ├── routes/            # Endpoints da API
│   ├── controllers/        # Lógica de negócio
│   └── middleware/         # Interceptores
├── package.json           # Dependências e scripts
└── .env.example          # Template de variáveis
```

## 👨‍💻 Autor

**Lucas Cantarelli Lustosa**

[![GitHub](https://img.shields.io/badge/GitHub-QA_Buddy-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/cantalusto/QA-Buddy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Lucas_Cantarelli-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lucas-cantarelli-lustosa-aab5492ba/)

---

Feito com ❤️ e inteligência artificial para melhorar a qualidade de software.