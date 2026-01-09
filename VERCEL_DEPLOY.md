# 🚀 Guia de Deploy - Vercel

## 📋 Pré-requisitos

1. ✅ Conta na [Vercel](https://vercel.com)
2. ✅ Projeto no GitHub (já configurado)
3. ✅ Projeto no Supabase configurado
4. ✅ Banco de dados criado (execute `supabase_setup.sql`)

---

## 🔧 Passo a Passo

### 1. Conectar Repositório na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Importe o repositório `GimTech1/DashboardConstrutora`
4. A Vercel detectará automaticamente que é um projeto Vite/React

### 2. Configurar Build Settings

A Vercel detecta automaticamente, mas verifique:

- **Framework Preset:** Vite
- **Build Command:** `npm run build` (automático)
- **Output Directory:** `dist` (automático)
- **Install Command:** `npm install` (automático)

### 3. Configurar Variáveis de Ambiente

**IMPORTANTE:** Configure estas variáveis no painel da Vercel:

1. No projeto Vercel, vá em **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua-chave-anon-key
```

**Como encontrar suas credenciais:**
- Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
- Vá em **Settings** → **API**
- Copie:
  - **Project URL** → `VITE_SUPABASE_URL`
  - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 4. Deploy

1. Clique em **Deploy**
2. Aguarde o build completar (1-2 minutos)
3. Seu dashboard estará disponível em: `https://dashboard-construtora.vercel.app` (ou URL personalizada)

---

## ✅ Verificações Pós-Deploy

### 1. Verificar se está usando dados reais

- Abra o console do navegador (F12)
- Verifique se não há erros de conexão com Supabase
- Teste adicionar um agendamento pelo dashboard

### 2. Verificar Build Logs

Se houver erros:
- Vá em **Deployments** → Clique no último deploy → **View Build Logs**
- Verifique se as variáveis de ambiente estão configuradas

### 3. Testar Funcionalidades

- ✅ Adicionar agendamento
- ✅ Ver estatísticas do dia
- ✅ Ver gráficos de progresso mensal
- ✅ Verificar tooltips
- ✅ Testar sons de comemoração

---

## 🔄 Atualizações Futuras

A Vercel faz **deploy automático** quando você faz push para o GitHub:

```bash
git add .
git commit -m "Atualização"
git push origin main
```

A Vercel detecta automaticamente e faz o deploy! 🎉

---

## 🆘 Troubleshooting

### Erro: "Failed to fetch"
- Verifique se as variáveis de ambiente estão configuradas
- Confirme que a URL do Supabase está correta
- Verifique se o Supabase permite conexões da Vercel

### Erro: "Module not found"
- Execute `npm install` localmente para verificar dependências
- Verifique se todas as dependências estão no `package.json`

### Build falha
- Verifique os logs de build na Vercel
- Confirme que o comando `npm run build` funciona localmente
- Verifique se há erros de TypeScript (`npm run build` local)

### Dados não aparecem
- Confirme que `USE_MOCK_DATA = false` no código
- Verifique se o banco de dados foi criado no Supabase
- Verifique o console do navegador para erros

---

## 📝 Notas Importantes

1. **Variáveis de Ambiente:** Sempre configure na Vercel, nunca commite o `.env`
2. **Build Time:** O build leva ~1-2 minutos na primeira vez
3. **Cache:** A Vercel cacheia builds, então atualizações podem demorar alguns segundos
4. **Custom Domain:** Você pode configurar um domínio personalizado depois em Settings → Domains

---

## 🎯 Checklist Final

- [ ] Repositório conectado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Build executado com sucesso
- [ ] Dashboard acessível via URL
- [ ] Dados reais do Supabase funcionando
- [ ] Testado adicionar agendamento
- [ ] Sons de comemoração funcionando

---

**Pronto! Seu dashboard está no ar! 🚀**
