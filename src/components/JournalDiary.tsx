import React, { useState } from 'react';
import { JournalEntry, JournalActivityType, Farm, Plot, Crop, FinanceLedgerEntry } from '../types';
import { BookOpen, Plus, Trash2, Edit2, Calendar, FileText, Filter, Search, Check, Droplet, Hammer, ShieldClose, UserCheck, AlertCircle, Layers, Sprout, IndianRupee } from 'lucide-react';

interface JournalDiaryProps {
  currentFarm: Farm;
  journalEntries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  onUpdateEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  plots: Plot[];
  onAddCrop: (crop: Omit<Crop, 'id'>) => void;
  onAddTransaction: (trans: Omit<FinanceLedgerEntry, 'id'>) => void;
  onUpdatePlot: (plot: Plot) => void;
}

export const JournalDiary: React.FC<JournalDiaryProps> = ({
  currentFarm,
  journalEntries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  plots,
  onAddCrop,
  onAddTransaction,
  onUpdatePlot
}) => {
  const farmEntries = journalEntries.filter(e => e.farmId === currentFarm.id);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState<'All' | JournalActivityType>('All');
  const [dateFilter, setDateFilter] = useState('');

  // Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // Add Form Inputs
  const [newDate, setNewDate] = useState('2026-06-09');
  const [newActivityType, setNewActivityType] = useState<JournalActivityType>('Irrigation');
  const [newNotes, setNewNotes] = useState('');
  const [simulatedPhoto, setSimulatedPhoto] = useState('');

  // Integrated Shortcut Registry States
  const [linkCrop, setLinkCrop] = useState(false);
  const [cropName, setCropName] = useState('');
  const [cropVariety, setCropVariety] = useState('');
  const [cropSeason, setCropSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Kharif');
  const [cropType, setCropType] = useState<'Nursery' | 'Sown'>('Nursery');
  const [cropAreaValue, setCropAreaValue] = useState<number>(1);
  const [cropAreaUnit, setCropAreaUnit] = useState<'Acres' | 'Bighas' | 'Kanals' | 'Killas'>('Acres');
  const [cropInputCost, setCropInputCost] = useState<number>(1500);
  const [cropExpectedHarvest, setCropExpectedHarvest] = useState('2026-10-30');
  const [selectedPlotId, setSelectedPlotId] = useState('');

  const [linkFinance, setLinkFinance] = useState(false);
  const [financeType, setFinanceType] = useState<'income' | 'expense'>('expense');
  const [financeCategory, setFinanceCategory] = useState<'Labour' | 'Fertilizer' | 'Pesticide' | 'Irrigation' | 'Machinery' | 'Seeds' | 'Other' | 'Sale Income' | 'Subsidy'>('Labour');
  const [financeAmount, setFinanceAmount] = useState<number>(1500);
  const [financeNotes, setFinanceNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotes) return;

    // 1. Save core dairy entry log
    onAddEntry({
      farmId: currentFarm.id,
      date: newDate,
      activityType: newActivityType,
      notes: newNotes,
      photoUrl: simulatedPhoto || undefined
    });

    // 2. Link Sowed Crop / Nursery profile register
    if (linkCrop && cropName) {
      onAddCrop({
        farmId: currentFarm.id,
        name: cropType === 'Nursery' ? `[Nursery] ${cropName}` : cropName,
        variety: cropVariety,
        season: cropSeason,
        sowingDate: newDate,
        expectedHarvest: cropExpectedHarvest,
        areaValue: Number(cropAreaValue),
        areaUnit: cropAreaUnit,
        inputCost: Number(cropInputCost),
        status: cropType
      });

      // 3. Update related plot's current crop on the farm map
      if (selectedPlotId) {
        const matchingPlot = plots.find(p => p.id === selectedPlotId);
        if (matchingPlot) {
          onUpdatePlot({
            ...matchingPlot,
            currentCrop: cropType === 'Nursery' ? `[Nursery] ${cropName} (${cropVariety || 'StandardVar'})` : `${cropName} (${cropVariety || 'StandardVar'})`,
            sowingDate: newDate,
            expectedHarvest: cropExpectedHarvest,
            status: cropType === 'Nursery' ? 'Sowed' : 'Growing'
          });
        }
      }
    }

    // 4. Link Finance Ledger transaction
    if (linkFinance && financeAmount > 0) {
      onAddTransaction({
        farmId: currentFarm.id,
        type: financeType,
        category: (financeCategory as any) || 'Other',
        amount: Number(financeAmount),
        date: newDate,
        notes: financeNotes || `Logged from Journal: "${newNotes.substring(0, 35)}..."`,
        season: cropSeason
      });
    }

    // Reset Form Fields
    setNewNotes('');
    setSimulatedPhoto('');

    // Reset smart links fields
    setLinkCrop(false);
    setCropName('');
    setCropVariety('');
    setCropType('Nursery');
    setCropAreaValue(1);
    setCropInputCost(1500);
    setCropExpectedHarvest('2026-10-30');
    setSelectedPlotId('');

    setLinkFinance(false);
    setFinanceType('expense');
    setFinanceCategory('Labour');
    setFinanceAmount(1500);
    setFinanceNotes('');

    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    onUpdateEntry(editingEntry);
    setEditingEntry(null);
  };

  const getActivityIcon = (type: JournalActivityType) => {
    switch (type) {
      case 'Irrigation': return <Droplet className="w-5 h-5 text-blue-600" />;
      case 'Sowing': return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'Spraying': return <Droplet className="w-5 h-5 text-teal-600" />;
      case 'Fertilizing': return <FileText className="w-5 h-5 text-amber-600" />;
      case 'Harvesting': return <Check className="w-5 h-5 text-yellow-600" />;
      case 'Tillage': return <Hammer className="w-5 h-5 text-stone-600" />;
      default: return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  // Filter computation
  const filteredEntries = farmEntries.filter(entry => {
    const matchesSearch = entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivity = activityFilter === 'All' || entry.activityType === activityFilter;
    const matchesDate = !dateFilter || entry.date === dateFilter;
    return matchesSearch && matchesActivity && matchesDate;
  });

  // Simulated quick photo capture options to make it feel amazing
  const handleSimulatePhoto = (photoType: string) => {
    if (photoType === 'spraying') {
      setSimulatedPhoto('https://images.unsplash.com/photo-1592388795743-a40eb53630df?auto=format&fit=crop&q=80&w=200');
    } else if (photoType === 'transplant') {
      setSimulatedPhoto('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=200');
    } else if (photoType === 'harvest') {
      setSimulatedPhoto('https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&q=80&w=200');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="title-journal" className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span>Khet Journal / Daily Diary</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log daily farm operations, tube-well timings, sprinkler runs, or harvesting records. Filter by category.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Diary Entry</span>
        </button>
      </div>

      {/* Add entry Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Create Log Entry</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Date *</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Operation/Activity *</label>
              <select
                value={newActivityType}
                onChange={e => setNewActivityType(e.target.value as JournalActivityType)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Irrigation">Irrigation (Pani Lagaya)</option>
                <option value="Sowing">Sowing (Bijaai)</option>
                <option value="Spraying">Spraying (Dawaai Spray)</option>
                <option value="Fertilizing">Fertilizing (Khaad Daali)</option>
                <option value="Harvesting">Harvesting (Kataai)</option>
                <option value="Tillage">Tillage (Vahaai)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Attach Photo (Simulate)</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulatePhoto('spraying')}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border ${simulatedPhoto.includes('1592388795743') ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                  Spray Pic
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatePhoto('transplant')}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border ${simulatedPhoto.includes('1574323347407') ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                  Transplant Pic
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulatePhoto('harvest')}
                  className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border ${simulatedPhoto.includes('1530595467537') ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                  Harvest Pic
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Notes / Description *</label>
            <textarea
              required
              rows={3}
              placeholder="Write raw thoughts e.g. tubewell timing, fertilizer bag details, labor status..."
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
            />
          </div>

          {/* Smart Link Panel Integration */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-1">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>🌐 Khet Registries Link (Cross-Module Shortcuts)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2.5 py-0.5 rounded-full">Automate other registers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* CROP / NURSERY PROFILE REGISTER */}
              <div className={`p-4 rounded-xl border transition-all duration-200 ${linkCrop ? 'bg-emerald-50/40 border-emerald-350' : 'bg-slate-50/50 border-slate-200'}`}>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={linkCrop}
                    onChange={e => {
                      setLinkCrop(e.target.checked);
                      if (e.target.checked) {
                        setCropName('Tomato');
                        setCropVariety('Hybrid F1');
                      }
                    }}
                    className="mt-1 h-4 w-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div className="-mt-0.5">
                    <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      Create Sowed Crop / Nursery profile
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium mt-0.5">
                      Auto-creates active plant lifecycle profile in the crops tab
                    </span>
                  </div>
                </label>

                {linkCrop && (
                  <div className="mt-4 pt-3 border-t border-emerald-100 space-y-3 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Sowing Type *</label>
                        <select
                          value={cropType}
                          onChange={e => setCropType(e.target.value as any)}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                        >
                          <option value="Nursery">Nursery Pondh (Pre-plant)</option>
                          <option value="Sown">Regular Sown Crop (Bijaai)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Season *</label>
                        <select
                          value={cropSeason}
                          onChange={e => setCropSeason(e.target.value as any)}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                        >
                          <option value="Kharif">Kharif (Monsoon)</option>
                          <option value="Rabi">Rabi (Winter)</option>
                          <option value="Zaid">Zaid (Summer)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Crop / Fasal Name *</label>
                        <input
                          type="text"
                          required={linkCrop}
                          placeholder="e.g. Chillies, Rice, Onion"
                          value={cropName}
                          onChange={e => setCropName(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Variety Name</label>
                        <input
                          type="text"
                          placeholder="e.g. US 440, Desi, Pusa"
                          value={cropVariety}
                          onChange={e => setCropVariety(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Area Size *</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          required={linkCrop}
                          value={cropAreaValue}
                          onChange={e => setCropAreaValue(Number(e.target.value))}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Unit *</label>
                        <select
                          value={cropAreaUnit}
                          onChange={e => setCropAreaUnit(e.target.value as any)}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                        >
                          <option value="Acres">Acres</option>
                          <option value="Bighas">Bighas</option>
                          <option value="Kanals">Kanals</option>
                          <option value="Killas">Killas</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Plot Link (Khet Killa)</label>
                        <select
                          value={selectedPlotId}
                          onChange={e => setSelectedPlotId(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-emerald-800 font-bold"
                        >
                          <option value="">-- Choose Plot (No Link) --</option>
                          {plots.filter(p => p.farmId === currentFarm.id).map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.areaValue} {p.areaUnit})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Expected Harvest Date *</label>
                        <input
                          type="date"
                          required={linkCrop}
                          value={cropExpectedHarvest}
                          onChange={e => setCropExpectedHarvest(e.target.value)}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Seed/Nursery Cost (₹) *</label>
                      <input
                        type="number"
                        min="0"
                        required={linkCrop}
                        value={cropInputCost}
                        onChange={e => setCropInputCost(Number(e.target.value))}
                        className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-emerald-700 font-extrabold"
                      />
                      <span className="text-[9px] text-emerald-600 block mt-1 font-semibold leading-tight">
                        ⚡ Auto-logs seeds seed expense to finances ledger!
                      </span>
                    </div>

                  </div>
                )}
              </div>

              {/* CASH FLOW / RETURN FROM INVESTMENT */}
              <div className={`p-4 rounded-xl border transition-all duration-200 ${linkFinance ? 'bg-amber-50/40 border-amber-350' : 'bg-slate-50/50 border-slate-200'}`}>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={linkFinance}
                    onChange={e => {
                      setLinkFinance(e.target.checked);
                      if (e.target.checked) {
                        setFinanceNotes(newNotes ? `Invested / Returned for operational diary entry: "${newNotes.substring(0, 45)}"` : '');
                      }
                    }}
                    className="mt-1 h-4 w-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <div className="-mt-0.5">
                    <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-amber-600" />
                      Log Cash Flow (Invested or Returned)
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium mt-0.5">
                      Saves transaction record to finance tracker register
                    </span>
                  </div>
                </label>

                {linkFinance && (
                  <div className="mt-4 pt-3 border-t border-amber-100 space-y-3 animate-fadeIn">
                    
                    {linkCrop && cropInputCost > 0 && (
                      <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-1.5 text-amber-850">
                        <AlertCircle className="w-4.5 h-4.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[9px] font-bold leading-normal">
                          Notice: Seed cost (₹{cropInputCost}) registers standard seed expense automatically. Use this section for labor wages, machines, irrigation cost, or sales return income!
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Cashflow Type *</label>
                        <select
                          value={financeType}
                          onChange={e => {
                            setFinanceType(e.target.value as any);
                            setFinanceCategory(e.target.value === 'income' ? 'Sale Income' : 'Labour');
                          }}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                        >
                          <option value="expense">Expense (Invested Cost / Outflow)</option>
                          <option value="income">Income (Return / Cash inflow)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Category *</label>
                        <select
                          value={financeCategory}
                          onChange={e => setFinanceCategory(e.target.value as any)}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800"
                        >
                          {financeType === 'expense' ? (
                            <>
                              <option value="Labour">Labour Wages</option>
                              <option value="Fertilizer">Fertilizers / Khaad</option>
                              <option value="Pesticide">Pesticides / Spraying</option>
                              <option value="Irrigation">Irrigation / Diesel</option>
                              <option value="Machinery">Tractor rent / Machinery</option>
                              <option value="Seeds">Additional Seeds/Pondh</option>
                              <option value="Other">Other Operational Expenses</option>
                            </>
                          ) : (
                            <>
                              <option value="Sale Income">Sale Income (Profits Return)</option>
                              <option value="Subsidy">Govt Subsidy</option>
                              <option value="Other">Other Income Return</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Amount (₹) *</label>
                        <input
                          type="number"
                          min="1"
                          required={linkFinance}
                          value={financeAmount}
                          onChange={e => setFinanceAmount(Number(e.target.value))}
                          className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-amber-800 font-extrabold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Explanation notes *</label>
                      <input
                        type="text"
                        required={linkFinance}
                        placeholder="e.g. Sowing labour wages paid"
                        value={financeNotes}
                        onChange={e => setFinanceNotes(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-medium"
                      />
                    </div>

                  </div>
                )}
              </div>

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
              Save Diary Entry
            </button>
          </div>
        </form>
      )}

      {/* Edit Entry Form Modal */}
      {editingEntry && (
        <form onSubmit={handleEditSubmit} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-amber-800 text-sm">Edit Entry Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Date</label>
              <input
                type="date"
                required
                value={editingEntry.date}
                onChange={e => setEditingEntry({ ...editingEntry, date: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Operation</label>
              <select
                value={editingEntry.activityType}
                onChange={e => setEditingEntry({ ...editingEntry, activityType: e.target.value as JournalActivityType })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Irrigation">Irrigation</option>
                <option value="Sowing">Sowing</option>
                <option value="Spraying">Spraying</option>
                <option value="Fertilizing">Fertilizing</option>
                <option value="Harvesting">Harvesting</option>
                <option value="Tillage">Tillage</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Detailed Log Notes</label>
            <textarea
              required
              rows={3}
              value={editingEntry.notes}
              onChange={e => setEditingEntry({ ...editingEntry, notes: e.target.value })}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingEntry(null)}
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

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Notes */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search diary notes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-500">Activity:</span>
            <select
              value={activityFilter}
              onChange={e => setActivityFilter(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-bold"
            >
              <option value="All">All Operations</option>
              <option value="Irrigation">Irrigation</option>
              <option value="Sowing">Sowing</option>
              <option value="Spraying">Spraying</option>
              <option value="Fertilizing">Fertilizing</option>
              <option value="Harvesting">Harvesting</option>
              <option value="Tillage">Tillage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="text-xs font-bold border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700"
            />
          </div>
        </div>

      </div>

      {/* Main timeline listing */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-emerald-200 transition-all shadow-xs flex flex-col md:flex-row gap-5">
            {/* Visual timestamp flag */}
            <div className="flex md:flex-col items-start gap-2 md:w-32 flex-shrink-0">
              <span className="p-2.5 bg-slate-100 rounded-xl text-slate-700 border border-slate-200">
                {getActivityIcon(entry.activityType)}
              </span>
              <div>
                <span className="text-xs font-bold text-slate-800 block mt-1">{entry.date}</span>
                <span className="text-[10px] uppercase font-extrabold text-indigo-700 tracking-wider">
                  {entry.activityType}
                </span>
              </div>
            </div>

            {/* Note text + layout image */}
            <div className="flex-1 space-y-3">
              <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                {entry.notes}
              </p>
              
              {entry.photoUrl && (
                <div className="relative rounded-xl overflow-hidden max-w-sm border border-slate-200">
                  <img
                    src={entry.photoUrl}
                    alt="Logged Activity"
                    referrerPolicy="no-referrer"
                    className="w-full h-32 object-cover"
                  />
                  <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white rounded px-1.5 font-semibold">
                    Simulated Attached Photo
                  </span>
                </div>
              )}
            </div>

            {/* Actions Panel */}
            <div className="flex md:flex-col gap-2 justify-end items-end flex-shrink-0">
              <div className="space-x-1.5 flex mt-1">
                <button
                  type="button"
                  onClick={() => setEditingEntry(entry)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-800 p-2 rounded-xl transition border border-amber-200"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this diary entry?')) {
                      onDeleteEntry(entry.id);
                    }
                  }}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-xl transition border border-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-2">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No diary entries found for current filter selection.</p>
            <p className="text-xs">Click "New Diary Entry" to log daily khet updates!</p>
          </div>
        )}
      </div>

    </div>
  );
};
