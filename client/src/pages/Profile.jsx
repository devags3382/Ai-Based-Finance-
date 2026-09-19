import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileThunk } from '../redux/slices/authSlice'
import { changePassword, getAccountStats } from '../services/authService'
import { formatCurrency } from '../utils/format'

function Profile() {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [stats, setStats] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name || '', email: user.email || '' })
    }
    getAccountStats()
      .then((response) => setStats(response.data.data))
      .catch(() => {})
  }, [user])

  const saveProfile = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')
    setSavingProfile(true)
    try {
      await dispatch(updateProfileThunk(profile)).unwrap()
      setMessage('Profile credentials updated successfully.')
    } catch (err) {
      setError(err || 'Unable to update profile.')
    } finally {
      setSavingProfile(false)
    }
  }

  const savePassword = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (passwords.newPassword.length < 6) {
      setError('New password must contain at least 6 characters.')
      return
    }

    setSavingPassword(true)
    try {
      await changePassword(passwords)
      setPasswords({ currentPassword: '', newPassword: '' })
      setMessage('Account password changed successfully.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to change password.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{user?.name || 'Account User'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-300">{user?.email}</p>
          </div>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-900 flex items-center justify-between shadow-sm">
          <span>✅ {message}</span>
          <button onClick={() => setMessage('')} className="text-emerald-700 hover:text-emerald-950 font-black">✕</button>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-sm font-bold text-rose-900 flex items-center justify-between shadow-sm">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className="text-rose-700 hover:text-rose-950 font-black">✕</button>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Security & Details Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm xl:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Personal Information
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Update primary contact and display identity</p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
              >
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  Password & Security
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Ensure robust account protection</p>
              </div>
            </div>

            <form onSubmit={savePassword} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    minLength="6"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    placeholder="Min 6 characters"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md disabled:opacity-50 transition-all"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </section>

        {/* Aggregate Lifetime Stats */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Lifetime Statistics</h2>
            <p className="text-xs font-semibold text-slate-500 mb-6">Aggregated records across all cycles</p>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Total Entries</span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">Recorded Transactions</p>
                </div>
                <span className="text-xl font-black text-slate-900">{stats?.transactionCount || 0}</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Total Income</span>
                  <p className="text-xs font-bold text-emerald-700 mt-0.5">Cumulative Inflow</p>
                </div>
                <span className="text-xl font-black text-emerald-900">{formatCurrency(stats?.totalIncome)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-rose-800">Total Expense</span>
                  <p className="text-xs font-bold text-rose-700 mt-0.5">Cumulative Outflow</p>
                </div>
                <span className="text-xl font-black text-rose-900">{formatCurrency(stats?.totalExpense)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">Net Wealth Saved</span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">Accumulated Surplus</p>
                </div>
                <span className={`text-xl font-black ${stats?.savings >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
                  {formatCurrency(stats?.savings)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500 text-center">
            🔒 Account protected with 256-bit JWT authentication & bcrypt salting.
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile