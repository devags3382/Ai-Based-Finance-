import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { downloadMonthlyReport, getMonthlyReport } from '../services/reportService'
import { formatCurrency, formatDate } from '../utils/format'

const categoryIcons = {
  Salary: '💼',
  Freelance: '💻',
  Food: '🍔',
  Rent: '🏠',
  Transport: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Bills: '⚡',
  Healthcare: '🏥',
  Education: '📚',
  Investments: '📈',
  Other: '🏷️'
}

// Custom High-Contrast Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 p-3.5 text-white shadow-2xl backdrop-blur-md">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-black text-white">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

function Reports() {
  const now = new Date()
  const [period, setPeriod] = useState({ month: now.getMonth() + 1, year: now.getFullYear() })
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  const params = useMemo(() => period, [period])

  useEffect(() => {
    setLoading(true)
    setError('')
    getMonthlyReport(params)
      .then((response) => setReport(response.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load report'))
      .finally(() => setLoading(false))
  }, [params])

  const exportPdf = async () => {
    try {
      setExporting(true)
      const response = await downloadMonthlyReport(params)
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `finance-report-${period.year}-${String(period.month).padStart(2, '0')}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to download PDF report. ' + (err.message || ''))
    } finally {
      setExporting(false)
    }
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Financial Statements & Reports</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Audit periodic statements, category expenditures, and download PDF dossiers.</p>
        </div>
        <button
          onClick={exportPdf}
          disabled={exporting || loading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white font-black px-5 py-3 rounded-2xl shadow-lg shadow-slate-900/25 text-xs sm:text-sm uppercase tracking-wider disabled:opacity-50 transition-all duration-200"
        >
          <span>📄</span>
          <span>{exporting ? 'Compiling PDF...' : 'Download Official PDF Report'}</span>
        </button>
      </div>

      {/* Period Selection Bar */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-center">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">Statement Month</label>
            <select
              value={period.month}
              onChange={(e) => setPeriod({ ...period, month: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((m, index) => (
                <option key={index + 1} value={index + 1}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">Statement Year</label>
            <input
              type="number"
              value={period.year}
              onChange={(e) => setPeriod({ ...period, year: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-1 pt-4 text-xs font-bold text-slate-600">
            Active Dossier: <span className="text-slate-950 font-black">{months[period.month - 1]} {period.year}</span>
          </div>
        </div>
      </section>

      {loading && (
        <div className="py-16 text-center text-slate-400">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-bold text-slate-800 text-sm">Compiling monthly statement...</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-sm font-bold text-rose-900 shadow-sm">
          ⚠️ {error}
        </div>
      )}

      {report && !loading && (
        <>
          {/* 4 Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Period Income</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">{formatCurrency(report.totalIncome)}</p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-wider text-rose-800">Period Expense</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-950 mt-1">{formatCurrency(report.totalExpense)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">Period Savings</p>
              <p className={`text-2xl sm:text-3xl font-black mt-1 ${report.savings >= 0 ? 'text-slate-900' : 'text-rose-700'}`}>
                {formatCurrency(report.savings)}
              </p>
            </div>
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-wider text-sky-800">Budget Remaining</p>
              <p className="text-2xl sm:text-3xl font-black text-sky-950 mt-1">{formatCurrency(report.budgetRemaining)}</p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {/* Category Analytics Chart with High-Contrast Dark Text */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    Category Outflow Analytics
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Expenditures by category for {months[period.month - 1]} {period.year}</p>
                </div>
              </div>
              <div className="h-80">
                {report.categoryBreakdown?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.categoryBreakdown} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="category"
                        stroke="#0f172a"
                        tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
                      />
                      <YAxis
                        stroke="#0f172a"
                        tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
                        tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" name="Category Expense" fill="#2563eb" radius={[8, 8, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400 text-sm font-semibold">
                    No expense records found for this period.
                  </div>
                )}
              </div>
            </section>

            {/* Transactions List */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">Period Ledger</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Items in {months[period.month - 1]}</p>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700">
                    {report.transactions?.length || 0} Records
                  </span>
                </div>

                <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                  {report.transactions?.length ? (
                    report.transactions.map((item) => {
                      const icon = categoryIcons[item.category] || '🏷️'
                      const isIncome = item.type === 'income'

                      return (
                        <div
                          key={item._id}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3 hover:bg-white hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base">{icon}</span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 text-xs truncate">{item.title}</p>
                              <p className="text-[10px] font-semibold text-slate-500">{item.category} • {formatDate(item.transactionDate)}</p>
                            </div>
                          </div>
                          <p className={`font-black text-xs shrink-0 ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                          </p>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs font-bold">
                      No transactions recorded in this month.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 text-xs font-bold text-slate-500 text-center">
                PDF Export includes complete categorization breakdown & itemized ledger.
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  )
}

export default Reports