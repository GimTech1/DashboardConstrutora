import { User, Target, CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { Agendamento, SDRName } from '../lib/supabase'
import { SDR_COLORS } from '../lib/supabase'

interface SDRCardProps {
  nome: SDRName
  agendamentos: Agendamento[]
  metaDiaria: number
  delay?: number
}

export function SDRCard({ nome, agendamentos, metaDiaria, delay = 0 }: SDRCardProps) {
  const colors = SDR_COLORS[nome]
  
  const realizados = agendamentos.filter(a => a.status === 'realizado').length
  const confirmados = agendamentos.filter(a => a.status === 'confirmado').length
  const pendentes = agendamentos.filter(a => a.status === 'pendente').length
  const cancelados = agendamentos.filter(a => a.status === 'cancelado').length
  const total = agendamentos.length
  
  const progressPercent = Math.min((realizados / metaDiaria) * 100, 100)
  const metaAtingida = realizados >= metaDiaria

  // Iniciais do nome
  const iniciais = nome.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div 
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl glass card-hover gradient-border">
        {/* Glow effect */}
        <div 
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: colors.primary }}
        />
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar */}
            <div 
              className={`
                relative w-14 h-14 rounded-xl flex items-center justify-center
                bg-gradient-to-br ${colors.gradient} shadow-lg
              `}
            >
              <span className="text-lg font-bold text-white">{iniciais}</span>
              {metaAtingida && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-slate-925">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{nome}</h3>
              <p className="text-sm text-slate-400">SDR</p>
            </div>

            {/* Meta badge */}
            <div className={`
              px-3 py-1.5 rounded-lg text-sm font-medium
              ${metaAtingida 
                ? 'bg-emerald-500/10 text-emerald-400' 
                : 'bg-amber-500/10 text-amber-400'
              }
            `}>
              {metaAtingida ? 'Meta atingida!' : `${realizados}/${metaDiaria}`}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progresso da meta</span>
              <span className="text-sm font-medium text-white">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} progress-bar transition-all duration-1000 ease-out`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-xl bg-slate-800/50">
              <div className="flex items-center justify-center mb-1">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xl font-bold text-white counter">{total}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
            
            <div className="text-center p-3 rounded-xl bg-emerald-500/5">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-emerald-400 counter">{realizados}</p>
              <p className="text-xs text-slate-500">Realizados</p>
            </div>
            
            <div className="text-center p-3 rounded-xl bg-blue-500/5">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xl font-bold text-blue-400 counter">{confirmados + pendentes}</p>
              <p className="text-xs text-slate-500">Pendentes</p>
            </div>
            
            <div className="text-center p-3 rounded-xl bg-rose-500/5">
              <div className="flex items-center justify-center mb-1">
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-xl font-bold text-rose-400 counter">{cancelados}</p>
              <p className="text-xs text-slate-500">Cancelados</p>
            </div>
          </div>

          {/* Próximo agendamento */}
          {agendamentos.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                Próximos agendamentos
              </p>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {agendamentos
                  .filter(a => a.status === 'pendente' || a.status === 'confirmado')
                  .slice(0, 3)
                  .map(agendamento => (
                    <div 
                      key={agendamento.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30"
                    >
                      <div className={`
                        w-2 h-2 rounded-full
                        ${agendamento.status === 'confirmado' ? 'bg-blue-400' : 'bg-amber-400'}
                      `} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">
                          {agendamento.cliente_nome}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {agendamento.empreendimento}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-slate-300">
                        {agendamento.hora_agendamento}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
