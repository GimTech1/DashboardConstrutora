-- ============================================
-- SCRIPT PARA LIMPAR DADOS (MANTÉM ESTRUTURA)
-- Dashboard SDR - Grupo IM Construtora
-- ============================================

-- Limpar todos os agendamentos
DELETE FROM agendamentos;

-- Resetar metas para valores padrão
UPDATE sdr_metas SET
  meta_diaria = 6,
  meta_mensal = 360,
  updated_at = NOW()
WHERE sdr_nome IN ('Renata', 'Lucas', 'Maria Eduarda');

-- Verificar limpeza
SELECT 
  'Agendamentos restantes:' as status,
  COUNT(*) as total
FROM agendamentos;

SELECT 
  'Metas atualizadas:' as status,
  sdr_nome,
  meta_diaria,
  meta_mensal
FROM sdr_metas
ORDER BY sdr_nome;
