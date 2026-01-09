import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, Tooltip } from 'recharts'
import type { Agendamento, SDRMeta, SDRName } from './lib/supabase'
import { 
  SDRS, 
  SDR_CONFIG,
  getMockData,
  getAgendamentosHoje,
  getMetasSDR,
  getTotalAgendamentosMes,
  criarAgendamento
} from './lib/supabase'

// Sons de comemoração
import somLucas from './sounds/Lucas.mp4'
import somDuda from './sounds/Duda.mp4'

const USE_MOCK_DATA = false

// Mapeamento de sons por SDR
const SONS_SDR: Record<string, string> = {
  'Lucas': somLucas,
  'Maria Eduarda': somDuda,
}

// Função para tocar som de comemoração
function tocarSomComemoracao(sdrNome: string) {
  const somUrl = SONS_SDR[sdrNome]
  if (somUrl) {
    const audio = new Audio(somUrl)
    audio.volume = 0.7
    audio.play().catch(err => console.log('Erro ao tocar áudio:', err))
  }
}

// Componente de Confetes para comemoração
function Confetti({ sdrNome }: { sdrNome: string }) {
  const config = SDR_CONFIG[sdrNome as SDRName] || SDR_CONFIG['Lucas']
  const displayName = sdrNome === 'Maria Eduarda' ? 'Duda' : sdrNome
  
  return (
    <div className="confetti-overlay">
      <div className="confetti-container">
        {/* Confetes animados */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: i % 3 === 0 ? config.primary : i % 3 === 1 ? '#fbbf24' : '#34d399',
            }}
          />
        ))}
        
        {/* Mensagem de sucesso */}
        <div className="celebration-message">
          <div className="celebration-emoji">🎉</div>
          <h2 className="celebration-title">Novo Agendamento!</h2>
          <p className="celebration-subtitle" style={{ color: config.primary }}>
            +1 para {displayName}
          </p>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [metas, setMetas] = useState<SDRMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [showCelebration, setShowCelebration] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const [acumuladoMensal, setAcumuladoMensal] = useState<Record<string, number>>({})

  async function loadData() {
    try {
      if (USE_MOCK_DATA) {
        const { mockAgendamentos, mockMetas, mockAcumuladoMensal } = getMockData()
        setAgendamentos(mockAgendamentos)
        setMetas(mockMetas)
        setAcumuladoMensal(mockAcumuladoMensal)
      } else {
        const [agendamentosData, metasData, agendamentosMes] = await Promise.all([
          getAgendamentosHoje(),
          getMetasSDR(),
          getTotalAgendamentosMes()
        ])
        setAgendamentos(agendamentosData)
        setMetas(metasData)
        
        // Calcular acumulado mensal por SDR
        const acumulado: Record<string, number> = {}
        SDRS.forEach(sdr => {
          acumulado[sdr] = agendamentosMes.filter(a => a.sdr_nome === sdr).length
        })
        setAcumuladoMensal(acumulado)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      const { mockAgendamentos, mockMetas, mockAcumuladoMensal } = getMockData()
      setAgendamentos(mockAgendamentos)
      setMetas(mockMetas)
      setAcumuladoMensal(mockAcumuladoMensal)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddAgendamento(sdrNome: string) {
    setShowForm(false)
    
    // Mostrar comemoração visual! 🎉
    setShowCelebration(sdrNome)
    setTimeout(() => setShowCelebration(null), 3000) // Esconde após 3 segundos
    
    // Tocar som de comemoração! 🔊
    tocarSomComemoracao(sdrNome)
    
    try {
      if (USE_MOCK_DATA) {
        // Modo mock: apenas adiciona ao estado local
        const hoje = new Date().toISOString().split('T')[0]
        const agendamento: Agendamento = {
          id: String(Date.now()),
          sdr_nome: sdrNome,
          cliente_nome: 'Cliente',
          data_agendamento: hoje,
          hora_agendamento: format(new Date(), 'HH:mm'),
          status: 'agendado',
          empreendimento: 'Não informado',
          created_at: new Date().toISOString()
        }
        setAgendamentos(prev => [...prev, agendamento])
        // Atualiza o acumulado mensal
        setAcumuladoMensal(prev => ({
          ...prev,
          [sdrNome]: (prev[sdrNome] || 0) + 1
        }))
      } else {
        // Modo produção: salva no Supabase
        const novoAgendamento = await criarAgendamento(sdrNome)
        console.log('Agendamento criado:', novoAgendamento)
        
        // Adiciona ao estado local
        setAgendamentos(prev => [...prev, novoAgendamento])
        
        // Atualiza o acumulado mensal
        setAcumuladoMensal(prev => ({
          ...prev,
          [sdrNome]: (prev[sdrNome] || 0) + 1
        }))
      }
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error)
      alert('Erro ao salvar agendamento. Verifique o console.')
    }
  }

  const totalAgendamentos = agendamentos.length

  const metasPorSDR: Record<string, number> = {}
  metas.forEach(m => {
    metasPorSDR[m.sdr_nome] = m.meta_diaria
  })

  const metaTotalDia = metas.reduce((acc, m) => acc + m.meta_diaria, 0)
  
  // Total acumulado no mês (soma de todos os SDRs)
  const totalAcumuladoMes = Object.values(acumuladoMensal).reduce((acc, val) => acc + val, 0)
  const metaTotalMes = metas.reduce((acc, m) => acc + (m.meta_mensal || 120), 0) // 360 total (120 x 3)

  // Dados para o gráfico de barras - Progresso Mensal
  const diaAtual = new Date().getDate()
  const diasNoMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  
  const chartDataMensal = SDRS.map(sdr => {
    const metaMensal = metas.find(m => m.sdr_nome === sdr)?.meta_mensal || 120
    const acumulado = acumuladoMensal[sdr] || 0
    
    // Quanto deveria ter acumulado até hoje para estar na meta
    const esperadoAteHoje = Math.round((metaMensal / diasNoMes) * diaAtual)
    
    // Projeção: se continuar nesse ritmo, quanto vai fazer no mês
    const mediaDiaria = diaAtual > 0 ? acumulado / diaAtual : 0
    const projecaoMensal = Math.round(mediaDiaria * diasNoMes)
    
    // Está no ritmo? (acumulado >= esperado)
    const noRitmo = acumulado >= esperadoAteHoje
    
    return {
      name: sdr === 'Maria Eduarda' ? 'Duda' : sdr,
      acumulado,
      esperado: esperadoAteHoje,
      metaMensal,
      projecao: projecaoMensal,
      noRitmo,
      color: SDR_CONFIG[sdr as SDRName].primary
    }
  })

  // Dados para o gráfico de pizza por SDR (mostra todos, mesmo com zero)
  const pieData = SDRS.map(sdr => {
    const total = agendamentos.filter(a => a.sdr_nome === sdr).length
    return {
      name: sdr === 'Maria Eduarda' ? 'Duda' : sdr,
      value: total,
      // Valor visual mínimo para mostrar fatia mesmo com zero
      displayValue: total === 0 ? 0.3 : total,
      color: total === 0 ? `${SDR_CONFIG[sdr as SDRName].primary}40` : SDR_CONFIG[sdr as SDRName].primary
    }
  })

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header - Otimizado para TV */}
      <header className="header">
        <div className="header-content">
          <button className="add-button" onClick={() => setShowForm(true)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Novo Agendamento
          </button>
          <div className="header-time">
            <span className="current-date">
              {format(currentTime, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </span>
            <span className="current-time">
              {format(currentTime, 'HH:mm')}
            </span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Stats Overview */}
        <section className="stats-section">
          <div className="stats-grid stats-grid-5">
            <div className="stat-card stat-card-highlight">
              <span className="stat-label">Total Acumulado</span>
              <span className="stat-value stat-accent">{totalAcumuladoMes}</span>
              <span className="stat-desc">no mês ({metaTotalMes} meta)</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total do Dia</span>
              <span className="stat-value">{totalAgendamentos}</span>
              <span className="stat-desc">agendamentos</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Meta do Dia</span>
              <span className="stat-value">{metaTotalDia}</span>
              <span className="stat-desc">esperados</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Progresso</span>
              <span className={`stat-value ${totalAgendamentos >= metaTotalDia ? 'stat-success' : 'stat-warning'}`}>
                {metaTotalDia > 0 ? Math.round((totalAgendamentos / metaTotalDia) * 100) : 0}%
              </span>
              <span className="stat-desc">da meta diária</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Faltam</span>
              <span className="stat-value">{Math.max(0, metaTotalDia - totalAgendamentos)}</span>
              <span className="stat-desc">para a meta</span>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="charts-section">
          <div className="charts-grid">
            {/* Gráfico de Barras - Progresso Mensal */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Progresso Mensal</h3>
                <span className="chart-subtitle">Acumulado vs Esperado (Meta: 120/mês por SDR)</span>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDataMensal} barGap={8}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#71717a', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: '#71717a', fontSize: 12 }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="chart-tooltip">
                              <p className="tooltip-title">{data.name}</p>
                              <p className="tooltip-line">
                                <span className="tooltip-dot" style={{ background: data.color }}></span>
                                Acumulado: <strong>{data.acumulado}</strong>
                              </p>
                              <p className="tooltip-line">
                                <span className="tooltip-dot" style={{ background: '#3f3f46' }}></span>
                                Esperado: <strong>{data.esperado}</strong>
                              </p>
                              <p className="tooltip-line">
                                Projeção: <strong>{data.projecao}/{data.metaMensal}</strong>
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Bar dataKey="acumulado" radius={[6, 6, 0, 0]} maxBarSize={50}>
                      {chartDataMensal.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                    <Bar dataKey="esperado" radius={[6, 6, 0, 0]} maxBarSize={50} fill="#3f3f46" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="monthly-status">
                {chartDataMensal.map(sdr => (
                  <div key={sdr.name} className={`status-item ${sdr.noRitmo ? 'on-track' : 'behind'}`}>
                    <span className="status-name">{sdr.name}</span>
                    <span className={`status-badge ${sdr.noRitmo ? 'badge-on-track' : 'badge-behind'} has-tooltip`}>
                      {sdr.noRitmo ? '✓ No ritmo' : '⚠ Abaixo'}
                      <span className="custom-tooltip">
                        <span className="tooltip-title">{sdr.name}</span>
                        <span className="tooltip-line">
                          <span className={`tooltip-status ${sdr.noRitmo ? 'status-ok' : 'status-warn'}`}>
                            {sdr.noRitmo ? '✅ No ritmo!' : '⚠️ Abaixo do ritmo'}
                          </span>
                        </span>
                        <span className="tooltip-line">
                          📊 Acumulado: <strong>{sdr.acumulado}</strong>
                        </span>
                        <span className="tooltip-line">
                          🎯 Esperado (dia {diaAtual}): <strong>{sdr.esperado}</strong>
                        </span>
                        <span className="tooltip-line">
                          {sdr.noRitmo 
                            ? `Está ${sdr.acumulado - sdr.esperado} à frente!` 
                            : `Faltam ${sdr.esperado - sdr.acumulado} para o ritmo`}
                        </span>
                      </span>
                    </span>
                    <span className="status-projection has-tooltip">
                      Projeção: {sdr.projecao}/{sdr.metaMensal}
                      <span className="custom-tooltip">
                        <span className="tooltip-title">Projeção Mensal</span>
                        <span className="tooltip-line">
                          📈 Se mantiver o ritmo atual:
                        </span>
                        <span className="tooltip-line projection-value">
                          <strong>{sdr.projecao}</strong> de {sdr.metaMensal}
                        </span>
                        <span className="tooltip-line">
                          {sdr.projecao >= sdr.metaMensal 
                            ? '🎉 Vai bater a meta!' 
                            : `😔 Ficará ${sdr.metaMensal - sdr.projecao} abaixo`}
                        </span>
                      </span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#a78bfa' }}></span>
                  <span>Acumulado</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#3f3f46' }}></span>
                  <span>Esperado até dia {diaAtual}</span>
                </div>
              </div>
            </div>

            {/* Gráfico de Pizza - Distribuição por SDR */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Distribuição</h3>
                <span className="chart-subtitle">Agendamentos por SDR</span>
              </div>
              <div className="chart-container pie-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="displayValue"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke={entry.value === 0 ? 'rgba(255,255,255,0.1)' : 'none'}
                          strokeWidth={entry.value === 0 ? 1 : 0}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-center">
                  <span className="pie-total">{totalAgendamentos}</span>
                  <span className="pie-label">Total</span>
                </div>
              </div>
              <div className="chart-legend">
                {pieData.map((item, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-dot" style={{ background: item.color }}></span>
                    <span>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Card de Previsibilidade Mensal */}
        <section className="forecast-section">
          <div className="forecast-grid">
            {chartDataMensal.map(sdr => {
              const diasRestantes = diasNoMes - diaAtual
              const faltaParaMeta = sdr.metaMensal - sdr.acumulado
              const precisaPorDia = diasRestantes > 0 ? Math.ceil(faltaParaMeta / diasRestantes) : 0
              const percentMeta = Math.round((sdr.acumulado / sdr.metaMensal) * 100)
              
              return (
                <div key={sdr.name} className={`forecast-card ${sdr.noRitmo ? 'on-track' : 'behind'}`}>
                  <div className="forecast-header">
                    <span className="forecast-name">{sdr.name}</span>
                    <span className={`forecast-status ${sdr.noRitmo ? 'status-ok' : 'status-warn'}`}>
                      {sdr.noRitmo ? '✅ No ritmo' : '⚠️ Abaixo'}
                    </span>
                  </div>
                  
                  <div className="forecast-progress">
                    <div className="forecast-progress-bar">
                      <div 
                        className="forecast-progress-fill"
                        style={{ 
                          width: `${Math.min(100, percentMeta)}%`,
                          background: sdr.color
                        }}
                      />
                      <div 
                        className="forecast-progress-expected"
                        style={{ left: `${Math.round((sdr.esperado / sdr.metaMensal) * 100)}%` }}
                      />
                    </div>
                    <div className="forecast-progress-labels">
                      <span>{sdr.acumulado}</span>
                      <span className="forecast-meta">Meta: {sdr.metaMensal}</span>
                    </div>
                  </div>

                  <div className="forecast-stats">
                    <div className="forecast-stat">
                      <span className="forecast-stat-value">{sdr.acumulado}</span>
                      <span className="forecast-stat-label">Acumulado</span>
                    </div>
                    <div className="forecast-stat">
                      <span className="forecast-stat-value">{sdr.esperado}</span>
                      <span className="forecast-stat-label">Esperado</span>
                    </div>
                    <div className="forecast-stat">
                      <span className="forecast-stat-value" style={{ color: sdr.color }}>{sdr.projecao}</span>
                      <span className="forecast-stat-label">Projeção</span>
                    </div>
                    <div className="forecast-stat">
                      <span className={`forecast-stat-value ${precisaPorDia > 6 ? 'text-warning' : 'text-success'}`}>
                        {precisaPorDia}/dia
                      </span>
                      <span className="forecast-stat-label">Precisa</span>
                    </div>
                  </div>

                  <div className="forecast-footer">
                    {sdr.noRitmo ? (
                      <span className="forecast-message success">
                        🎯 {sdr.acumulado - sdr.esperado > 0 ? `${sdr.acumulado - sdr.esperado} à frente do esperado!` : 'No ritmo para a meta!'}
                      </span>
                    ) : (
                      <span className="forecast-message warning">
                        ⚡ Faltam {sdr.esperado - sdr.acumulado} para alcançar o ritmo
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* SDR Performance */}
        <section className="performance-section">
          <div className="sdr-grid">
            {SDRS.map((sdr) => (
              <SDRCard
                key={sdr}
                nome={sdr as SDRName}
                agendamentos={agendamentos.filter(a => a.sdr_nome === sdr)}
                metaDiaria={metasPorSDR[sdr] || 6}
                acumuladoMes={acumuladoMensal[sdr] || 0}
                metaMensal={metas.find(m => m.sdr_nome === sdr)?.meta_mensal || 120}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Dashboard SDR — Grupo IM Construtora</span>
        <span>Atualização automática a cada 30s</span>
      </footer>

      {/* Modal de Novo Agendamento - Simplificado */}
      {showForm && (
        <AgendamentoForm 
          onClose={() => setShowForm(false)}
          onSubmit={handleAddAgendamento}
        />
      )}

      {/* Animação de Comemoração */}
      {showCelebration && <Confetti sdrNome={showCelebration} />}
    </div>
  )
}

function SDRCard({ nome, agendamentos, metaDiaria, acumuladoMes, metaMensal }: {
  nome: SDRName
  agendamentos: Agendamento[]
  metaDiaria: number
  acumuladoMes: number
  metaMensal: number
}) {
  const config = SDR_CONFIG[nome]
  const total = agendamentos.length
  const progressPercent = (total / metaDiaria) * 100
  const progressBar = Math.min(progressPercent, 100)
  const metaAtingida = total >= metaDiaria
  const ultrapassouMeta = total > metaDiaria
  const displayName = nome === 'Maria Eduarda' ? 'Duda' : nome

  // Calcular média necessária para meta mensal
  const diaAtual = new Date().getDate()
  const diasNoMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  const diasRestantes = diasNoMes - diaAtual
  const faltaParaMeta = Math.max(0, metaMensal - acumuladoMes)
  const mediaNecessaria = diasRestantes > 0 ? Math.ceil(faltaParaMeta / diasRestantes) : 0
  const noRitmo = total >= mediaNecessaria

  return (
    <div className="sdr-card">
      <div className="sdr-header">
        <img 
          src={config.image} 
          alt={nome}
          className="sdr-photo"
        />
        <div className="sdr-info">
          <h3 className="sdr-name">{displayName}</h3>
          {ultrapassouMeta && <span className="meta-badge meta-exceeded">+{total - metaDiaria} além da meta!</span>}
          {metaAtingida && !ultrapassouMeta && <span className="meta-badge">Meta atingida!</span>}
        </div>
      </div>

      <div className="sdr-progress">
        <div className="progress-header">
          <div className="progress-numbers">
            <span className="progress-current">{total}</span>
            <span className="progress-separator">/</span>
            <span className="progress-total">{metaDiaria}</span>
          </div>
          <span className="progress-label">agendamentos</span>
          <span className={`daily-target ${noRitmo ? 'on-track' : 'behind'} has-tooltip`}>
            {noRitmo ? '✓' : '⚠'} precisa {mediaNecessaria}/dia
            <span className="custom-tooltip tooltip-left">
              <span className="tooltip-title">{displayName}</span>
              <span className="tooltip-line">
                <span className={`tooltip-status ${noRitmo ? 'status-ok' : 'status-warn'}`}>
                  {noRitmo ? '✅ No ritmo para a meta!' : '⚠️ Precisa acelerar!'}
                </span>
              </span>
              <span className="tooltip-line">
                📊 Acumulado no mês: <strong>{acumuladoMes}/{metaMensal}</strong>
              </span>
              <span className="tooltip-line">
                📅 Dias restantes: <strong>{diasRestantes}</strong>
              </span>
              <span className="tooltip-line">
                🎯 Precisa fazer: <strong>{mediaNecessaria}/dia</strong>
              </span>
              <span className="tooltip-line">
                💡 Meta diária normal: <strong>{metaDiaria}</strong>
              </span>
            </span>
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${ultrapassouMeta ? 'exceeded' : ''}`}
            style={{ width: `${progressBar}%`, background: config.primary }}
          />
        </div>
        <span className="progress-percent">{Math.round(progressPercent)}% da meta diária</span>
      </div>

      <div className="sdr-count">
        <span className="count-value" style={{ color: config.primary }}>{total}</span>
        <span className="count-label">Agendados hoje</span>
      </div>
    </div>
  )
}

function AgendamentoForm({ onClose, onSubmit }: {
  onClose: () => void
  onSubmit: (sdrNome: string) => void
}) {
  const [selectedSDR, setSelectedSDR] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSDR) return
    onSubmit(selectedSDR)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-simple" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Novo Agendamento</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <p className="form-instruction">Selecione o SDR responsável:</p>
          
          <div className="sdr-select-grid">
            {SDRS.map(sdr => {
              const config = SDR_CONFIG[sdr as SDRName]
              const displayName = sdr === 'Maria Eduarda' ? 'Duda' : sdr
              const isSelected = selectedSDR === sdr
              
              return (
                <button
                  key={sdr}
                  type="button"
                  className={`sdr-select-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedSDR(sdr)}
                  style={{ 
                    borderColor: isSelected ? config.primary : 'transparent',
                    background: isSelected ? `${config.primary}15` : 'var(--bg-elevated)'
                  }}
                >
                  <img 
                    src={config.image} 
                    alt={sdr}
                    className="sdr-select-photo"
                  />
                  <span className="sdr-select-name">{displayName}</span>
                </button>
              )
            })}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={!selectedSDR}
            >
              Adicionar
        </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
