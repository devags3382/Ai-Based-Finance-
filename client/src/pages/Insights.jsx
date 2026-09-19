import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInsights, fetchPrediction } from '../redux/slices/insightSlice'
import { formatCurrency } from '../utils/format'

function Insights() {
  const dispatch = useDispatch()
  const { insights, predictions, provider, loading, error } = useSelector(state => state.insights)

  useEffect(() => {
    dispatch(fetchInsights())
    dispatch(fetchPrediction())
  }, [dispatch])

  const refresh = () => {
    dispatch(fetchInsights())
    dispatch(fetchPrediction())
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* AI Intelligence Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-purple-800/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/30 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                {provider === 'openai' ? 'OpenAI GPT-4o-Mini Engine' : 'Heuristic Analytics Engine'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AI Financial Intelligence
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed font-medium">
              Automated financial health audit, savings optimization recommendations, and predictive spending forecasting.
            </p>
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black px-5 py-3 rounded-2xl shadow-lg shadow-purple-600/30 text-xs sm:text-sm uppercase tracking-wider disabled:opacity-50 transition-all duration-200"
          >
            <span>🔄</span>
            <span>{loading ? 'Analyzing...' : 'Re-Run AI Analysis'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-sm font-bold text-rose-900 shadow-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recommendations List */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                Personalized Financial Recommendations
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">Synthesized from your active ledger data</p>
            </div>
            <span className="text-xs font-extrabold px-3 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-lg">
              {insights.length} Action Items
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="font-bold text-slate-800 text-sm">Synthesizing personalized advice...</p>
              <p className="text-xs text-slate-400 mt-1">Evaluating expense distribution and cashflow ratios</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {insights && insights.length ? (
                insights.map((item, index) => (
                  <div
                    key={`insight-${index}`}
                    className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/50 via-indigo-50/30 to-blue-50/40 p-4.5 text-slate-900 hover:border-purple-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 text-base font-bold shadow-md shadow-purple-600/20 mt-0.5">
                      💡
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-relaxed">{item}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-bold">
                  Add more transactions to generate comprehensive AI recommendations.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Spending Forecast Card */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Expense Forecast
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Statistical trajectory model</p>
              </div>
              <span className="text-xl">🔮</span>
            </div>

            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Projected Month Total</p>
                <p className="text-3xl font-black text-white mt-1">
                  {formatCurrency(predictions?.predictedExpense || 0)}
                </p>
                <p className="text-[11px] text-slate-300 font-medium mt-1">
                  Estimated based on historical monthly averages
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="mb-2 flex justify-between text-xs font-black text-slate-900">
                  <span>Model Confidence</span>
                  <span className="text-blue-700 font-extrabold">{predictions?.confidence || 0}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                    style={{ width: `${predictions?.confidence || 0}%` }}
                  />
                </div>
                <p className="text-[11px] font-semibold text-slate-500 mt-2">
                  Confidence automatically scales upward as transaction volume expands.
                </p>
              </div>

              {predictions?.budgetRisk && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs font-bold text-amber-900 shadow-sm">
                  ⚠️ <strong>Budget Risk Flag:</strong> Projected expenses exceed your configured monthly limit. Consider cutting discretionary spending.
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500 text-center">
            Predictions update dynamically with every recorded entry.
          </div>
        </section>
      </div>
    </div>
  )
}

export default Insights