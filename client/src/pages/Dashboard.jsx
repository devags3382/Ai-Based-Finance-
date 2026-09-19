import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import SummaryCard from '../components/dashboard/SummaryCard'
import { getDashboardSummary } from '../services/dashboardService'
import { formatCurrency, formatDate } from '../utils/format'

const CATEGORY_COLORS = [
  '#2563eb', // Blue
  '#059669', // Emerald
  '#d97706', // Amber
  '#dc2626', // Red
  '#7c3aed', // Purple
  '#0891b2', // Cyan
  '#db2777', // Pink
  '#ea580c'  // Orange
]

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
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center justify-between gap-4 text-xs py-0.5">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color || entry.fill || '#93c5fd' }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill || '#93c5fd' }} />
              {entry.name || 'Value'}:
            </span>
            <span className="font-bold text-white text-sm">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardSummary()
      .then((response) => setSummary(response.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-base font-bold text-slate-800">Synthesizing Financial Intel...</p>
        <p className="text-xs text-slate-500 mt-1">Aggregating transactions, budgets, and predictive metrics</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800 shadow-sm">
        <h3 className="font-bold text-lg mb-1">Unable to Load Dashboard</h3>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  const trend = summary?.monthlyTrend || []
  const categories = summary?.categoryBreakdown || []
  const totalExpenses = summary?.totalExpense || 0
  const incomeExpense = trend.map((item) => ({
    month: item.month,
    Income: item.income,
    Expense: item.expense
  }))

  const topCategory = categories[0]
  const savingsRate = summary.totalIncome > 0
    ? Math.round((summary.savings / summary.totalIncome) * 100)
    : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner with Quick Actions */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-bold tracking-wide uppercase">
                Active Cycle
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Wealth & Cashflow Dashboard
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              {summary.savings >= 0
                ? `You're in healthy financial standing with a ${savingsRate}% net savings rate this period.`
                : 'Expenses currently exceed incoming cashflow. Check category budgets and recommendations below.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/transactions"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 text-xs sm:text-sm transition-all duration-200"
            >
              <span>➕</span>
              <span>New Entry</span>
            </Link>
            <Link
              to="/budget"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm backdrop-blur-sm transition-all duration-200"
            >
              <span>🎯</span>
              <span>Set Limits</span>
            </Link>
            <Link
              to="/insights"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/20 text-xs sm:text-sm transition-all duration-200"
            >
              <span>✨</span>
              <span>AI Insights</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards with Enhanced Contrast & Visual Accents */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Income"
          value={formatCurrency(summary.totalIncome)}
          tone="green"
          subtext="Verified Inflows"
          icon="📈"
        />
        <SummaryCard
          label="Total Expense"
          value={formatCurrency(summary.totalExpense)}
          tone="red"
          subtext="Recorded Outflows"
          icon="📉"
        />
        <SummaryCard
          label="Remaining Budget"
          value={formatCurrency(summary.budgetRemaining)}
          tone={summary.budgetRemaining >= 0 ? 'blue' : 'red'}
          subtext={summary.monthlyBudget > 0 ? `Cap: ${formatCurrency(summary.monthlyBudget)}` : 'No Cap Configured'}
          icon="🎯"
        />
        <SummaryCard
          label="Net Savings"
          value={formatCurrency(summary.savings)}
          tone={summary.savings >= 0 ? 'green' : 'red'}
          subtext={summary.savings >= 0 ? `+${savingsRate}% of Income` : 'Deficit Recorded'}
          icon="💰"
        />
      </div>

      {/* Primary Visual Analytics Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Monthly Spending Trend Area Chart */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Monthly Spending Trajectory
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Historical expense trend by chronological billing cycle</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-xs font-extrabold">
                Expense Area
              </span>
            </div>
          </div>

          <div className="h-80">
            {trend.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#0f172a"
                    tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
                  />
                  <YAxis
                    stroke="#0f172a"
                    tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Monthly Expense"
                    stroke="#dc2626"
                    strokeWidth={3.5}
                    fillOpacity={1}
                    fill="url(#expenseGradient)"
                    dot={{ r: 5, fill: '#dc2626', stroke: '#ffffff', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#991b1b', stroke: '#ffffff', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm font-semibold">
                No expense data recorded yet.
              </div>
            )}
          </div>
        </section>

        {/* Category Distribution with Rich Legend List & High Contrast Text */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Category Breakdown
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Where your money goes</p>
              </div>
              {topCategory && (
                <span className="text-[11px] font-extrabold px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg">
                  Top: {topCategory.category}
                </span>
              )}
            </div>

            {/* Donut Chart */}
            <div className="h-56 relative flex items-center justify-center">
              {categories.length ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        dataKey="amount"
                        nameKey="category"
                        innerRadius={60}
                        outerRadius={88}
                        paddingAngle={3}
                      >
                        {categories.map((entry, index) => (
                          <Cell
                            key={`cell-${entry.category}`}
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Donut Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Total Spent</span>
                    <span className="text-base font-black text-slate-900">{formatCurrency(totalExpenses)}</span>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm font-semibold">
                  No categorized expenses recorded yet.
                </div>
              )}
            </div>

            {/* Clear High-Contrast Category List with Percentages & Dark Bold Values */}
            <div className="mt-4 space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {categories.map((item, index) => {
                const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
                const share = totalExpenses > 0 ? Math.round((item.amount / totalExpenses) * 100) : 0
                const icon = categoryIcons[item.category] || '🏷️'

                return (
                  <div
                    key={item.category}
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{icon}</span>
                        <span className="font-bold text-xs text-slate-900">{item.category}</span>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">
                          {formatCurrency(item.amount)}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-black text-white"
                          style={{ backgroundColor: color }}
                        >
                          {share}%
                        </span>
                      </div>
                    </div>
                    {/* Mini progress indicator */}
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${share}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] font-bold text-slate-500 text-center">
            {categories.length} Spending Categories Active
          </div>
        </section>
      </div>

      {/* Secondary Row: Income vs Expense & Recent Transactions */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Income vs Expense Bar Chart */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Income vs Expense Comparison
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Month-by-month inflow vs outflow breakdown</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-black">
              <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                <span className="w-2.5 h-2.5 rounded bg-rose-600" />
                Expense
              </span>
            </div>
          </div>

          <div className="h-80">
            {incomeExpense.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeExpense} margin={{ top: 15, right: 15, left: -10, bottom: 0 }} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#0f172a"
                    tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
                  />
                  <YAxis
                    stroke="#0f172a"
                    tick={{ fill: '#0f172a', fontSize: 12, fontWeight: 700 }}
                    tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Income" name="Total Income" fill="#059669" radius={[8, 8, 0, 0]} maxBarSize={45} />
                  <Bar dataKey="Expense" name="Total Expense" fill="#dc2626" radius={[8, 8, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm font-semibold">
                No comparative data available yet.
              </div>
            )}
          </div>
        </section>

        {/* Recent Transactions Card with Rich Category Icons & Bold Amounts */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  Recent Activity
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Latest recorded transactions</p>
              </div>
              <Link to="/transactions" className="text-xs font-extrabold text-blue-600 hover:text-blue-800 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {summary.recentTransactions?.length ? (
                summary.recentTransactions.map((item) => {
                  const icon = categoryIcons[item.category] || '🏷️'
                  const isIncome = item.type === 'income'

                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-3.5 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                          isIncome
                            ? 'bg-emerald-100/80 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-100/80 text-rose-700 border border-rose-200'
                        }`}>
                          {icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{item.title}</p>
                          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span>{item.category}</span>
                            <span>•</span>
                            <span>{formatDate(item.transactionDate)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-black text-sm ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-200/60 px-1.5 py-0.5 rounded">
                          {item.paymentMethod ? item.paymentMethod.replace('_', ' ') : 'card'}
                        </span>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-sm font-semibold">
                  No transactions logged yet. Click "+ New Entry" above.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Showing top 5 latest events</span>
            <Link to="/transactions" className="text-blue-600 hover:underline">
              Full Ledger →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard