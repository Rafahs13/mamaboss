# MamaBoss - Aplicativo de Organização para Mães Empreendedoras

## 🎯 Sobre o Projeto

O **MamaBoss** é uma aplicação web desenvolvida especificamente para mães empreendedoras que buscam equilibrar vida pessoal, maternidade e trabalho. O aplicativo oferece ferramentas integradas de organização com uma interface acolhedora e feminina.

## ✨ Funcionalidades Implementadas

### 🔐 Sistema de Autenticação
- Login/Logout funcional
- Persistência de sessão
- Rotas protegidas
- Interface de login responsiva

### 📊 Dashboard Interativo
- **Métricas em tempo real**: Tarefas pendentes, metas ativas, eventos, saldo financeiro
- **Tarefas prioritárias**: Lista das tarefas mais importantes com funcionalidade de marcar como concluída
- **Metas em progresso**: Visualização de progresso com barras
- **Próximos eventos**: Lista de eventos organizados por data
- **Resumo financeiro**: Receitas, despesas e saldo mensal
- **Dica motivacional**: Mensagem inspiradora diária
- **Botões funcionais**: Navegação direta para criar novos itens

### ✅ Gerenciamento de Tarefas
- **CRUD completo**: Criar, visualizar, editar e excluir tarefas
- **Categorização**: Trabalho, Família, Pessoal
- **Prioridades**: Alta, Média, Baixa com cores semânticas
- **Filtros avançados**: Por categoria, prioridade e busca por texto
- **Data de vencimento**: Controle de prazos
- **Status**: Marcar como concluída/pendente
- **Persistência**: Dados salvos no localStorage

### 🎯 Gerenciamento de Metas
- **CRUD completo**: Criar, visualizar, editar e excluir metas
- **Categorização**: Trabalho, Família, Pessoal, Financeiro, Saúde
- **Status**: Ativa, Concluída, Pausada
- **Controle de progresso**: Slider interativo para atualizar progresso
- **Data limite**: Controle de prazos com formatação relativa
- **Filtros avançados**: Por categoria, status e busca por texto
- **Abas organizadas**: Ativas, Concluídas, Pausadas
- **Estatísticas**: Total, ativas, concluídas e progresso médio
- **Persistência**: Dados salvos no localStorage

### 🎨 Design e UX
- **Tema personalizado**: Cores rosa/roxo do MamaBoss
- **Layout responsivo**: Funciona em mobile, tablet e desktop
- **Componentes reutilizáveis**: StatCard, TaskItem, LoadingSpinner
- **Animações suaves**: Transições e hover effects
- **Ícones intuitivos**: Lucide React para melhor UX

## 🛠️ Tecnologias Utilizadas

- **React 18** com TypeScript
- **Chakra UI v2** para componentes
- **React Router** para navegação
- **Lucide React** para ícones
- **Context API** para gerenciamento de estado
- **LocalStorage** para persistência de dados

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd mamaboss-app

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start
```

### Acessar a aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔑 Credenciais de Demonstração

Para testar a aplicação, use as seguintes credenciais:

- **Email**: rafaela@mamaboss.com.br
- **Senha**: 123456

## 📱 Funcionalidades por Página

### Login (`/login`)
- Formulário de autenticação
- Validação de campos
- Credenciais de demonstração
- Redirecionamento automático

### Dashboard (`/dashboard`)
- Visão geral das métricas
- Tarefas prioritárias interativas
- Metas em progresso
- Status da assinatura
- Próximos eventos
- Resumo financeiro
- Botões de ação funcionais

### Tarefas (`/tasks`)
- Lista completa de tarefas
- Filtros por categoria e prioridade
- Busca por texto
- Modal para criar/editar tarefas
- Abas para pendentes/concluídas
- Estatísticas em tempo real

### Metas (`/goals`)
- Lista completa de metas com CRUD completo
- Filtros por categoria e status
- Busca por texto
- Modal para criar/editar metas
- Abas para ativas/concluídas/pausadas
- Controle de progresso com slider interativo
- Estatísticas em tempo real
- Data limite com formatação relativa

### Calendário (`/calendar`)
- Visualização mensal completa do calendário
- CRUD completo de eventos (criar, editar, excluir)
- Categorização por tipo: Família, Trabalho, Escola
- Filtros por tipo e busca por texto
- Navegação entre meses e seleção de datas
- Integração com dashboard (próximos eventos)
- Design responsivo e tema adaptativo
- Persistência local dos dados

### Finanças (`/finances`)
- Dashboard financeiro com estatísticas em tempo real
- CRUD completo de transações (receitas e despesas)
- Separação clara entre finanças pessoais e do negócio
- Categorização inteligente com ícones intuitivos
- Filtros por tipo, origem e busca por texto
- Estatísticas mensais automáticas
- Integração com dashboard (resumo financeiro)
- Design responsivo e tema adaptativo
- Persistência local dos dados

### Cursos (`/courses`)
- Catálogo de cursos com categorias
- Cursos gratuitos e premium
- Controle de progresso por curso
- Estatísticas de aprendizado
- Filtros por categoria e tipo
- Integração com dashboard (cursos concluídos)
- Design responsivo e tema adaptativo
- Persistência local dos dados

### Configurações (`/settings`)
- Configurações de aparência (tema, layout)
- Configurações de notificações
- Configurações de privacidade
- Informações do negócio
- Preferências gerais
- Interface organizada em abas
- Design responsivo e tema adaptativo
- Persistência local dos dados

### Assinatura (`/subscription`)
- Planos de assinatura (Gratuito, Pro, Business)
- Integração com Mercado Pago
- Múltiplos métodos de pagamento
- Gestão de assinatura ativa
- Histórico de transações
- Status da assinatura no dashboard
- Design responsivo e tema adaptativo
- Persistência local dos dados

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── common/
│   │   ├── Layout.tsx          # Layout principal com sidebar
│   │   └── LoadingSpinner.tsx  # Componente de loading
│   ├── dashboard/
│   │   ├── StatCard.tsx        # Card de estatísticas
│   │   ├── TaskItem.tsx        # Item de tarefa
│   │   └── GoalCard.tsx        # Card de meta
│   ├── calendar/
│   │   └── EventCard.tsx       # Card de evento
│   ├── finances/
│   │   └── FinanceCard.tsx     # Card de transação financeira
│   ├── courses/
│   │   └── CourseCard.tsx      # Card de curso
│   └── subscription/
│       └── SubscriptionStatus.tsx # Status da assinatura
├── contexts/
│   ├── AuthContext.tsx         # Contexto de autenticação
│   ├── TaskContext.tsx         # Contexto de tarefas
│   ├── GoalContext.tsx         # Contexto de metas
│   ├── EventContext.tsx        # Contexto de eventos
│   ├── FinanceContext.tsx      # Contexto de finanças
│   ├── CourseContext.tsx       # Contexto de cursos
│   ├── SettingsContext.tsx     # Contexto de configurações
│   └── SubscriptionContext.tsx # Contexto de assinatura
├── pages/
│   ├── Login.tsx               # Página de login
│   ├── Dashboard.tsx           # Dashboard principal
│   ├── Tasks.tsx               # Gerenciamento de tarefas
│   ├── Goals.tsx               # Gerenciamento de metas
│   ├── Calendar.tsx            # Calendário de eventos
│   ├── Finances.tsx            # Controle financeiro
│   ├── Courses.tsx             # Catálogo de cursos
│   ├── Settings.tsx            # Configurações do usuário
│   └── Subscription.tsx        # Gestão de assinatura
├── types/
│   └── index.ts                # Tipos TypeScript
├── utils/
│   ├── storage.ts              # Utilitários de localStorage
│   ├── formatters.ts           # Formatação de dados
│   └── mockData.ts             # Dados de demonstração
└── App.tsx                     # Componente principal
```

## 🎯 Funcionalidades Implementadas

- [x] Página de Metas com CRUD completo ✅
- [x] Calendário de eventos com CRUD completo ✅
- [x] Controle financeiro avançado ✅
- [x] Sistema de cursos com progresso ✅
- [x] Configurações do usuário ✅
- [x] Sistema de assinatura com Mercado Pago ✅

## 🚀 Próximas Funcionalidades

- [ ] Notificações push
- [ ] Backup na nuvem
- [ ] Integração com APIs externas
- [ ] Sistema de relatórios avançados
- [ ] App mobile

## 🤝 Contribuição

Este projeto está em desenvolvimento ativo. Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👩‍💼 Contato

- **Email**: rafaela@mamaboss.com.br
- **Website**: [www.mamaboss.com.br](http://www.mamaboss.com.br)
- **Instagram**: @mamaboss.oficial

---

**MamaBoss** - Organize sua vida com carinho! 💕
