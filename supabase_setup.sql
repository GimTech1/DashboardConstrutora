-- ============================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS
-- Dashboard SDR - Grupo IM Construtora
-- ============================================

-- 1. LIMPAR TABELAS EXISTENTES (se houver)
DROP TABLE IF EXISTS agendamentos CASCADE;
DROP TABLE IF EXISTS sdr_metas CASCADE;

-- 2. CRIAR TABELA DE AGENDAMENTOS
CREATE TABLE agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sdr_nome TEXT NOT NULL,
  cliente_nome TEXT NOT NULL,
  data_agendamento DATE NOT NULL,
  hora_agendamento TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado',
  empreendimento TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIAR TABELA DE METAS DOS SDRs
CREATE TABLE sdr_metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sdr_nome TEXT NOT NULL UNIQUE,
  meta_diaria INTEGER NOT NULL DEFAULT 6,
  meta_mensal INTEGER NOT NULL DEFAULT 360,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CRIAR ÍNDICES PARA MELHOR PERFORMANCE
CREATE INDEX idx_agendamentos_data ON agendamentos(data_agendamento);
CREATE INDEX idx_agendamentos_sdr ON agendamentos(sdr_nome);
CREATE INDEX idx_agendamentos_sdr_data ON agendamentos(sdr_nome, data_agendamento);

-- 5. INSERIR METAS INICIAIS DOS SDRs
INSERT INTO sdr_metas (sdr_nome, meta_diaria, meta_mensal) VALUES
  ('Renata', 6, 360),
  ('Lucas', 6, 360),
  ('Maria Eduarda', 6, 360)
ON CONFLICT (sdr_nome) DO UPDATE SET
  meta_diaria = EXCLUDED.meta_diaria,
  meta_mensal = EXCLUDED.meta_mensal,
  updated_at = NOW();

-- 6. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. TRIGGER PARA ATUALIZAR updated_at NA TABELA sdr_metas
CREATE TRIGGER update_sdr_metas_updated_at
  BEFORE UPDATE ON sdr_metas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. HABILITAR RLS (Row Level Security) - OPCIONAL
-- Descomente as linhas abaixo se quiser habilitar segurança por linha

-- ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sdr_metas ENABLE ROW LEVEL SECURITY;

-- Criar políticas (exemplo - ajuste conforme sua necessidade)
-- CREATE POLICY "Permitir leitura pública" ON agendamentos FOR SELECT USING (true);
-- CREATE POLICY "Permitir inserção pública" ON agendamentos FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Permitir leitura pública" ON sdr_metas FOR SELECT USING (true);

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Verificar se as tabelas foram criadas
SELECT 
  'Tabelas criadas:' as status,
  COUNT(*) as total
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('agendamentos', 'sdr_metas');

-- Verificar metas inseridas
SELECT 
  'Metas configuradas:' as status,
  sdr_nome,
  meta_diaria,
  meta_mensal
FROM sdr_metas
ORDER BY sdr_nome;

-- ============================================
-- FIM DO SCRIPT
-- ============================================
