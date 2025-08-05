#!/bin/bash

echo "🔧 Atualizador de Client ID do Google"
echo "====================================="
echo ""

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Criando arquivo .env..."
    echo "REACT_APP_GOOGLE_CLIENT_ID=" > .env
fi

echo "📋 Client ID atual:"
if grep -q "REACT_APP_GOOGLE_CLIENT_ID" .env; then
    grep "REACT_APP_GOOGLE_CLIENT_ID" .env
else
    echo "REACT_APP_GOOGLE_CLIENT_ID=não configurado"
fi

echo ""
echo "🔑 Para obter um Client ID real:"
echo "1. Acesse: https://console.cloud.google.com/"
echo "2. Crie um projeto ou selecione um existente"
echo "3. Vá em APIs & Services > Credentials"
echo "4. Clique em Create Credentials > OAuth 2.0 Client IDs"
echo "5. Configure:"
echo "   - Application type: Web application"
echo "   - Name: MamaBoss App"
echo "   - Authorized JavaScript origins: http://localhost:3000"
echo "   - Authorized redirect URIs: http://localhost:3000"
echo "6. Copie o Client ID gerado"
echo ""

# Solicitar novo Client ID
read -p "🔑 Cole seu Client ID aqui: " client_id

if [ -z "$client_id" ]; then
    echo "❌ Client ID não fornecido!"
    exit 1
fi

# Atualizar arquivo .env
if grep -q "REACT_APP_GOOGLE_CLIENT_ID" .env; then
    # Substituir linha existente
    sed -i "s/REACT_APP_GOOGLE_CLIENT_ID=.*/REACT_APP_GOOGLE_CLIENT_ID=$client_id/" .env
else
    # Adicionar nova linha
    echo "REACT_APP_GOOGLE_CLIENT_ID=$client_id" >> .env
fi

echo ""
echo "✅ Client ID atualizado com sucesso!"
echo ""

# Verificar se o servidor está rodando
if pgrep -f "react-scripts" > /dev/null; then
    echo "🔄 Servidor detectado. Reiniciando..."
    pkill -f "react-scripts"
    sleep 2
    npm start &
    echo "✅ Servidor reiniciado!"
else
    echo "🚀 Para iniciar o servidor, execute: npm start"
fi

echo ""
echo "🎉 Pronto! Acesse: http://localhost:3000/login"
echo "📖 Para mais detalhes, consulte: GOOGLE_CLIENT_ID_SETUP.md" 