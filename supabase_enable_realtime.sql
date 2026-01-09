-- ============================================
-- HABILITAR REALTIME NA TABELA DE AGENDAMENTOS
-- Dashboard SDR - Grupo IM Construtora
-- ============================================

-- Habilitar Realtime para a tabela agendamentos
ALTER PUBLICATION supabase_realtime ADD TABLE agendamentos;

-- Verificar se foi habilitado
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
