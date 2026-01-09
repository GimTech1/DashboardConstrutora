import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  subtitle?: string
  icon: ReactNode
  trend?: number
  color?: 'primary' | 'emerald' | 'amber' | 'rose'
  delay?: number
}

const colorVariants = {
  primary: {
    iconBg: 'bg-primary-500/10',
    iconColor: 'text-primary-400',
    glow: 'shadow-primary-500/10',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
  rose: {
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-400',
    glow: 'shadow-rose-500/10',
  },
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color = 'primary',
  delay = 0 
}: StatsCardProps) {
  const colors = colorVariants[color]
  
  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-3 h-3" />
    return trend > 0 
      ? <TrendingUp className="w-3 h-3" /> 
      : <TrendingDown className="w-3 h-3" />
  }

  const getTrendColor = () => {
    if (!trend) return 'text-slate-400 bg-slate-400/10'
    return trend > 0 
      ? 'text-emerald-400 bg-emerald-400/10' 
      : 'text-rose-400 bg-rose-400/10'
  }

  return (
    <div 
      className="relative group animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Card */}
      <div className={`
        relative overflow-hidden rounded-2xl p-6
        glass card-hover gradient-border
        ${colors.glow}
      `}>
        {/* Background decoration */}
        <div className={`
          absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20
          ${color === 'primary' ? 'bg-primary-500' : ''}
          ${color === 'emerald' ? 'bg-emerald-500' : ''}
          ${color === 'amber' ? 'bg-amber-500' : ''}
          ${color === 'rose' ? 'bg-rose-500' : ''}
        `} />
        
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-400 mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-white counter">
                {value}
              </span>
              {trend !== undefined && (
                <span className={`
                  inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                  ${getTrendColor()}
                `}>
                  {getTrendIcon()}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Icon */}
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${colors.iconBg} ${colors.iconColor}
          `}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}
