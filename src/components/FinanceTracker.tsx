import React, { useState } from 'react';
import { FinanceLedgerEntry, Farm, ExpressCategory, CropSeason } from '../types';
import { IndianRupee, Plus, Trash2, Edit2, TrendingUp, TrendingDown, Calendar, FileText, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react';

interface FinanceTrackerProps {
  currentFarm: Farm;
  finances: FinanceLedgerEntry[];
  onAddTransaction: (entry: Omit<FinanceLedgerEntry, 'id'>) => void;
  onUpdateTransaction: (entry: FinanceLedgerEntry) => void;
  onDeleteTransaction: (id: string) => void;
}

export const FinanceTracker: React.FC<FinanceTrackerProps> = ({
  currentFarm,
  finances,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction
}) => {
  const farmFinances = finances.filter(f => f.farmId === currentFarm.id);

  // States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinanceLedgerEntry | null>(null);

  // Form states
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newCategory, setNewCategory] = useState<ExpressCategory>('Seeds');
  const [newAmount, setNewAmount] = useState<number>(1000);
  const [newDate, setNewDate] = useState('2026-06-09');
  const [newNotes, setNewNotes] = useState('');
  const [newSeason, setNewSeason] = useState<CropSeason>('Kharif');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmount <= 0) return;
    onAddTransaction({
      farmId: currentFarm.id,
      type: newType,
      category: newCategory,
      amount: newAmount,
      date: newDate,
      notes: newNotes,
      season: newSeason
    });
    setNewAmount(1000);
    setNewNotes('');
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTransaction) return;
    onUpdateTransaction(editingTransaction);
    setEditingTransaction(null);
  };

  // Math summary
  const totalIncome = farmFinances.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = farmFinances.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // Category summary for Custom SVG donut/bars chart
  const categoriesList: ExpressCategory[] = [
    'Seeds', 'Fertilizer', 'Pesticide', 'Labour', 'Irrigation', 'Machinery', 'Sale Income', 'Subsidy', 'Other'
  ];
  
  const categoryTotals = categoriesList.reduce((acc, cat) => {
    const total = farmFinances.filter(f => f.category === cat).reduce((sum, f) => sum + f.amount, 0);
    if (total > 0) {
      acc.push({ category: cat, amount: total, type: farmFinances.find(f => f.category === cat)?.type || 'expense' });
    }
    return acc;
  }, [] as { category: ExpressCategory; amount: number; type: 'income' | 'expense' }[]);

  // Max category amount for Scaling factor in custom charts
  const maxAmount = Math.max(...categoryTotals.map(c => c.amount), 1);

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="title-finances" className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <IndianRupee className="w-6 h-6 text-emerald-600 animate-bounce" />
            <span>Khet Finance Ledger & Ledger</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track income (Subsidy, Mandi harvests) & expenses (urea bags, labour wages, seeds, machinery renting).
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Transaction</span>
        </button>
      </div>

      {/* KPI Cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-600">Total Income (Aamdani)</span>
            <h2 className="text-2xl font-extrabold text-slate-800 mt-1 flex items-center">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
              <span>{totalIncome.toLocaleString()}</span>
            </h2>
            <span className="text-[10px] text-emerald-600 mt-0.5 block leading-tight">Subsidy + Mandi Sales</span>
          </div>
          <span className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </span>
        </div>

        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-600">Total Expenses (Kharcha)</span>
            <h2 className="text-2xl font-extrabold text-slate-800 mt-1 flex items-center">
              <IndianRupee className="w-5 h-5 text-rose-600" />
              <span>{totalExpense.toLocaleString()}</span>
            </h2>
            <span className="text-[10px] text-rose-600 mt-0.5 block leading-tight">Labour + Fertilizer + Seeds</span>
          </div>
          <span className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <TrendingDown className="w-6 h-6" />
          </span>
        </div>

        <div className={`rounded-2xl p-5 border flex items-center justify-between ${netProfit >= 0 ? 'bg-teal-50 border-teal-100' : 'bg-amber-50 border-amber-100'}`}>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-800">Net Balance (Bachat)</span>
            <h2 className="text-2xl font-extrabold text-slate-800 mt-1 flex items-center">
              <IndianRupee className="w-5 h-5 text-teal-700" />
              <span>{netProfit.toLocaleString()}</span>
            </h2>
            <span className="text-[10px] text-teal-700 mt-0.5 block leading-tight">Seasonal Profit Position</span>
          </div>
          <span className="p-3 bg-white text-teal-600 rounded-2xl font-bold text-xs uppercase tracking-wider text-center">
            {netProfit >= 0 ? '+ PROFIT' : '- LEAK'}
          </span>
        </div>
      </div>

      {/* Forms row */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Record Transaction</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Transaction Flow *</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-300">
                <button
                  type="button"
                  onClick={() => { setNewType('expense'); setNewCategory('Seeds'); }}
                  className={`flex-1 text-xs font-extrabold py-2 ${newType === 'expense' ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  Expense / Payment
                </button>
                <button
                  type="button"
                  onClick={() => { setNewType('income'); setNewCategory('Sale Income'); }}
                  className={`flex-1 text-xs font-extrabold py-2 ${newType === 'income' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  Income / Credit
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Operation Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as ExpressCategory)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                {newType === 'expense' ? (
                  <>
                    <option value="Seeds">Seeds (Beej)</option>
                    <option value="Fertilizer">Fertilizer (Khaad)</option>
                    <option value="Pesticide">Pesticide (Dawaai)</option>
                    <option value="Labour">Labour (Majuuri)</option>
                    <option value="Irrigation">Irrigation (Pani)</option>
                    <option value="Machinery">Machinery (Tractor/Diesel)</option>
                    <option value="Other">Other Expenses</option>
                  </>
                ) : (
                  <>
                    <option value="Sale Income">Sale Income (Fasal Mandi Sale)</option>
                    <option value="Subsidy">Govt Subsidy (Sarkaari Sahayata)</option>
                    <option value="Other">Other Credits</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Transaction Amount (₹) *</label>
              <input
                type="number"
                min="1"
                required
                value={newAmount}
                onChange={e => setNewAmount(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Transaction Date</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Agri Season Code</label>
              <select
                value={newSeason}
                onChange={e => setNewSeason(e.target.value as CropSeason)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Kharif">Kharif Cycle</option>
                <option value="Rabi">Rabi Cycle</option>
                <option value="Zaid">Zaid Cycle</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Narration / Notes</label>
              <input
                type="text"
                placeholder="e.g., 2 bags Urea, Sukhwinder bonus..."
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Save Transaction
            </button>
          </div>
        </form>
      )}

      {editingTransaction && (
        <form onSubmit={handleEditSubmit} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-amber-800 text-sm">Edit Transaction Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Amount (₹)</label>
              <input
                type="number"
                min="1"
                required
                value={editingTransaction.amount}
                onChange={e => setEditingTransaction({ ...editingTransaction, amount: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Date</label>
              <input
                type="date"
                required
                value={editingTransaction.date}
                onChange={e => setEditingTransaction({ ...editingTransaction, date: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Narrative</label>
              <input
                type="text"
                required
                value={editingTransaction.notes}
                onChange={e => setEditingTransaction({ ...editingTransaction, notes: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Season</label>
              <select
                value={editingTransaction.season}
                onChange={e => setEditingTransaction({ ...editingTransaction, season: e.target.value as CropSeason })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Kharif">Kharif</option>
                <option value="Rabi">Rabi</option>
                <option value="Zaid">Zaid</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingTransaction(null)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Main split: Ledger History on Left, Category breakdown bar chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ledger list left */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Financial Transaction History</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Notes</th>
                  <th className="py-2.5">Season</th>
                  <th className="py-2.5 text-right">Amount</th>
                  <th className="py-2.5 text-right px-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {farmFinances.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-all">
                    <td className="py-3 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold flex items-center w-fit text-[10px] uppercase border ${item.type === 'income' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-rose-50 text-rose-800 border-rose-100'}`}>
                        {item.type === 'income' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        <span>{item.category}</span>
                      </span>
                    </td>
                    <td className="py-3 max-w-[180px] truncate" title={item.notes}>{item.notes || '--'}</td>
                    <td className="py-3 italic font-semibold text-slate-500">{item.season}</td>
                    <td className={`py-3 text-right font-extrabold text-sm ${item.type === 'income' ? 'text-emerald-700' : 'text-slate-800'}`}>
                      {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                    </td>
                    <td className="py-3 text-right px-2">
                      <div className="inline-flex space-x-1.5">
                        <button
                          onClick={() => setEditingTransaction(item)}
                          className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 p-1.5 rounded transition"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this financial ledger record?')) {
                              onDeleteTransaction(item.id);
                            }
                          }}
                          className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 p-1.5 rounded transition"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {farmFinances.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No financial transaction found for this farm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Categories Bar chart right */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center space-x-1.5">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>Category Spending Shares</span>
          </h3>

          <div className="space-y-4 pt-2">
            {categoryTotals.map((tot, i) => {
              const percentage = Math.round((tot.amount / maxAmount) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{tot.category}</span>
                    <span className={`font-bold ${tot.type === 'income' ? 'text-emerald-700' : 'text-slate-700'}`}>
                      ₹{tot.amount.toLocaleString()}
                    </span>
                  </div>
                  {/* Custom HTML Bar chart */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${tot.type === 'income' ? 'bg-emerald-600' : 'bg-amber-600'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {categoryTotals.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-10">Add transactions to generate category shares.</p>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mt-4 text-xs font-medium text-slate-600">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Finance Advisor Note</p>
            <p>Maintain proper billing/j-form receipts for wheat crop sales to avail low-interest crop loan renewal facilities via Kisan Credit Card (KCC).</p>
          </div>
        </div>

      </div>
    </div>
  );
};
