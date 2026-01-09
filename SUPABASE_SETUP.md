# 🗄️ Configuração do Banco de Dados - Supabase

## 📋 Scripts Disponíveis

### 1. `supabase_setup.sql` - **Configuração Completa (RECOMENDADO)**
   - Remove tabelas antigas (se existirem)
   - Cria todas as tabelas necessárias
   - Insere as metas iniciais dos SDRs
   - Cria índices para performance
   - Configura triggers automáticos

### 2. `supabase_clean_data.sql` - **Limpar Apenas Dados**
   - Remove todos os agendamentos
   - Reseta as metas para valores padrão
   - **Mantém a estrutura das tabelas**

---

## 🚀 Como Executar no Supabase

### Opção 1: SQL Editor (Mais Fácil)

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. **Cole o conteúdo do arquivo `supabase_setup.sql`**
5. Clique em **Run** (ou pressione `Ctrl+Enter`)

### Opção 2: Via Terminal (CLI)

```bash
# Se você tem o Supabase CLI instalado
supabase db reset
# Depois execute o script
psql -h [seu-host] -U postgres -d postgres -f supabase_setup.sql
```

---

## 📊 Estrutura das Tabelas

### Tabela: `agendamentos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária (gerada automaticamente) |
| `sdr_nome` | TEXT | Nome do SDR (Renata, Lucas, Maria Eduarda) |
| `cliente_nome` | TEXT | Nome do cliente |
| `data_agendamento` | DATE | Data do agendamento |
| `hora_agendamento` | TIME | Hora do agendamento |
| `status` | TEXT | Status (padrão: 'agendado') |
| `empreendimento` | TEXT | Nome do empreendimento |
| `created_at` | TIMESTAMP | Data de criação (automático) |

### Tabela: `sdr_metas`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Chave primária (gerada automaticamente) |
| `sdr_nome` | TEXT | Nome do SDR (único) |
| `meta_diaria` | INTEGER | Meta diária (padrão: 6) |
| `meta_mensal` | INTEGER | Meta mensal (padrão: 360) |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização (automático) |

---

## ✅ Verificação

Após executar o script, você deve ver:

1. **2 tabelas criadas** (`agendamentos` e `sdr_metas`)
2. **3 metas configuradas:**
   - Renata: 6/dia, 360/mês
   - Lucas: 6/dia, 360/mês
   - Maria Eduarda: 6/dia, 360/mês

---

## 🔧 Próximos Passos

1. ✅ Execute o script `supabase_setup.sql`
2. ✅ Configure as variáveis de ambiente no `.env`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon
   ```
3. ✅ Altere `USE_MOCK_DATA = false` no arquivo `src/App.tsx`
4. ✅ Teste adicionando um agendamento pelo dashboard

---

## 🆘 Troubleshooting

### Erro: "relation already exists"
- Execute primeiro: `DROP TABLE IF EXISTS agendamentos CASCADE;`
- Ou use o script `supabase_clean_data.sql` para limpar apenas dados

### Erro: "permission denied"
- Verifique se você tem permissões de administrador no projeto
- Use a conta de owner do projeto Supabase

### Não aparecem dados no dashboard
- Verifique se `USE_MOCK_DATA = false` no `App.tsx`
- Confirme que as variáveis `.env` estão corretas
- Verifique o console do navegador para erros

---

## 📝 Notas

- O script cria índices para melhorar a performance das consultas
- O campo `updated_at` é atualizado automaticamente via trigger
- As metas podem ser atualizadas diretamente no banco ou pelo dashboard (futuro)
