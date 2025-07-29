# 💰 Finanças - Funcionalidades Implementadas

## 🎯 Visão Geral

O módulo de finanças do MamaBoss foi desenvolvido para ajudar mães empreendedoras a controlarem suas finanças pessoais e do negócio de forma organizada e eficiente, separando claramente os dois tipos de transações.

## ✨ Funcionalidades Principais

### 📊 Dashboard Financeiro
- **Estatísticas em tempo real**: Saldo total, receitas, despesas e lucro/prejuízo do negócio
- **Separação clara**: Finanças pessoais vs. negócio
- **Indicadores visuais**: Cores e ícones para facilitar identificação
- **Métricas mensais**: Foco no mês atual com cálculos automáticos

### 💳 Gerenciamento de Transações
- **CRUD completo**: Criar, visualizar, editar e excluir transações
- **Categorização inteligente**: Diferentes categorias para receitas e despesas
- **Separação automática**: Marcação para transações pessoais ou do negócio
- **Validação de dados**: Campos obrigatórios e formatação automática

### 🏷️ Categorias de Transações

#### Receitas
- 💼 **Salário**: Remuneração fixa
- 🎯 **Freelance**: Trabalhos pontuais
- 📈 **Investimentos**: Renda de aplicações
- 🛒 **Vendas**: Vendas de produtos/serviços
- 💝 **Presentes**: Dinheiro recebido como presente
- 📦 **Outros**: Outras receitas

#### Despesas
- 🍽️ **Alimentação**: Comida, restaurantes, mercado
- 🚗 **Transporte**: Combustível, transporte público, manutenção
- 🏠 **Moradia**: Aluguel, condomínio, manutenção
- ❤️ **Saúde**: Consultas, medicamentos, planos de saúde
- 📚 **Educação**: Cursos, material escolar, mensalidades
- 🎉 **Lazer**: Entretenimento, viagens, hobbies
- 🌐 **Serviços**: Internet, telefone, assinaturas
- ⚡ **Energia**: Contas de luz, gás, água
- 🛍️ **Outros**: Outras despesas

### 🔍 Filtros e Busca
- **Filtro por tipo**: Receitas ou despesas
- **Filtro por origem**: Pessoal ou negócio
- **Busca por texto**: Encontrar transações por descrição ou categoria
- **Filtros combinados**: Múltiplos filtros simultâneos

### 📱 Interface Moderna
- **Design responsivo**: Funciona em desktop, tablet e mobile
- **Tema adaptativo**: Suporte a modo claro/escuro
- **Cores semânticas**: Verde para receitas, vermelho para despesas
- **Ícones intuitivos**: Cada categoria tem seu ícone característico
- **Tooltips informativos**: Informações detalhadas ao passar o mouse

### 📊 Integração com Dashboard
- **Widget financeiro**: Resumo das finanças no dashboard principal
- **Navegação direta**: Botão "Nova Transação" leva direto às finanças
- **Cards compactos**: Visualização otimizada para o dashboard

## 🛠️ Componentes Técnicos

### Contexto de Finanças (`FinanceContext`)
```typescript
interface FinanceContextType {
  finances: Finance[];
  addFinance: (financeData: FinanceForm) => void;
  updateFinance: (id: string, financeData: FinanceForm) => void;
  deleteFinance: (id: string) => void;
  getFinancesByMonth: (year: number, month: number) => Finance[];
  getFinancesByType: (type: 'receita' | 'despesa') => Finance[];
  getFinancesByCategory: (category: string) => Finance[];
  getFinancesByBusiness: (isBusiness: boolean) => Finance[];
  getMonthlyStats: (year: number, month: number) => MonthlyStats;
  isLoading: boolean;
}
```

### Tipos de Dados
```typescript
interface Finance {
  id: string;
  userId: string;
  type: 'receita' | 'despesa';
  category: string;
  amount: number;
  description: string;
  date: Date;
  isBusiness: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  businessIncome: number;
  businessExpenses: number;
  personalIncome: number;
  personalExpenses: number;
}
```

### Componentes Principais
- **`Finances`**: Página principal de finanças
- **`FinanceStats`**: Componente de estatísticas
- **`TransactionList`**: Lista de transações
- **`TransactionModal`**: Modal para criar/editar transações
- **`FinanceCard`**: Card reutilizável para exibir transações

## 🎯 Fluxo de Uso

### 1. Visualização das Finanças
1. Acesse a página "Finanças" no menu lateral
2. Visualize as estatísticas do mês atual
3. Veja a lista de transações com filtros aplicados
4. Use os filtros para encontrar transações específicas

### 2. Criação de Transação
1. Clique em "Nova Transação" no cabeçalho
2. Preencha o formulário:
   - **Tipo**: Receita ou Despesa (obrigatório)
   - **Valor**: Valor da transação (obrigatório)
   - **Descrição**: Nome da transação (obrigatório)
   - **Categoria**: Categoria específica (obrigatório)
   - **Data**: Data da transação (obrigatório)
   - **Transação do Negócio**: Marque se é relacionada ao negócio
3. Clique em "Criar Transação"

### 3. Edição de Transação
1. Clique no ícone de editar (lápis) em qualquer transação
2. Modifique os campos desejados
3. Clique em "Atualizar Transação"

### 4. Exclusão de Transação
1. Clique no ícone de excluir (lixeira) em qualquer transação
2. Confirme a exclusão

### 5. Filtros e Busca
1. Use o filtro por tipo para mostrar apenas receitas ou despesas
2. Use o filtro por origem para mostrar transações pessoais ou do negócio
3. Digite na barra de busca para encontrar transações por texto
4. Os filtros são aplicados em tempo real

## 🎨 Esquema de Cores

| Tipo | Cor | Ícone | Descrição |
|------|-----|-------|-----------|
| Receita | Verde | 📈 | Entrada de dinheiro |
| Despesa | Vermelho | 📉 | Saída de dinheiro |
| Negócio | Azul | 💼 | Transações do negócio |
| Pessoal | Roxo | 🏠 | Transações pessoais |

## 📊 Persistência de Dados

- **LocalStorage**: Todas as transações são salvas localmente
- **Sincronização**: Dados são carregados automaticamente ao abrir a aplicação
- **Backup**: Dados ficam disponíveis mesmo offline
- **Cálculos automáticos**: Estatísticas são calculadas em tempo real

## 🔮 Próximas Funcionalidades

### Planejadas para próximas versões:
- [ ] **Relatórios avançados**: Gráficos e análises detalhadas
- [ ] **Orçamento mensal**: Definição e acompanhamento de metas
- [ ] **Contas bancárias**: Múltiplas contas e transferências
- [ ] **Cartões de crédito**: Controle de faturas e parcelamentos
- [ ] **Exportação**: Exportar dados para Excel/PDF
- [ ] **Backup na nuvem**: Sincronização com servidor
- [ ] **Lembretes**: Notificações para contas a pagar
- [ ] **Categorias customizadas**: Permitir criar categorias personalizadas
- [ ] **Fotos de comprovantes**: Anexar imagens às transações
- [ ] **Integração bancária**: Importar extratos automaticamente

## 💡 Dicas de Uso

### Para Mães Empreendedoras:
1. **Separe sempre**: Use a marcação "Transação do Negócio" para manter as finanças organizadas
2. **Categorize tudo**: Use as categorias específicas para facilitar relatórios
3. **Registre diariamente**: Mantenha o hábito de registrar todas as transações
4. **Monitore o saldo**: Acompanhe o saldo total e do negócio regularmente
5. **Use os filtros**: Utilize os filtros para analisar diferentes aspectos das suas finanças

### Boas Práticas:
- Registre transações assim que acontecerem
- Use descrições claras e específicas
- Categorize corretamente para relatórios precisos
- Revise as transações regularmente
- Mantenha backup dos dados importantes

## 🐛 Solução de Problemas

### Problemas Comuns:

1. **Transações não aparecem**
   - Verifique se os filtros estão configurados corretamente
   - Use "Todos os tipos" e "Todos" para mostrar todas as transações

2. **Erro ao salvar transação**
   - Verifique se todos os campos obrigatórios estão preenchidos
   - Certifique-se de que o valor é um número válido
   - Recarregue a página e tente novamente

3. **Estatísticas incorretas**
   - Verifique se as datas das transações estão corretas
   - Confirme se a marcação de negócio está adequada
   - Os cálculos são feitos automaticamente para o mês atual

## 📝 Notas de Desenvolvimento

- **Performance**: O sistema é otimizado para carregar rapidamente
- **Acessibilidade**: Suporte a navegação por teclado
- **Responsividade**: Funciona em todos os tamanhos de tela
- **Internacionalização**: Pronto para suporte a múltiplos idiomas
- **Formatação**: Valores monetários formatados automaticamente

---

**Desenvolvido com ❤️ para mães empreendedoras** 