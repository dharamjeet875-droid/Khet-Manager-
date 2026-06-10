import React, { useState } from 'react';
import { Livestock, Farm, MilkLogEntry } from '../types';
import { Plus, Trash2, Edit2, TrendingUp, Calendar, Heart, ShieldAlert, Award } from 'lucide-react';

interface LivestockManagerProps {
  currentFarm: Farm;
  livestock: Livestock[];
  onAddAnimal: (animal: Omit<Livestock, 'id'>) => void;
  onUpdateAnimal: (animal: Livestock) => void;
  onDeleteAnimal: (id: string) => void;
}

export const LivestockManager: React.FC<LivestockManagerProps> = ({
  currentFarm,
  livestock,
  onAddAnimal,
  onUpdateAnimal,
  onDeleteAnimal
}) => {
  const farmLivestock = livestock.filter(l => l.farmId === currentFarm.id);

  // States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Livestock | null>(null);

  // Add Animal Inputs
  const [newType, setNewType] = useState<'Buffalo'|'Cow'|'Goat'|'Sheep'|'Poultry'|'Other'>('Buffalo');
  const [newBreed, setNewBreed] = useState('');
  const [newCount, setNewCount] = useState<number>(2);
  const [newHealth, setNewHealth] = useState('');
  const [newFeedCost, setNewFeedCost] = useState<number>(1200);

  // Milk logging on sub-panel
  const [selectedAnimalForMilk, setSelectedAnimalForMilk] = useState<Livestock | null>(null);
  const [newMilkDate, setNewMilkDate] = useState('2026-06-09');
  const [newMilkValue, setNewMilkValue] = useState<number>(10);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCount <= 0) return;
    onAddAnimal({
      farmId: currentFarm.id,
      type: newType,
      breed: newBreed,
      count: newCount,
      healthEvents: newHealth,
      feedCost: newFeedCost,
      milkLogs: []
    });
    setNewBreed('');
    setNewHealth('');
    setNewFeedCost(1200);
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnimal) return;
    onUpdateAnimal(editingAnimal);
    setEditingAnimal(null);
  };

  const handleAddMilkLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimalForMilk || newMilkValue <= 0) return;
    
    const newLog: MilkLogEntry = {
      id: `ml-new-${Date.now()}`,
      date: newMilkDate,
      yieldLiters: Number(newMilkValue)
    };

    const updatedAnimal: Livestock = {
      ...selectedAnimalForMilk,
      milkLogs: [newLog, ...selectedAnimalForMilk.milkLogs]
    };

    onUpdateAnimal(updatedAnimal);
    setSelectedAnimalForMilk(updatedAnimal); // refresh detail view
    setNewMilkValue(10);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="title-livestock" className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <Heart className="w-6 h-6 text-emerald-600 animate-pulse" />
            <span>Pashudhan / Livestock Manager</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track dairy animals, breed registrations, vaccination health schedules, feed expenses, and daily milk yield counts.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Register Animal Breed</span>
        </button>
      </div>

      {/* Add Animal Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Add Animal / Herd Record</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Animal Category *</label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Buffalo">Buffalo (Bhains)</option>
                <option value="Cow">Cow (Gaay)</option>
                <option value="Goat">Goat (Bakri)</option>
                <option value="Poultry">Poultry (Murgi Paalan)</option>
                <option value="Other">Other Category</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Breed Name</label>
              <input
                type="text"
                placeholder="e.g. Murrah Black, Sahiwal"
                value={newBreed}
                onChange={e => setNewBreed(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Animal Count *</label>
              <input
                type="number"
                required
                min="1"
                value={newCount}
                onChange={e => setNewCount(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Monthly Feed Expenses (₹)</label>
              <input
                type="number"
                min="0"
                value={newFeedCost}
                onChange={e => setNewFeedCost(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Vaccinations & Health Status</label>
            <input
              type="text"
              placeholder="e.g. Deworming done, FMD Injection completed..."
              value={newHealth}
              onChange={e => setNewHealth(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
            />
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
              Save Pashu Record
            </button>
          </div>
        </form>
      )}

      {/* Edit Animal Form */}
      {editingAnimal && (
        <form onSubmit={handleEditSubmit} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-amber-800 text-xs">Edit LiveStock details</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Breed Name</label>
              <input
                type="text"
                required
                value={editingAnimal.breed}
                onChange={e => setEditingAnimal({ ...editingAnimal, breed: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Head Count</label>
              <input
                type="number"
                required
                min="1"
                value={editingAnimal.count}
                onChange={e => setEditingAnimal({ ...editingAnimal, count: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Monthly Feed Cost (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={editingAnimal.feedCost}
                onChange={e => setEditingAnimal({ ...editingAnimal, feedCost: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Health Status History</label>
              <input
                type="text"
                required
                value={editingAnimal.healthEvents}
                onChange={e => setEditingAnimal({ ...editingAnimal, healthEvents: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingAnimal(null)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Update Record
            </button>
          </div>
        </form>
      )}

      {/* Main split: Animal list on Left, Milk yield logger on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Animal Cards list left */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farmLivestock.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-emerald-200 transition-all space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded border border-slate-200">
                      {item.type} (Pashu)
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-base mt-2 flex items-center space-x-1.5">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span>{item.breed || 'Desi Breed'}</span>
                    </h3>
                  </div>
                  <span className="text-xl font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                    {item.count} Animals
                  </span>
                </div>

                <div className="bg-slate-50/75 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Monthly Food Cost:</span>
                    <strong className="text-slate-800">₹{item.feedCost.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vaccination Records:</span>
                    <strong className="text-slate-600 font-semibold text-right truncate max-w-[150px]">{item.healthEvents || 'All healthy'}</strong>
                  </div>
                </div>

                {/* Sub Action controls */}
                <div className="flex space-x-2 pt-2 border-t border-slate-50 text-xs font-bold">
                  <button
                    onClick={() => {
                      setSelectedAnimalForMilk(item);
                      setNewMilkValue(10);
                    }}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 py-1.5 rounded-lg transition text-center"
                  >
                    Log Milk Output (Dudh)
                  </button>
                  <button
                    onClick={() => setEditingAnimal(item)}
                    className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition"
                    title="Edit record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this livestock record?')) {
                        onDeleteAnimal(item.id);
                        if (selectedAnimalForMilk?.id === item.id) {
                          setSelectedAnimalForMilk(null);
                        }
                      }
                    }}
                    className="p-1 px-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {farmLivestock.length === 0 && (
              <div className="col-span-full border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400">
                No livestock records entered for Sultanpuria or Suratgarh Farm yet.
              </div>
            )}
          </div>
        </div>

        {/* Detailed Milk Yield panel card right */}
        <div className="space-y-4">
          {selectedAnimalForMilk ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-800 leading-tight">Milk yield: {selectedAnimalForMilk.breed}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Yield register log for the dairy herd</p>
              </div>

              {/* Add Milk Log Form */}
              <form onSubmit={handleAddMilkLog} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Record raw Liters output</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Date</label>
                    <input
                      type="date"
                      required
                      value={newMilkDate}
                      onChange={e => setNewMilkDate(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 block mb-0.5">Liters Count (Ltr)</label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      required
                      value={newMilkValue}
                      onChange={e => setNewMilkValue(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded transition"
                >
                  Save Dual Daily Yield
                </button>
              </form>

              {/* Milk Log feed */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Historial yield counts (Ltrs)</span>
                
                <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
                  {selectedAnimalForMilk.milkLogs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs font-semibold text-slate-700 border border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{log.date}</span>
                      </div>
                      <span className="font-extrabold text-emerald-700">{log.yieldLiters} Liters</span>
                    </div>
                  ))}

                  {selectedAnimalForMilk.milkLogs.length === 0 && (
                    <p className="text-center text-[11px] text-slate-400 py-6">No yields logged. Create the first daily log above.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 space-y-2 py-12">
              <ShieldAlert className="w-8 h-8 mx-auto text-slate-300" />
              <h4 className="text-xs font-bold text-slate-700">Explore Milk Yield Logs</h4>
              <p className="text-[11px] leading-tight">Tap "Log Milk Output (Dudh)" on any breed card on the left to open sub-registers for tracking daily liters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
