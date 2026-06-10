import React, { useState } from 'react';
import { Crop, Farm, CropSeason, CropStatus } from '../types';
import { Sprout, Plus, Search, Filter, Trash2, Edit2, Check, Calendar, IndianRupee } from 'lucide-react';

interface CropManagerProps {
  currentFarm: Farm;
  crops: Crop[];
  onAddCrop: (crop: Omit<Crop, 'id'>) => void;
  onUpdateCrop: (crop: Crop) => void;
  onDeleteCrop: (id: string) => void;
}

export const CropManager: React.FC<CropManagerProps> = ({
  currentFarm,
  crops,
  onAddCrop,
  onUpdateCrop,
  onDeleteCrop
}) => {
  const farmCrops = crops.filter(c => c.farmId === currentFarm.id);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [seasonFilter, setSeasonFilter] = useState<'All' | CropSeason>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | CropStatus>('All');

  // Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  // Form Field States (Add)
  const [newName, setNewName] = useState('');
  const [newVariety, setNewVariety] = useState('');
  const [newSeason, setNewSeason] = useState<CropSeason>('Kharif');
  const [newSowingDate, setNewSowingDate] = useState('2026-06-09');
  const [newExpectedHarvest, setNewExpectedHarvest] = useState('2026-11-10');
  const [newAreaValue, setNewAreaValue] = useState<number>(1);
  const [newAreaUnit, setNewAreaUnit] = useState<'Acres' | 'Bighas' | 'Kanals' | 'Killas'>('Acres');
  const [newInputCost, setNewInputCost] = useState<number>(5000);
  const [newFertilizerCost, setNewFertilizerCost] = useState<number>(0);
  const [newPesticideCost, setNewPesticideCost] = useState<number>(0);
  const [newLaborCost, setNewLaborCost] = useState<number>(0);
  const [newHarvestIncome, setNewHarvestIncome] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<CropStatus>('Planned');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    onAddCrop({
      farmId: currentFarm.id,
      name: newName,
      variety: newVariety,
      season: newSeason,
      sowingDate: newSowingDate,
      expectedHarvest: newExpectedHarvest,
      areaValue: Number(newAreaValue),
      areaUnit: newAreaUnit,
      inputCost: Number(newInputCost),
      fertilizerCost: Number(newFertilizerCost),
      pesticideCost: Number(newPesticideCost),
      laborCost: Number(newLaborCost),
      harvestIncome: Number(newHarvestIncome),
      status: newStatus
    });
    // Reset Form Fields
    setNewName('');
    setNewVariety('');
    setNewSowingDate('2026-06-09');
    setNewExpectedHarvest('2026-11-10');
    setNewAreaValue(1);
    setNewInputCost(5000);
    setNewFertilizerCost(0);
    setNewPesticideCost(0);
    setNewLaborCost(0);
    setNewHarvestIncome(0);
    setNewStatus('Planned');
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop) return;
    onUpdateCrop(editingCrop);
    setEditingCrop(null);
  };

  // Helper: auto-calculate expected crop cycle lengths for popular items
  const handleCropNameChange = (name: string, isEdit: boolean = false) => {
    let days = 140; // Default crop cycle
    const lower = name.toLowerCase();
    
    if (lower.includes('rice') || lower.includes('dhaan') || lower.includes('paddy')) {
      days = 145;
    } else if (lower.includes('wheat') || lower.includes('kanak')) {
      days = 150;
    } else if (lower.includes('cotton') || lower.includes('narma')) {
      days = 180;
    } else if (lower.includes('mustard') || lower.includes('sarso')) {
      days = 120;
    } else if (lower.includes('fodder') || lower.includes('chari') || lower.includes('barseem')) {
      days = 90;
    }

    const sowing = isEdit && editingCrop ? editingCrop.sowingDate : newSowingDate;
    if (sowing) {
      try {
        const sowingDObj = new Date(sowing);
        sowingDObj.setDate(sowingDObj.getDate() + days);
        const yyyy = sowingDObj.getFullYear();
        const mm = String(sowingDObj.getMonth() + 1).padStart(2, '0');
        const dd = String(sowingDObj.getDate()).padStart(2, '0');
        const calculatedDateStr = `${yyyy}-${mm}-${dd}`;
        
        if (isEdit && editingCrop) {
          setEditingCrop({ 
            ...editingCrop, 
            name,
            expectedHarvest: calculatedDateStr 
          });
        } else {
          setNewName(name);
          setNewExpectedHarvest(calculatedDateStr);
        }
      } catch (err) {
        if (isEdit && editingCrop) {
          setEditingCrop({ ...editingCrop, name });
        } else {
          setNewName(name);
        }
      }
    } else {
      if (isEdit && editingCrop) {
        setEditingCrop({ ...editingCrop, name });
      } else {
        setNewName(name);
      }
    }
  };

  // Status badges mapping
  const getStatusStyle = (status: CropStatus) => {
    switch (status) {
      case 'Growing':
        return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'Sown':
        return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'Harvested':
        return 'bg-blue-50 text-blue-800 border-blue-100';
      case 'Nursery':
        return 'bg-indigo-50 text-indigo-800 border-indigo-100';
      case 'Planned':
      default:
        return 'bg-slate-50 text-slate-800 border-slate-100';
    }
  };

  // Filtered List
  const filteredCrops = farmCrops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          crop.variety.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeason = seasonFilter === 'All' || crop.season === seasonFilter;
    const matchesStatus = statusFilter === 'All' || crop.status === statusFilter;
    
    return matchesSearch && matchesSeason && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="title-crop-manager" className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            <span>Crop Lifecycle Manager</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track crops per agricultural crop cycle season (<span className="text-emerald-700 font-bold">Kharif / Rabi</span>) in local units (Acres, Bighas, Kanals).
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Sow / Plan New Crop</span>
        </button>
      </div>

      {/* Add Crop form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-sm">Register Sown Crop Cycle</h3>
            <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Auto harvest forecast active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Crop Name (Fasal) *</label>
              <select
                required
                value={newName}
                onChange={e => handleCropNameChange(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800 font-medium"
              >
                <option value="">-- Choose Crop --</option>
                <option value="Rice (Dhaan)">Rice (Dhaan)</option>
                <option value="Wheat (Kanak)">Wheat (Kanak)</option>
                <option value="Cotton (Narma)">Cotton (Narma)</option>
                <option value="Mustard (Sarso)">Mustard (Sarso)</option>
                <option value="Fodder (Chari/Barseem)">Fodder (Chari/Barseem)</option>
                <option value="Vegetables (Sabzi)">Vegetables (Sabzi)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Variety (Beej Kisam)</label>
              <input
                type="text"
                placeholder="e.g. Basmati 1121, HD-2967"
                value={newVariety}
                onChange={e => setNewVariety(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Agricultural Season</label>
              <select
                value={newSeason}
                onChange={e => setNewSeason(e.target.value as CropSeason)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Kharif">Kharif (Sauni - Monsoon)</option>
                <option value="Rabi">Rabi (Haari - Winter)</option>
                <option value="Zaid">Zaid (Hot Summer)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Sowing Date (Bijaai)</label>
              <input
                type="date"
                required
                value={newSowingDate}
                onChange={e => {
                  setNewSowingDate(e.target.value);
                  // Trigger recalculation if Crop Name already chosen
                  if (newName) handleCropNameChange(newName);
                }}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Expected Harvest Date</label>
              <input
                type="date"
                required
                value={newExpectedHarvest}
                onChange={e => setNewExpectedHarvest(e.target.value)}
                className="w-full text-sm border border-emerald-300 rounded-xl px-3 py-2 bg-emerald-50 text-slate-800 font-semibold"
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Area Size</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={newAreaValue}
                  onChange={e => setNewAreaValue(Number(e.target.value))}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Area Unit</label>
                <select
                  value={newAreaUnit}
                  onChange={e => setNewAreaUnit(e.target.value as any)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
                >
                  <option value="Acres">Acres</option>
                  <option value="Bighas">Bighas (Rajasthan)</option>
                  <option value="Kanals">Kanals (Haryana)</option>
                  <option value="Killas">Killas</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Total Seed/Input Cost (₹)</label>
              <input
                type="number"
                min="0"
                required
                value={newInputCost}
                onChange={e => setNewInputCost(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
              <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
                ⚡ Auto-syncs to Finance Ledger
              </span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Crop Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as CropStatus)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Planned">Planned (Tayari)</option>
                <option value="Nursery">Nursery (Pondh Preparing)</option>
                <option value="Sown">Sown (Bijaai Kar Di)</option>
                <option value="Growing">Growing (Ugg Rahi H)</option>
                <option value="Harvested">Harvested (Katt Gai)</option>
              </select>
            </div>
          </div>

          {/* Integrated Financial Costs Subsection */}
          <div className="border border-slate-250/60 rounded-2xl p-4 bg-white/60 space-y-2.5 shadow-2xs">
            <h4 className="text-xs font-extrabold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span>⚙️ Integrated Expenditures & Return Logs (Fasal Hisab-Kitab)</span>
            </h4>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">
              Entering expenses or returns here will instantly sync separate transaction cards directly into your <b>Finance Tracker</b> ledger connected to this crop cycle!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Fertilizer Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={newFertilizerCost}
                  onChange={e => setNewFertilizerCost(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Pesticide Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={newPesticideCost}
                  onChange={e => setNewPesticideCost(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Labour Wages (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={newLaborCost}
                  onChange={e => setNewLaborCost(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-emerald-700 block mb-1">Market Return Sale (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={newHarvestIncome}
                  onChange={e => setNewHarvestIncome(Number(e.target.value))}
                  className="w-full text-xs border border-emerald-300 rounded-lg px-2 py-1.5 bg-emerald-50 text-emerald-800 font-extrabold"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
            >
              Sow This Fasal
            </button>
          </div>
        </form>
      )}

      {/* Edit Crop Form Modal / Area */}
      {editingCrop && (
        <form onSubmit={handleEditSubmit} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-extrabold text-amber-800 text-sm">Update Crop Cycle: {editingCrop.name}</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Crop Name (Fasal)</label>
              <input
                type="text"
                required
                value={editingCrop.name}
                onChange={e => handleCropNameChange(e.target.value, true)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Variety (Kisamp)</label>
              <input
                type="text"
                value={editingCrop.variety}
                onChange={e => setEditingCrop({ ...editingCrop, variety: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Season</label>
              <select
                value={editingCrop.season}
                onChange={e => setEditingCrop({ ...editingCrop, season: e.target.value as CropSeason })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Kharif">Kharif</option>
                <option value="Rabi">Rabi</option>
                <option value="Zaid">Zaid</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Sowing Date</label>
              <input
                type="date"
                required
                value={editingCrop.sowingDate}
                onChange={e => setEditingCrop({ ...editingCrop, sowingDate: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Expected Harvest Date</label>
              <input
                type="date"
                required
                value={editingCrop.expectedHarvest}
                onChange={e => setEditingCrop({ ...editingCrop, expectedHarvest: e.target.value })}
                className="w-full text-sm border border-amber-300 rounded-xl px-3 py-2 bg-amber-50 text-slate-800 font-bold"
              />
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Area Size</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={editingCrop.areaValue}
                  onChange={e => setEditingCrop({ ...editingCrop, areaValue: Number(e.target.value) })}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Area Unit</label>
                <select
                  value={editingCrop.areaUnit}
                  onChange={e => setEditingCrop({ ...editingCrop, areaUnit: e.target.value as any })}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
                >
                  <option value="Acres">Acres</option>
                  <option value="Bighas">Bighas</option>
                  <option value="Kanals">Kanals</option>
                  <option value="Killas">Killas</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Total Seed/Input Cost (₹)</label>
              <input
                type="number"
                min="0"
                required
                value={editingCrop.inputCost}
                onChange={e => setEditingCrop({ ...editingCrop, inputCost: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
              <span className="text-[10px] text-amber-600 font-semibold block mt-1">
                ⚡ Auto-updates Finance Ledger
              </span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Status</label>
              <select
                value={editingCrop.status}
                onChange={e => setEditingCrop({ ...editingCrop, status: e.target.value as CropStatus })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Planned">Planned</option>
                <option value="Nursery">Nursery</option>
                <option value="Sown">Sown</option>
                <option value="Growing">Growing</option>
                <option value="Harvested">Harvested</option>
              </select>
            </div>
          </div>

          {/* Integrated Financial Costs Subsection for Editing */}
          <div className="border border-amber-250/50 rounded-2xl p-4 bg-white/60 space-y-2.5 shadow-2xs">
            <h4 className="text-xs font-extrabold text-amber-900 tracking-wide uppercase flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
              <span>⚙️ Integrated Expenditures & Return Logs (Fasal Hisab-Kitab)</span>
            </h4>
            <p className="text-[10px] text-amber-800 font-medium leading-tight">
              Adjusting expenses/returns here will automatically sync or remove corresponding ledger entries in your <b>Finance Tracker</b>!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Fertilizer Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingCrop.fertilizerCost || 0}
                  onChange={e => setEditingCrop({ ...editingCrop, fertilizerCost: Number(e.target.value) })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Pesticide Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingCrop.pesticideCost || 0}
                  onChange={e => setEditingCrop({ ...editingCrop, pesticideCost: Number(e.target.value) })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">Labour Wages (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingCrop.laborCost || 0}
                  onChange={e => setEditingCrop({ ...editingCrop, laborCost: Number(e.target.value) })}
                  className="w-full text-xs border border-slate-300 rounded-lg px-2 py-1.5 bg-white text-slate-800 font-semibold"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-emerald-800 block mb-1">Market Return Sale (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editingCrop.harvestIncome || 0}
                  onChange={e => setEditingCrop({ ...editingCrop, harvestIncome: Number(e.target.value) })}
                  className="w-full text-xs border border-emerald-300 rounded-lg px-2 py-1.5 bg-emerald-50 text-emerald-800 font-extrabold"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingCrop(null)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Update Crop Cycle
            </button>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search crop name or variety..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-500">Season:</span>
            <select
              value={seasonFilter}
              onChange={e => setSeasonFilter(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-bold"
            >
              <option value="All">All agricultural cyles</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-bold"
            >
              <option value="All">All statuses</option>
              <option value="Planned">Planned</option>
              <option value="Nursery">Nursery</option>
              <option value="Sown">Sown</option>
              <option value="Growing">Growing</option>
              <option value="Harvested">Harvested</option>
            </select>
          </div>
        </div>

      </div>

      {/* crops listing grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            className="bg-white border border-slate-100 rounded-2xl shadow-xs p-5 flex flex-col justify-between hover:border-emerald-200 transition-all"
          >
            {/* Crop Header */}
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                  {crop.season} Cycle
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getStatusStyle(crop.status)}`}>
                  {crop.status}
                </span>
              </div>
              
              <h3 className="font-extrabold text-slate-800 text-lg flex items-center space-x-1">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span>{crop.name}</span>
              </h3>
              <p className="text-xs text-emerald-800 font-semibold mt-0.5">Kisam/Variety: {crop.variety || 'Local Standard'}</p>
            </div>

            {/* Core Stats info */}
            <div className="my-4 grid grid-cols-2 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Planned Land Size</span>
                <p className="font-bold text-slate-800">{crop.areaValue} {crop.areaUnit}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Seed/Input Cost</span>
                <p className="font-bold text-slate-800 flex items-center">
                  <IndianRupee className="w-3 h-3 text-slate-500 mr-0.5" />
                  <span>{crop.inputCost.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Timelines progress */}
            <div className="space-y-2 border-t border-slate-50 pt-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Sown on: <b>{crop.sowingDate || '--'}</b></span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Expected Harvest: <b className="text-emerald-700">{crop.expectedHarvest || '--'}</b></span>
              </div>
            </div>

            {/* Financial Ledger Integration Breakdown badge section */}
            <div className="mt-3.5 pt-3.5 border-t border-slate-100 space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-1">
                <span>Integrated Ledger Balances</span>
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-extrabold text-[8px]">Auto synced</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-semibold text-slate-600">
                <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-400">Fertilizer:</span>
                  <span className="font-bold text-slate-700">₹{(crop.fertilizerCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-400">Pesticides:</span>
                  <span className="font-bold text-slate-700">₹{(crop.pesticideCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 bg-slate-50 rounded border border-slate-100">
                  <span className="text-slate-400">Labour:</span>
                  <span className="font-bold text-slate-700">₹{(crop.laborCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 bg-emerald-50/50 rounded border border-emerald-100/50 text-emerald-800">
                  <span className="text-emerald-600">Sale Income:</span>
                  <span className="font-bold font-mono">₹{(crop.harvestIncome || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Net Balance calculation */}
              {((crop.harvestIncome || 0) > 0 || (crop.inputCost || 0) > 0 || (crop.fertilizerCost || 0) > 0 || (crop.pesticideCost || 0) > 0 || (crop.laborCost || 0) > 0) && (
                <div className="flex justify-between items-center px-2.5 py-1.5 rounded-lg border text-xs mt-1 bg-slate-50/60 font-bold">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">Fasal Total Net Profit</span>
                  {(() => {
                    const totalExpense = (crop.inputCost || 0) + (crop.fertilizerCost || 0) + (crop.pesticideCost || 0) + (crop.laborCost || 0);
                    const profit = (crop.harvestIncome || 0) - totalExpense;
                    return (
                      <span className={profit >= 0 ? "text-emerald-700" : "text-rose-600"}>
                        {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()}
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* CRUD Buttons */}
            <div className="flex space-x-2 border-t border-slate-50 pt-4 mt-4">
              <button
                type="button"
                onClick={() => setEditingCrop(crop)}
                className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs py-2 rounded-xl transition"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Manage</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this crop cycle registration?')) {
                    onDeleteCrop(crop.id);
                  }
                }}
                className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 p-2 rounded-xl transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredCrops.length === 0 && (
          <div className="col-span-full border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-3">
            <Sprout className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No registered crops match your search or filter.</p>
            <p className="text-xs">Click "Plan / Sow New Crop" to register an agricultural cycle.</p>
          </div>
        )}
      </div>

    </div>
  );
};
