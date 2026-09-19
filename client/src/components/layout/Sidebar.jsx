import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'

function Sidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊', badge: 'Overview' },
    { label: 'Transactions', path: '/transactions', icon: '💳', badge: 'Ledger' },
    { label: 'Budget & Limits', path: '/budget', icon: '🎯', badge: 'Caps' },
    { label: 'AI Insights', path: '/insights', icon: '✨', badge: 'GPT-4o' },
    { label: 'Monthly Reports', path: '/reports', icon: '📄', badge: 'PDF' },
    { label: 'Profile & Security', path: '/profile', icon: '👤', badge: 'Account' }
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-slate-950 text-white h-screen flex flex-col shadow-2xl z-30 border-r border-slate-800 select-none shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            F
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-black tracking-tight text-white">FinTrack</h1>
              <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-400/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold tracking-wide">AI Personal Finance</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 px-3 pb-2 pt-1">
          Menu Navigation
        </p>
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 group ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
              }`}>
                {item.badge}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer / System Status & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/60">
        <div className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-300">Live Backend</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500">v2.4.0</span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar