# Dashboard SDR - Grupo IM Construtora

Dashboard para acompanhamento de agendamentos da equipe de SDR (Sales Development Representative).

## Tecnologias

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Supabase (banco de dados)
- date-fns (formatação de datas)

## Instalação

```bash
npm install
```

## Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)

2. Crie as seguintes tabelas no seu banco de dados:

```sql
-- Tabela de agendamentos
CREATE TABLE agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sdr_nome TEXT NOT NULL,
  cliente_nome TEXT NOT NULL,
  data_agendamento DATE NOT NULL,
  hora_agendamento TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pendente', 'confirmado', 'realizado', 'cancelado')),
  empreendimento TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de metas dos SDRs
CREATE TABLE sdr_metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sdr_nome TEXT NOT NULL UNIQUE,
  meta_diaria INTEGER NOT NULL,
  meta_mensal INTEGER NOT NULL
);

-- Inserir metas iniciais
INSERT INTO sdr_metas (sdr_nome, meta_diaria, meta_mensal) VALUES
  ('Renata', 6, 120),
  ('Lucas', 7, 140),
  ('Maria Eduarda', 5, 100);
```

3. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. No arquivo `src/App.tsx`, altere a flag `USE_MOCK_DATA` para `false`:

```typescript
const USE_MOCK_DATA = false
```

## Desenvolvimento

```bash
npm run dev
```

O dashboard estará disponível em `http://localhost:5173`

## Build para Produção

```bash
npm run build
```

## Funcionalidades

- Visão geral dos agendamentos do dia
- Performance individual de cada SDR (Renata, Lucas, Maria Eduarda)
- Progresso em relação às metas diárias
- Lista completa de agendamentos com status
- Atualização automática a cada 30 segundos
- Interface moderna e responsiva

## Estrutura do Projeto

```
src/
├── App.tsx          # Componente principal
├── index.css        # Estilos globais
├── lib/
│   └── supabase.ts  # Configuração e funções do Supabase
└── components/      # Componentes reutilizáveis
```
