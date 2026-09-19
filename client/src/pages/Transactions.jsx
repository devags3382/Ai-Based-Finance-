import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTransactions,
  removeTransactionById,
  saveTransaction
} from '../redux/slices/transactionSlice'
import { categories, formatCurrency, formatDate, paymentMethods } from '../utils/format'

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

const emptyForm = {
  type: 'expense',
  title: '',
  amount: '',
  category: 'Food',
  paymentMethod: 'card',
  description: '',
  transactionDate: new Date().toISOString().slice(0, 10)
}

function Transactions() {
  const dispatch = useDispatch()
  const { transactions, pagination, loading, error } = useSelector(state => state.transactions)

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    sort: 'latest',
    page: 1
  })

  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [localError, setLocalError] = useState('')

  const query = useMemo(() => ({ ...filters, limit: 10 }), [filters])

  useEffect(() => {
    dispatch(fetchTransactions(query))
  }, [dispatch, query])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1
    }))
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.pages || 1)) {
      setFilters(prev => ({ ...prev, page: newPage }))
    }
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      sort: 'latest',
      page: 1
    })
  }

  const openCreate = () => {
    setEditingId(null)
    setForm({
      ...emptyForm,
      transactionDate: new Date().toISOString().slice(0, 10)
    })
    setLocalError('')
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditingId(item._id)
    setForm({
      type: item.type,
      title: item.title,
      amount: item.amount,
      category: item.category,
      paymentMethod: item.paymentMethod || 'card',
      description: item.description || '',
      transactionDate: item.transactionDate ? new Date(item.transactionDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    })
    setLocalError('')
    setShowForm(true)
  }

  const submitForm = async (event) => {
    event.preventDefault()
    setLocalError('')
    setMessage('')

    if (!form.title.trim()) {
      setLocalError('Please enter a descriptive title.')
      return
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setLocalError('Amount must be a positive number.')
      return
    }

    try {
      await dispatch(saveTransaction({
        id: editingId,
        data: {
          ...form,
          amount: Number(form.amount)
        }
      })).unwrap()

      setShowForm(false)
      setMessage(editingId ? 'Transaction updated successfully!' : 'New transaction recorded successfully!')
      dispatch(fetchTransactions(query))
    } catch (err) {
      setLocalError(err || 'Failed to save transaction')
    }
  }

  const deleteItem = async (item) => {
    if (window.confirm(`Permanently delete "${item.title}" from ledger?`)) {
      setMessage('')
      try {
        await dispatch(removeTransactionById(item._id)).unwrap()
        setMessage('Transaction deleted.')
        dispatch(fetchTransactions(query))
      } catch (err) {
        setLocalError(err || 'Failed to delete transaction')
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Transaction Ledger</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
              {pagination.total || 0} Total
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-500 mt-1">Audit, filter, and manage all your income and expenditure entries.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-5 py-3 rounded-2xl shadow-lg shadow-blue-600/25 text-sm transition-all duration-200"
        >
          <span className="text-base">➕</span>
          <span>Record Transaction</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm font-bold text-emerald-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage('')} className="text-emerald-700 hover:text-emerald-950 font-black">✕</button>
        </div>
      )}

      {(error || localError) && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3.5 text-sm font-bold text-rose-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{localError || error}</span>
          </div>
          <button onClick={() => setLocalError('')} className="text-rose-700 hover:text-rose-950 font-black">✕</button>
        </div>
      )}

      {/* Filter Control Bar */}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5 items-end">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">Search Keywords</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Title, description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">Flow Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            >
              <option value="">All Streams (Income & Expense)</option>
              <option value="income">🟢 Income Only</option>
              <option value="expense">🔴 Expense Only</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{categoryIcons[cat] || '🏷️'} {cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1.5">Sort Order</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            >
              <option value="latest">⏱️ Most Recent First</option>
              <option value="oldest">🕰️ Oldest First</option>
              <option value="amount_desc">💰 Amount (High → Low)</option>
              <option value="amount_asc">🪙 Amount (Low → High)</option>
            </select>
          </div>

          <div>
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-800 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* Ledger Table */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-100/80 text-slate-800 font-black text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Title & Context</th>
                <th className="px-6 py-4">Flow</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-slate-500">
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="font-bold text-slate-700">Loading ledger data...</p>
                  </td>
                </tr>
              ) : transactions.length ? (
                transactions.map((item) => {
                  const isIncome = item.type === 'income'
                  const icon = categoryIcons[item.category] || '🏷️'

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 font-bold ${
                            isIncome ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {icon}
                          </div>
                          <div className="min-w-0">
                            <p className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-xs text-slate-500 truncate max-w-xs">{item.description}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          isIncome ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                        }`}>
                          <span>{isIncome ? '🟢' : '🔴'}</span>
                          <span>{item.type}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold border border-slate-200/80">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-bold text-slate-600">
                        {formatDate(item.transactionDate)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                          {item.paymentMethod ? item.paymentMethod.replace('_', ' ') : 'card'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span className={`font-black text-base ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEdit(item)}
                            className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 rounded-xl text-xs font-black transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(item)}
                            className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-xl text-xs font-black transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-slate-400">
                    <p className="text-base font-bold text-slate-700">No transactions match your criteria.</p>
                    <p className="text-xs font-semibold text-slate-400 mt-1">Try resetting filters or record a new entry above.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 bg-slate-50 text-xs font-bold text-slate-700">
          <div>
            Page <span className="text-slate-950 font-black">{pagination.page || 1}</span> of <span className="text-slate-950 font-black">{pagination.pages || 1}</span> ({pagination.total || 0} items)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page <= 1}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-extrabold disabled:opacity-40 transition-all shadow-sm"
            >
              ← Previous
            </button>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= (pagination.pages || 1)}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-extrabold disabled:opacity-40 transition-all shadow-sm"
            >
              Next →
            </button>
          </div>
        </div>
      </section>

      {/* Modal Dialog */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {editingId ? '✏️' : '➕'}
                </span>
                <h2 className="text-lg font-black text-slate-900">
                  {editingId ? 'Edit Transaction Entry' : 'Record New Transaction'}
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {localError && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
                {localError}
              </div>
            )}

            <form onSubmit={submitForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Flow Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="expense">🔴 Expense</option>
                    <option value="income">🟢 Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    placeholder="e.g. 2500"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Title / Subject</label>
                <input
                  type="text"
                  placeholder="e.g., Grocery Store, Cloud Server Bill"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{categoryIcons[cat] || '🏷️'} {cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>{method.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Transaction Date</label>
                <input
                  type="date"
                  value={form.transactionDate}
                  onChange={(e) => setForm({ ...form, transactionDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">Notes (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Additional context..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl text-xs shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Processing...' : editingId ? 'Update Entry' : 'Save To Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions