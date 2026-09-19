import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function Navbar() {
  const { user } = useSelector(state => state.auth)

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/90 sticky top-0 z-20 px-6 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100/90 border border-slate-200/80 rounded-full text-xs font-bold text-slate-700">
            <span>📅</span>
            <span>{currentDate}</span>
          </div>

        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/transactions"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100/80 rounded-xl text-xs font-extrabold transition-colors shadow-sm"
          >
            <span>➕</span>
            <span className="hidden sm:inline">Add Entry</span>
          </Link>

          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-3 pl-2 pr-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left">
                <p className="font-extrabold text-xs text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {user.name}
                </p>
                <p className="text-[11px] font-semibold text-slate-500 leading-tight">
                  {user.email}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar