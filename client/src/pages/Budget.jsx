import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudget, saveBudget } from '../redux/slices/budgetSlice'
import { getDashboardSummary } from '../services/dashboardService'
import { categories, formatCurrency } from '../utils/format'

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

function Budget() {
  const dispatch = useDispatch()
  const budget = useSelector(state => state.budget)
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [categoryBudgets, setCategoryBudgets] = useState([])
  const [summary, setSummary] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    dispatch(fetchBudget())
    getDashboardSummary()
      .then((response) => setSummary(response.data.data))
      .catch(() => {})
  }, [dispatch])

  useEffect(() => {
    if (budget.monthlyBudget !== undefined) {
      setMonthlyBudget(budget.monthlyBudget)
    }
    if (budget.categories) {
      setCategoryBudgets(budget.categories)
    }
  }, [budget.monthlyBudget, budget.categories])

  const addCategory = () => {
    setCategoryBudgets([...categoryBudgets, { category: 'Food', limit: 5000 }])
  }

  const updateCategory = (index, field, value) => {
    setCategoryBudgets(categoryBudgets.map((item, itemIndex) => (
      itemIndex === index
        ? { ...item, [field]: field === 'limit' ? (value === '' ? '' : Number(value)) : value }
        : item
    )))
  }

  const removeCategory = (index) => {
    setCategoryBudgets(categoryBudgets.filter((_, itemIndex) => itemIndex !== index))
  }

  const save = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      await dispatch(saveBudget({
        monthlyBudget: Number(monthlyBudget),
        categoryBudgets: categoryBudgets.map(item => ({
          category: item.category,
          limit: Number(item.limit || 0)
        }))
      })).unwrap()

      const response = await getDashboardSummary()
      setSummary(response.data.data)
      setMessage('Budget configuration saved successfully!')
    } catch (err) {
      console.error(err)
    }
  }

  const totalExpense = summary?.totalExpense || 0
  const remaining = Number(monthlyBudget || 0) - totalExpense
  const usedPercent = monthlyBudget > 0 ? Math.min(100, Math.round((totalExpense / Number(monthlyBudget)) * 100)) : 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Spending Caps & Budgets</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">Configure global monthly allowances and monitor category spending ceilings.</p>
        </div>
      </div>

      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-900 flex items-center justify-between shadow-sm">
          <span>✅ {message}</span>
          <button onClick={() => setMessage('')} className="text-emerald-700 hover:text-emerald-950 font-black">✕</button>
        </div>
      )}

      {budget.error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-sm font-bold text-rose-900 flex items-center justify-between shadow-sm">
          <span>⚠️ {budget.error}</span>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Form Section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm xl:col-span-2 space-y-6">
          <form onSubmit={save} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                  Global Monthly Budget Cap
                </label>
                <span className="text-xs font-bold text-slate-500">Current Spent: {formatCurrency(totalExpense)}</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-black text-lg">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 50000"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-950 font-black text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">Per-Category Spending Limits</h3>
                  <p className="text-xs font-semibold text-slate-500">Track and alert when spending exceeds limits</p>
                </div>
                <button
                  type="button"
                  onClick={addCategory}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors"
                >
                  <span>➕</span>
                  <span>Add Limit</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {categoryBudgets.length ? (
                  categoryBudgets.map((item, index) => {
                    const spent = summary?.categoryBreakdown?.find((entry) => entry.category === item.category)?.amount || 0
                    const limitVal = Number(item.limit || 0)
                    const percent = limitVal > 0 ? Math.min(100, Math.round((spent / limitVal) * 100)) : 0
                    const isOver = limitVal > 0 && spent > limitVal
                    const icon = categoryIcons[item.category] || '🏷️'

                    return (
                      <div
                        key={`${item.category}-${index}`}
                        className={`rounded-2xl border p-4.5 transition-all ${
                          isOver
                            ? 'border-rose-300 bg-rose-50/40 shadow-sm shadow-rose-500/5'
                            : 'border-slate-200/90 bg-slate-50/60 hover:bg-white'
                        }`}
                      >
                        <div className="grid gap-3 sm:grid-cols-[1.4fr_1.4fr_auto] items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{icon}</span>
                            <select
                              value={item.category}
                              onChange={(e) => updateCategory(index, 'category', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                            <input
                              type="number"
                              min="0"
                              placeholder="Monthly Limit"
                              value={item.limit}
                              onChange={(e) => updateCategory(index, 'limit', e.target.value)}
                              className="w-full pl-8 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="p-2 text-rose-600 hover:bg-rose-100/80 border border-rose-200 rounded-xl text-xs font-bold transition-all"
                            title="Remove Limit"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="mt-3">
                          <div className="mb-1.5 flex justify-between text-xs font-bold">
                            <span className="text-slate-700">{formatCurrency(spent)} spent of {formatCurrency(limitVal)}</span>
                            <span className={isOver ? 'text-rose-700 font-black' : 'text-slate-900 font-extrabold'}>
                              {percent}% {isOver && '⚠️ Exceeded'}
                            </span>
                          </div>
                          <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-rose-600' : 'bg-emerald-600'}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          {isOver && (
                            <p className="text-[11px] font-bold text-rose-700 mt-1">
                              Over budget by {formatCurrency(spent - limitVal)} in {item.category}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-bold">
                    No category budgets defined yet. Click "Add Limit" to set granular ceilings.
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={budget.loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-7 py-3 rounded-2xl shadow-lg shadow-blue-600/25 text-xs sm:text-sm uppercase tracking-wider disabled:opacity-50 transition-all"
            >
              {budget.loading ? 'Saving Changes...' : 'Save Budget Configuration'}
            </button>
          </form>
        </section>

        {/* Progress & Utilization Sidebar Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mb-1">Utilization Status</h2>
            <p className="text-xs font-semibold text-slate-500 mb-6">Real-time budget consumption</p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
                <p className="text-[11px] font-black uppercase tracking-wider text-rose-700">Total Spent</p>
                <p className="text-2xl sm:text-3xl font-black text-rose-900 mt-1">{formatCurrency(totalExpense)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-600">Remaining Cushion</p>
                <p className={`text-2xl sm:text-3xl font-black mt-1 ${remaining < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {formatCurrency(remaining)}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="mb-2 flex justify-between text-xs font-black text-slate-900">
                  <span>Overall Budget Used</span>
                  <span>{usedPercent}%</span>
                </div>
                <div className="h-3.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${usedPercent >= 100 ? 'bg-rose-600' : 'bg-blue-600'}`}
                    style={{ width: `${usedPercent}%` }}
                  />
                </div>
              </div>

              {remaining < 0 && (
                <div className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-bold text-rose-900 shadow-sm">
                  ⚠️ <strong>Overspending Alert:</strong> Total spending has surpassed your budget limit by {formatCurrency(Math.abs(remaining))}.
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500 text-center">
            Budget limits dynamically evaluate against active period expenses.
          </div>
        </section>
      </div>
    </div>
  )
}

export default Budget