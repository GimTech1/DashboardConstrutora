import { Calendar, Clock, Building2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function Header() {
  const hoje = new Date()
  const dataFormatada = format(hoje, "EEEE, dd 'de' MMMM", { locale: ptBR })
  const horaAtual = format(hoje, 'HH:mm')

  return (
    <header className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-950/50 via-slate-925 to-primary-950/50" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl" />
      
      <div className="relative px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo e título */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-925 live-indicator" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                Dashboard <span className="gradient-text">SDR</span>
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                Acompanhamento de Agendamentos
              </p>
            </div>
          </div>

          {/* Data e hora */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass">
              <Calendar className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-slate-200 capitalize">
                {dataFormatada}
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-slate-200 counter">
                {horaAtual}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
    </header>
  )
}
