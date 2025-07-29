# 🚀 Deploy do MamaBoss para o GitHub

## 📋 Passos para fazer o deploy:

### 1. **Configurar Git (se necessário)**
```bash
git config user.name "Rafahs13"
git config user.email "rafaela@mamaboss.com.br"
```

### 2. **Inicializar repositório (se não foi feito)**
```bash
git init
```

### 3. **Adicionar arquivos**
```bash
git add .
```

### 4. **Fazer commit**
```bash
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
```

### 5. **Adicionar repositório remoto**
```bash
git remote add origin https://github.com/Rafahs13/mamaboss.git
```

### 6. **Fazer push**
```bash
git push -u origin master
```

## 🔐 **Autenticação GitHub**

Se você encontrar problemas de autenticação, você pode:

### Opção 1: Token de Acesso Pessoal
1. Vá para GitHub → Settings → Developer settings → Personal access tokens
2. Gere um novo token com permissões de repo
3. Use o token como senha quando solicitado

### Opção 2: SSH (Recomendado)
1. Gere uma chave SSH: `ssh-keygen -t ed25519 -C "rafaela@mamaboss.com.br"`
2. Adicione a chave pública ao GitHub
3. Use a URL SSH: `git remote add origin git@github.com:Rafahs13/mamaboss.git`

## ✅ **Verificação**

Após o push, verifique se tudo foi enviado:
```bash
git status
git log --oneline -1
```

## 🌐 **Acesso**

O projeto estará disponível em: https://github.com/Rafahs13/mamaboss

## 📱 **Próximos passos**

1. **Configurar GitHub Pages** (opcional)
2. **Adicionar Issues e Projects**
3. **Configurar Actions** para CI/CD
4. **Adicionar colaboradores**

---

**MamaBoss** - Organize sua vida com carinho! 💕 