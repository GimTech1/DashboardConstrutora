-- ============================================
-- SCRIPT PARA INSERIR DADOS HISTÓRICOS
-- Dashboard SDR - Grupo IM Construtora
-- Semana: 05/01/2026 (seg) a 09/01/2026 (sex)
-- ============================================

-- Limpar agendamentos existentes (opcional - descomente se quiser)
-- TRUNCATE TABLE agendamentos RESTART IDENTITY;

-- ATUALIZAR METAS PARA 120/MÊS POR SDR (360 total)
UPDATE sdr_metas SET meta_mensal = 120 WHERE sdr_nome = 'Renata';
UPDATE sdr_metas SET meta_mensal = 120 WHERE sdr_nome = 'Lucas';
UPDATE sdr_metas SET meta_mensal = 120 WHERE sdr_nome = 'Maria Eduarda';

-- ============================================
-- MARIA EDUARDA (DUDA) - Total: 15
-- ============================================

-- Segunda-feira (05/01/2026) - 1 agendamento
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES ('Maria Eduarda', 'Cliente Duda 1', '2026-01-05', '09:00', 'agendado', 'Empreendimento A');

-- Terça-feira (06/01/2026) - 0 agendamentos
-- (nenhum)

-- Quarta-feira (07/01/2026) - 5 agendamentos
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES 
  ('Maria Eduarda', 'Cliente Duda 2', '2026-01-07', '08:30', 'agendado', 'Empreendimento A'),
  ('Maria Eduarda', 'Cliente Duda 3', '2026-01-07', '10:00', 'agendado', 'Empreendimento B'),
  ('Maria Eduarda', 'Cliente Duda 4', '2026-01-07', '11:30', 'agendado', 'Empreendimento A'),
  ('Maria Eduarda', 'Cliente Duda 5', '2026-01-07', '14:00', 'agendado', 'Empreendimento C'),
  ('Maria Eduarda', 'Cliente Duda 6', '2026-01-07', '16:00', 'agendado', 'Empreendimento B');

-- Quinta-feira (08/01/2026) - 7 agendamentos
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES 
  ('Maria Eduarda', 'Cliente Duda 7', '2026-01-08', '08:00', 'agendado', 'Empreendimento A'),
  ('Maria Eduarda', 'Cliente Duda 8', '2026-01-08', '09:30', 'agendado', 'Empreendimento B'),
  ('Maria Eduarda', 'Cliente Duda 9', '2026-01-08', '10:30', 'agendado', 'Empreendimento C'),
  ('Maria Eduarda', 'Cliente Duda 10', '2026-01-08', '11:30', 'agendado', 'Empreendimento A'),
  ('Maria Eduarda', 'Cliente Duda 11', '2026-01-08', '14:00', 'agendado', 'Empreendimento B'),
  ('Maria Eduarda', 'Cliente Duda 12', '2026-01-08', '15:30', 'agendado', 'Empreendimento C'),
  ('Maria Eduarda', 'Cliente Duda 13', '2026-01-08', '17:00', 'agendado', 'Empreendimento A');

-- Sexta-feira (09/01/2026) - 2 agendamentos
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES 
  ('Maria Eduarda', 'Cliente Duda 14', '2026-01-09', '09:00', 'agendado', 'Empreendimento A'),
  ('Maria Eduarda', 'Cliente Duda 15', '2026-01-09', '11:00', 'agendado', 'Empreendimento B');

-- ============================================
-- LUCAS - Total: 11
-- ============================================

-- Segunda-feira (05/01/2026) - 0 agendamentos
-- (nenhum)

-- Terça-feira (06/01/2026) - 1 agendamento
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES ('Lucas', 'Cliente Lucas 1', '2026-01-06', '10:00', 'agendado', 'Empreendimento B');

-- Quarta-feira (07/01/2026) - 3 agendamentos
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES 
  ('Lucas', 'Cliente Lucas 2', '2026-01-07', '09:00', 'agendado', 'Empreendimento A'),
  ('Lucas', 'Cliente Lucas 3', '2026-01-07', '11:00', 'agendado', 'Empreendimento C'),
  ('Lucas', 'Cliente Lucas 4', '2026-01-07', '15:00', 'agendado', 'Empreendimento B');

-- Quinta-feira (08/01/2026) - 7 agendamentos
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES 
  ('Lucas', 'Cliente Lucas 5', '2026-01-08', '08:00', 'agendado', 'Empreendimento A'),
  ('Lucas', 'Cliente Lucas 6', '2026-01-08', '09:00', 'agendado', 'Empreendimento B'),
  ('Lucas', 'Cliente Lucas 7', '2026-01-08', '10:30', 'agendado', 'Empreendimento C'),
  ('Lucas', 'Cliente Lucas 8', '2026-01-08', '11:30', 'agendado', 'Empreendimento A'),
  ('Lucas', 'Cliente Lucas 9', '2026-01-08', '14:00', 'agendado', 'Empreendimento B'),
  ('Lucas', 'Cliente Lucas 10', '2026-01-08', '15:30', 'agendado', 'Empreendimento C'),
  ('Lucas', 'Cliente Lucas 11', '2026-01-08', '17:00', 'agendado', 'Empreendimento A');

-- Sexta-feira (09/01/2026) - 0 agendamentos
-- (nenhum)

-- ============================================
-- RENATA - Total: 11
-- ============================================

-- Segunda-feira (05/01/2026) - 0 agendamentos
-- (nenhum)

-- Terça-feira (06/01/2026) - 2 agendamentos
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES 
  ('Renata', 'Cliente Renata 1', '2026-01-06', '09:00', 'agendado', 'Empreendimento A'),
  ('Renata', 'Cliente Renata 2', '2026-01-06', '14:00', 'agendado', 'Empreendimento B');

-- Quarta-feira (07/01/2026) - 6 agendamentos
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES 
  ('Renata', 'Cliente Renata 3', '2026-01-07', '08:00', 'agendado', 'Empreendimento A'),
  ('Renata', 'Cliente Renata 4', '2026-01-07', '09:30', 'agendado', 'Empreendimento B'),
  ('Renata', 'Cliente Renata 5', '2026-01-07', '11:00', 'agendado', 'Empreendimento C'),
  ('Renata', 'Cliente Renata 6', '2026-01-07', '13:30', 'agendado', 'Empreendimento A'),
  ('Renata', 'Cliente Renata 7', '2026-01-07', '15:00', 'agendado', 'Empreendimento B'),
  ('Renata', 'Cliente Renata 8', '2026-01-07', '16:30', 'agendado', 'Empreendimento C');

-- Quinta-feira (08/01/2026) - 3 agendamentos
INSERT INTO agendamentos (sdr_nome, cliente_nome, data_agendamento, hora_agendamento, status, empreendimento)
VALUES 
  ('Renata', 'Cliente Renata 9', '2026-01-08', '09:00', 'agendado', 'Empreendimento A'),
  ('Renata', 'Cliente Renata 10', '2026-01-08', '11:00', 'agendado', 'Empreendimento B'),
  ('Renata', 'Cliente Renata 11', '2026-01-08', '14:30', 'agendado', 'Empreendimento C');

-- Sexta-feira (09/01/2026) - 0 agendamentos
-- (nenhum)

-- ============================================
-- VERIFICAÇÃO
-- ============================================

-- Verificar totais por SDR no mês
SELECT 
  sdr_nome,
  COUNT(*) as total_mensal,
  SUM(CASE WHEN data_agendamento = '2026-01-05' THEN 1 ELSE 0 END) as segunda,
  SUM(CASE WHEN data_agendamento = '2026-01-06' THEN 1 ELSE 0 END) as terca,
  SUM(CASE WHEN data_agendamento = '2026-01-07' THEN 1 ELSE 0 END) as quarta,
  SUM(CASE WHEN data_agendamento = '2026-01-08' THEN 1 ELSE 0 END) as quinta,
  SUM(CASE WHEN data_agendamento = '2026-01-09' THEN 1 ELSE 0 END) as sexta
FROM agendamentos
WHERE data_agendamento >= '2026-01-01'
GROUP BY sdr_nome
ORDER BY sdr_nome;
