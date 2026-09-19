function SummaryCard({ label, value, tone = 'slate', subtext = '', icon = '💳' }) {
  const configs = {
    slate: {
      cardBg: 'bg-white border-slate-200/80 shadow-sm hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900',
      tagBg: 'bg-slate-100 text-slate-700',
      borderAccent: 'from-slate-400 to-slate-600'
    },
    green: {
      cardBg: 'bg-white border-emerald-200/80 shadow-sm shadow-emerald-500/5 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      valueColor: 'text-emerald-700',
      tagBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
      borderAccent: 'from-emerald-400 to-teal-500'
    },
    red: {
      cardBg: 'bg-white border-rose-200/80 shadow-sm shadow-rose-500/5 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      valueColor: 'text-rose-700',
      tagBg: 'bg-rose-50 text-rose-700 border border-rose-200/60',
      borderAccent: 'from-rose-400 to-red-500'
    },
    blue: {
      cardBg: 'bg-white border-blue-200/80 shadow-sm shadow-blue-500/5 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      valueColor: 'text-blue-700',
      tagBg: 'bg-blue-50 text-blue-700 border border-blue-200/60',
      borderAccent: 'from-blue-500 to-indigo-600'
    }
  }

  const current = configs[tone] || configs.slate

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${current.cardBg}`}>
      {/* Top accent gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${current.borderAccent}`} />
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className={`mt-2 text-2xl lg:text-3xl font-black tracking-tight ${current.valueColor}`}>
            {value}
          </p>
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm ${current.iconBg}`}>
          {icon}
        </div>
      </div>

      {subtext && (
        <div className="mt-3.5 flex items-center gap-2">
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${current.tagBg}`}>
            {subtext}
          </span>
        </div>
      )}
    </div>
  )
}

export default SummaryCard
