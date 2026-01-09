import { Clock, User, Building, CheckCircle2, AlertCircle, XCircle, Timer } from 'lucide-react'
import type { Agendamento, SDRName } from '../lib/supabase'
import { SDR_COLORS } from '../lib/supabase'

interface AgendamentosTableProps {
  agendamentos: Agendamento[]
}

const statusConfig = {
  realizado: {
    label: 'Realizado',
    icon: CheckCircle2,
    color: 'text-emerald-400 bg-emerald-400/10',
  },
  confirmado: {
    label: 'Confirmado',
    icon: Timer,
    color: 'text-blue-400 bg-blue-400/10',
  },
  pendente: {
    label: 'Pendente',
    icon: AlertCircle,
    color: 'text-amber-400 bg-amber-400/10',
  },
  cancelado: {
    label: 'Cancelado',
    icon: XCircle,
    color: 'text-rose-400 bg-rose-400/10',
  },
}

export function AgendamentosTable({ agendamentos }: AgendamentosTableProps) {
  return (
    <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
      <div className="rounded-2xl glass gradient-border overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Agendamentos do Dia
              </h2>
              <p className="text-sm text-slate-400">
                {agendamentos.length} agendamentos registrados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 live-indicator" />
              <span className="text-sm text-slate-400">Tempo real</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Empreendimento
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  SDR
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {agendamentos.map((agendamento, index) => {
                const status = statusConfig[agendamento.status]
                const StatusIcon = status.icon
                const sdrColor = SDR_COLORS[agendamento.sdr_nome as SDRName]
                
                return (
                  <tr 
                    key={agendamento.id}
                    className="group hover:bg-slate-800/20 transition-colors"
                    style={{ 
                      animationDelay: `${500 + index * 50}ms`,
                    }}
                  >
                    {/* Horário */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-white counter">
                          {agendamento.hora_agendamento}
                        </span>
                      </div>
                    </td>

                    {/* Cliente */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-sm text-white">
                          {agendamento.cliente_nome}
                        </span>
                      </div>
                    </td>

                    {/* Empreendimento */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-300">
                          {agendamento.empreendimento}
                        </span>
                      </div>
                    </td>

                    {/* SDR */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: sdrColor?.primary || '#64748b' }}
                        />
                        <span className="text-sm text-slate-300">
                          {agendamento.sdr_nome}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                        ${status.color}
                      `}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {agendamentos.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400">Nenhum agendamento para hoje</p>
          </div>
        )}
      </div>
    </div>
  )
}
