#!/bin/bash

echo "🚀 Deployando MamaBoss para o GitHub..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Não estamos no diretório do projeto React"
    exit 1
fi

# Configurar git se necessário
if [ -z "$(git config user.name)" ]; then
    echo "📝 Configurando git..."
    git config user.name "Rafahs13"
    git config user.email "rafaela@mamaboss.com.br"
fi

# Adicionar todos os arquivos
echo "📁 Adicionando arquivos..."
git add .

# Fazer commit
echo "💾 Fazendo commit..."
git commit -m "🎉 Commit inicial: MamaBoss - Sistema completo de organização para mães empreendedoras

✨ Funcionalidades implementadas:
- 🔐 Sistema de autenticação completo
- 📊 Dashboard interativo com métricas em tempo real
- ✅ Gerenciamento de tarefas com CRUD completo
- 🎯 Sistema de metas com controle de progresso
- 🎨 Interface responsiva com Chakra UI
- 💾 Persistência de dados com localStorage
- 🔄 Context API para gerenciamento de estado

🛠️ Tecnologias:
- React 18 + TypeScript
- Chakra UI v2
- React Router
- Lucide React
- Context API

📱 Páginas implementadas:
- Login (/login)
- Dashboard (/dashboard)
- Tarefas (/tasks)
- Metas (/goals)

🚀 Pronto para uso e desenvolvimento!"

# Adicionar repositório remoto se não existir
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adicionando repositório remoto..."
    git remote add origin https://github.com/Rafahs13/mamaboss.git
fi

# Fazer push
echo "⬆️ Fazendo push para o GitHub..."
git push -u origin master

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://github.com/Rafahs13/mamaboss" 