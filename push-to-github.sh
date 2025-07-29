#!/bin/bash

echo "🚀 Fazendo push do MamaBoss para o GitHub..."

# Navegar para o diretório correto
cd mamaboss-app

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Não encontrei o package.json. Verifique se está no diretório correto."
    exit 1
fi

echo "✅ Diretório correto encontrado!"

# Verificar status do git
echo "📊 Status do git:"
git status

# Fazer push
echo "⬆️ Fazendo push para o GitHub..."
git push -u origin master

echo "✅ Push concluído!"
echo "🌐 Acesse: https://github.com/Rafahs13/mamaboss" 