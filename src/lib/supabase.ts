import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Só cria o cliente se as credenciais existirem
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Types
export interface Agendamento {
  id: string
  sdr_nome: string
  cliente_nome: string
  data_agendamento: string
  hora_agendamento: string
  status: 'agendado'
  empreendimento: string
  created_at: string
}

export interface SDRMeta {
  id: string
  sdr_nome: string
  meta_diaria: number
  meta_mensal: number
}

// SDRs fixos
export const SDRS = ['Renata', 'Lucas', 'Maria Eduarda'] as const
export type SDRName = typeof SDRS[number]

// Imagens e cores por SDR
import logoRenata from '../images/brasao.png'
import logoLucas from '../images/Lucas.jpeg'
import logoDuda from '../images/Duda.jpeg'

export const SDR_CONFIG: Record<SDRName, { 
  primary: string
  gradient: string
  bg: string
  image: string
}> = {
  'Renata': {
    primary: '#e879f9',
    gradient: 'from-fuchsia-400 to-pink-400',
    bg: 'bg-fuchsia-500/10',
    image: logoRenata,
  },
  'Lucas': {
    primary: '#38bdf8',
    gradient: 'from-sky-400 to-cyan-400',
    bg: 'bg-sky-500/10',
    image: logoLucas,
  },
  'Maria Eduarda': {
    primary: '#a78bfa',
    gradient: 'from-violet-400 to-purple-400',
    bg: 'bg-violet-500/10',
    image: logoDuda,
  },
}

// Alias para compatibilidade
export const SDR_COLORS = SDR_CONFIG

// Funções de busca
export async function getAgendamentosHoje() {
  if (!supabase) throw new Error('Supabase não configurado')
  
  const hoje = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('data_agendamento', hoje)
    .order('hora_agendamento', { ascending: true })

  if (error) throw error
  return data as Agendamento[]
}

export async function getAgendamentosPorSDR(sdrNome: string) {
  if (!supabase) throw new Error('Supabase não configurado')
  
  const hoje = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .eq('sdr_nome', sdrNome)
    .eq('data_agendamento', hoje)
    .order('hora_agendamento', { ascending: true })

  if (error) throw error
  return data as Agendamento[]
}

export async function getMetasSDR() {
  if (!supabase) throw new Error('Supabase não configurado')
  
  const { data, error } = await supabase
    .from('sdr_metas')
    .select('*')

  if (error) throw error
  return data as SDRMeta[]
}

export async function getTotalAgendamentosMes() {
  if (!supabase) throw new Error('Supabase não configurado')
  
  const hoje = new Date()
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0]
  const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('agendamentos')
    .select('*')
    .gte('data_agendamento', primeiroDiaMes)
    .lte('data_agendamento', ultimoDiaMes)

  if (error) throw error
  return data as Agendamento[]
}

// Criar novo agendamento no Supabase
export async function criarAgendamento(sdrNome: string): Promise<Agendamento> {
  if (!supabase) throw new Error('Supabase não configurado')
  
  const hoje = new Date()
  const dataAgendamento = hoje.toISOString().split('T')[0]
  const horaAgendamento = hoje.toTimeString().slice(0, 5) // HH:mm
  
  const novoAgendamento = {
    sdr_nome: sdrNome,
    cliente_nome: 'Cliente',
    data_agendamento: dataAgendamento,
    hora_agendamento: horaAgendamento,
    status: 'agendado',
    empreendimento: 'Não informado'
  }
  
  const { data, error } = await supabase
    .from('agendamentos')
    .insert([novoAgendamento])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar agendamento:', error)
    throw error
  }
  
  return data as Agendamento
}

// Dados mockados para desenvolvimento
export function getMockData() {
  const hoje = new Date().toISOString().split('T')[0]
  
  const mockAgendamentos: Agendamento[] = [
    // Renata
    { id: '1', sdr_nome: 'Renata', cliente_nome: 'João Silva', data_agendamento: hoje, hora_agendamento: '09:00', status: 'agendado', empreendimento: 'Residencial Aurora', created_at: hoje },
    { id: '2', sdr_nome: 'Renata', cliente_nome: 'Maria Santos', data_agendamento: hoje, hora_agendamento: '10:30', status: 'agendado', empreendimento: 'Edifício Solaris', created_at: hoje },
    { id: '3', sdr_nome: 'Renata', cliente_nome: 'Pedro Costa', data_agendamento: hoje, hora_agendamento: '14:00', status: 'agendado', empreendimento: 'Condomínio Verde', created_at: hoje },
    { id: '4', sdr_nome: 'Renata', cliente_nome: 'Ana Oliveira', data_agendamento: hoje, hora_agendamento: '15:30', status: 'agendado', empreendimento: 'Residencial Aurora', created_at: hoje },
    { id: '5', sdr_nome: 'Renata', cliente_nome: 'Carlos Lima', data_agendamento: hoje, hora_agendamento: '16:00', status: 'agendado', empreendimento: 'Edifício Solaris', created_at: hoje },
    
    // Lucas - ultrapassou a meta (8 de 6)
    { id: '6', sdr_nome: 'Lucas', cliente_nome: 'Fernanda Reis', data_agendamento: hoje, hora_agendamento: '08:30', status: 'agendado', empreendimento: 'Residencial Aurora', created_at: hoje },
    { id: '7', sdr_nome: 'Lucas', cliente_nome: 'Roberto Alves', data_agendamento: hoje, hora_agendamento: '11:00', status: 'agendado', empreendimento: 'Condomínio Verde', created_at: hoje },
    { id: '8', sdr_nome: 'Lucas', cliente_nome: 'Juliana Martins', data_agendamento: hoje, hora_agendamento: '13:00', status: 'agendado', empreendimento: 'Edifício Solaris', created_at: hoje },
    { id: '9', sdr_nome: 'Lucas', cliente_nome: 'Marcos Souza', data_agendamento: hoje, hora_agendamento: '15:00', status: 'agendado', empreendimento: 'Residencial Aurora', created_at: hoje },
    { id: '10', sdr_nome: 'Lucas', cliente_nome: 'Patricia Lima', data_agendamento: hoje, hora_agendamento: '16:30', status: 'agendado', empreendimento: 'Condomínio Verde', created_at: hoje },
    { id: '11', sdr_nome: 'Lucas', cliente_nome: 'Ricardo Nunes', data_agendamento: hoje, hora_agendamento: '17:00', status: 'agendado', empreendimento: 'Edifício Solaris', created_at: hoje },
    { id: '16', sdr_nome: 'Lucas', cliente_nome: 'Amanda Costa', data_agendamento: hoje, hora_agendamento: '17:30', status: 'agendado', empreendimento: 'Residencial Aurora', created_at: hoje },
    { id: '17', sdr_nome: 'Lucas', cliente_nome: 'Felipe Santos', data_agendamento: hoje, hora_agendamento: '18:00', status: 'agendado', empreendimento: 'Condomínio Verde', created_at: hoje },
    
    // Maria Eduarda
    { id: '12', sdr_nome: 'Maria Eduarda', cliente_nome: 'Luciana Ferreira', data_agendamento: hoje, hora_agendamento: '09:30', status: 'agendado', empreendimento: 'Condomínio Verde', created_at: hoje },
    { id: '13', sdr_nome: 'Maria Eduarda', cliente_nome: 'Bruno Cardoso', data_agendamento: hoje, hora_agendamento: '10:00', status: 'agendado', empreendimento: 'Residencial Aurora', created_at: hoje },
    { id: '14', sdr_nome: 'Maria Eduarda', cliente_nome: 'Camila Rocha', data_agendamento: hoje, hora_agendamento: '11:30', status: 'agendado', empreendimento: 'Edifício Solaris', created_at: hoje },
    { id: '15', sdr_nome: 'Maria Eduarda', cliente_nome: 'Diego Mendes', data_agendamento: hoje, hora_agendamento: '14:30', status: 'agendado', empreendimento: 'Residencial Aurora', created_at: hoje },
  ]

  const mockMetas: SDRMeta[] = [
    { id: '1', sdr_nome: 'Renata', meta_diaria: 6, meta_mensal: 120 },
    { id: '2', sdr_nome: 'Lucas', meta_diaria: 6, meta_mensal: 120 },
    { id: '3', sdr_nome: 'Maria Eduarda', meta_diaria: 6, meta_mensal: 120 },
  ]

  // Simular acumulado mensal (em produção viria do banco)
  // Meta mensal: 360, ou seja ~12/dia para estar no ritmo
  const diaAtual = new Date().getDate()
  
  const mockAcumuladoMensal: Record<string, number> = {
    'Renata': Math.floor(10 * (diaAtual - 1)) + 5,  // Média de 10/dia - abaixo do ritmo
    'Lucas': Math.floor(14 * (diaAtual - 1)) + 8,   // Média de 14/dia - acima do ritmo ✓
    'Maria Eduarda': Math.floor(12 * (diaAtual - 1)) + 4, // Média de 12/dia - no ritmo ✓
  }

  return { mockAgendamentos, mockMetas, mockAcumuladoMensal }
}
