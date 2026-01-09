import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Agendamento, SDRName } from '../lib/supabase'
import { SDRS, SDR_COLORS } from '../lib/supabase'

interface ProgressChartProps {
  agendamentos: Agendamento[]
  metas: Record<string, number>
}

export function ProgressChart({ agendamentos, metas }: ProgressChartProps) {
  const data = SDRS.map(sdr => {
    const sdrAgendamentos = agendamentos.filter(a => a.sdr_nome === sdr)
    const realizados = sdrAgendamentos.filter(a => a.status === 'realizado').length
    const meta = metas[sdr] || 6
    
    return {
      name: sdr.split(' ')[0], // Primeiro nome apenas
      realizados,
      meta,
      percentual: Math.round((realizados / meta) * 100),
      color: SDR_COLORS[sdr as SDRName].primary,
    }
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="glass rounded-lg p-3 border border-slate-700/50">
          <p className="text-sm font-medium text-white mb-1">{item.name}</p>
          <p className="text-xs text-slate-400">
            Realizados: <span className="text-white font-medium">{item.realizados}</span>
          </p>
          <p className="text-xs text-slate-400">
            Meta: <span className="text-white font-medium">{item.meta}</span>
          </p>
          <p className="text-xs text-slate-400">
            Progresso: <span className="text-emerald-400 font-medium">{item.percentual}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
      <div className="rounded-2xl glass gradient-border p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Desempenho por SDR
          </h2>
          <p className="text-sm text-slate-400">
            Agendamentos realizados vs meta diária
          </p>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#1e293b" 
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Bar 
                dataKey="realizados" 
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-800/50">
          {SDRS.map(sdr => (
            <div key={sdr} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: SDR_COLORS[sdr].primary }}
              />
              <span className="text-sm text-slate-400">{sdr}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
