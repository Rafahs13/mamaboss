#!/bin/bash

echo "🔐 Configuração do Google OAuth - MamaBoss"
echo "=========================================="
echo ""

echo "📋 Passos para configurar:"
echo "1. Acesse: https://console.cloud.google.com/"
echo "2. Crie um projeto ou selecione existente"
echo "3. Ative as APIs: Google+ API e Google Identity"
echo "4. Crie credenciais OAuth 2.0"
echo "5. Configure as URLs autorizadas:"
echo "   - JavaScript origins: http://localhost:3000"
echo "   - Redirect URIs: http://localhost:3000"
echo ""

echo "🔑 Cole seu Client ID aqui:"
read -p "Client ID: " CLIENT_ID

if [ -z "$CLIENT_ID" ]; then
    echo "❌ Client ID não fornecido!"
    exit 1
fi

echo ""
echo "📝 Configurando arquivo .env..."
echo "REACT_APP_GOOGLE_CLIENT_ID=$CLIENT_ID" > .env

echo "✅ Configuração concluída!"
echo "🔄 Reiniciando o servidor..."

# Parar servidor atual
pkill -f "react-scripts" 2>/dev/null

# Aguardar um pouco
sleep 2

# Iniciar servidor
npm start &

echo "🚀 Servidor iniciado em http://localhost:3000"
echo "🎉 Agora o login com Google deve funcionar!" 