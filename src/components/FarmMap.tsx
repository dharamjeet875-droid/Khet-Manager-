import React, { useState } from 'react';
import { Plot, Farm, PlotStatus } from '../types';
import { Map, Plus, Trash2, Edit2, Layers, CheckCircle, Info } from 'lucide-react';

interface FarmMapProps {
  currentFarm: Farm;
  plots: Plot[];
  onAddPlot: (plot: Omit<Plot, 'id'>) => void;
  onUpdatePlot: (plot: Plot) => void;
  onDeletePlot: (id: string) => void;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  currentFarm,
  plots,
  onAddPlot,
  onUpdatePlot,
  onDeletePlot
}) => {
  const farmPlots = plots.filter(p => p.farmId === currentFarm.id);
  
  // State for selected plot inspect
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  
  // State for Add Plot Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlotName, setNewPlotName] = useState('');
  const [newPlotArea, setNewPlotArea] = useState<number>(1);
  const [newPlotAreaUnit, setNewPlotAreaUnit] = useState<'Acres' | 'Bighas' | 'Kanals' | 'Killas'>('Acres');
  const [newPlotCrop, setNewPlotCrop] = useState('Fallow (Khaali)');
  const [newPlotStatus, setNewPlotStatus] = useState<PlotStatus>('Fallow');
  const [newSowingDate, setNewSowingDate] = useState('');
  const [newExpectedHarvest, setNewExpectedHarvest] = useState('');

  // State for Edit Plot Form
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlotName) return;
    onAddPlot({
      farmId: currentFarm.id,
      name: newPlotName,
      areaValue: Number(newPlotArea),
      areaUnit: newPlotAreaUnit,
      currentCrop: newPlotCrop,
      sowingDate: newSowingDate,
      expectedHarvest: newExpectedHarvest,
      status: newPlotStatus
    });
    // Reset
    setNewPlotName('');
    setNewPlotArea(1);
    setNewPlotCrop('Fallow (Khaali)');
    setNewPlotStatus('Fallow');
    setNewSowingDate('');
    setNewExpectedHarvest('');
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlot) return;
    onUpdatePlot(editingPlot);
    // If the selected plot was this one, update inspect modal too
    if (selectedPlot?.id === editingPlot.id) {
      setSelectedPlot(editingPlot);
    }
    setEditingPlot(null);
  };

  const getStatusColor = (status: PlotStatus) => {
    switch (status) {
      case 'Growing':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700';
      case 'Sowed':
        return 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700';
      case 'Harvested':
        return 'bg-yellow-500 hover:bg-yellow-600 text-slate-900 border-yellow-600';
      case 'Fallow':
      default:
        return 'bg-stone-200 hover:bg-stone-300 text-slate-800 border-stone-300';
    }
  };

  const getStatusBadge = (status: PlotStatus) => {
    switch (status) {
      case 'Growing':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-xs">Growing (Hara)</span>;
      case 'Sowed':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg text-xs">Sowed (Bijaai)</span>;
      case 'Harvested':
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 font-bold rounded-lg text-xs">Harvested (Kataai)</span>;
      case 'Fallow':
      default:
        return <span className="px-2.5 py-1 bg-stone-100 text-stone-700 font-bold rounded-lg text-xs font-mono">Fallow (Khaali)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="title-farm-map" className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <Map className="w-6 h-6 text-emerald-600 animate-pulse" />
            <span>Farm Map & Field Divisions</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visual field layout showing Killa, Murabba, or Kanal divisions for <span className="font-semibold text-emerald-700">{currentFarm.name}</span>.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-xs self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Division / Killa</span>
        </button>
      </div>

      {/* Forms Drawer */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Create New Field Division</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Division/Killa Name *</label>
              <input
                type="text"
                placeholder="e.g., Killa No. 12"
                required
                value={newPlotName}
                onChange={e => setNewPlotName(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Area Size</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={newPlotArea}
                onChange={e => setNewPlotArea(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Area Unit</label>
              <select
                value={newPlotAreaUnit}
                onChange={e => setNewPlotAreaUnit(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Acres">Acres</option>
                <option value="Bighas">Bighas</option>
                <option value="Kanals">Kanals</option>
                <option value="Killas">Killas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Current Seed / Crop</label>
              <input
                type="text"
                value={newPlotCrop}
                onChange={e => setNewPlotCrop(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Division Status</label>
              <select
                value={newPlotStatus}
                onChange={e => setNewPlotStatus(e.target.value as PlotStatus)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Growing">Growing</option>
                <option value="Sowed">Sowed</option>
                <option value="Harvested">Harvested</option>
                <option value="Fallow">Fallow</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Sowing Date</label>
              <input
                type="date"
                value={newSowingDate}
                onChange={e => setNewSowingDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Expected Harvest Date</label>
              <input
                type="date"
                value={newExpectedHarvest}
                onChange={e => setNewExpectedHarvest(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Save New Division
            </button>
          </div>
        </form>
      )}

      {/* Edit Form Drawer */}
      {editingPlot && (
        <form onSubmit={handleEditSubmit} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-amber-800 text-sm">Edit Division: {editingPlot.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Division Name</label>
              <input
                type="text"
                required
                value={editingPlot.name}
                onChange={e => setEditingPlot({ ...editingPlot, name: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Area Size</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={editingPlot.areaValue}
                onChange={e => setEditingPlot({ ...editingPlot, areaValue: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Area Unit</label>
              <select
                value={editingPlot.areaUnit}
                onChange={e => setEditingPlot({ ...editingPlot, areaUnit: e.target.value as any })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Acres">Acres</option>
                <option value="Bighas">Bighas</option>
                <option value="Kanals">Kanals</option>
                <option value="Killas">Killas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Current Crop variety</label>
              <input
                type="text"
                value={editingPlot.currentCrop}
                onChange={e => setEditingPlot({ ...editingPlot, currentCrop: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Status</label>
              <select
                value={editingPlot.status}
                onChange={e => setEditingPlot({ ...editingPlot, status: e.target.value as PlotStatus })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Growing">Growing</option>
                <option value="Sowed">Sowed</option>
                <option value="Harvested">Harvested</option>
                <option value="Fallow">Fallow</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Sowing Date</label>
              <input
                type="date"
                value={editingPlot.sowingDate}
                onChange={e => setEditingPlot({ ...editingPlot, sowingDate: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Expected Harvest Date</label>
              <input
                type="date"
                value={editingPlot.expectedHarvest}
                onChange={e => setEditingPlot({ ...editingPlot, expectedHarvest: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingPlot(null)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Update Division
            </button>
          </div>
        </form>
      )}

      {/* Main Split: Interactive Grid Map on Left, Selected Division inspector panel on Right! */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Farm Map Layout */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border-4 border-slate-800 text-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Interlocking Soil Grid Layout (Tap to Inspect)</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900/60 font-mono">
                {farmPlots.length} Plots Defined
              </span>
            </div>

            {/* Simulated farm grid map */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 min-h-[220px]">
              {farmPlots.map((plot) => (
                <button
                  type="button"
                  key={plot.id}
                  onClick={() => setSelectedPlot(plot)}
                  className={`relative p-5 rounded-2xl border-2 text-left min-h-[100px] flex flex-col justify-between transition-all transform hover:-translate-y-1 hover:shadow-md cursor-pointer ${getStatusColor(plot.status)} ${selectedPlot?.id === plot.id ? 'ring-4 ring-emerald-400 border-white font-extrabold scale-[1.02]' : ''}`}
                >
                  <div>
                    <h4 className="text-sm font-bold truncate">{plot.name}</h4>
                    <p className="text-xs font-medium opacity-85 mt-0.5">
                      {plot.areaValue} {plot.areaUnit}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/20 block truncate text-center mt-3 uppercase tracking-wider">
                      {plot.currentCrop || 'Khaali'}
                    </span>
                  </div>
                </button>
              ))}
              
              {farmPlots.length === 0 && (
                <div className="col-span-full border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-400 space-y-2">
                  <p className="text-sm font-semibold text-slate-300">No plots defined on this farm map yet.</p>
                  <p className="text-xs">Click "Add New Division" above to build a custom map division block.</p>
                </div>
              )}
            </div>

            {/* Color key guide */}
            <div className="flex flex-wrap items-center gap-3 pt-6 text-xs text-slate-300 border-t border-slate-800 mt-4">
              <span className="font-semibold text-slate-400">Map Legend:</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 bg-emerald-600 rounded-md border border-emerald-700"></span>
                <span>Growing (Hara)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 bg-amber-600 rounded-md border border-amber-700"></span>
                <span>Sowed (Bijaai)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 bg-yellow-500 rounded-md border border-yellow-600"></span>
                <span>Harvested (Kataai)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3.5 h-3.5 bg-stone-300 rounded-md border border-stone-400"></span>
                <span>Fallow (Khaali)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Plot Detail Inspector Panel */}
        <div className="space-y-4">
          {selectedPlot ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800">{selectedPlot.name}</h3>
                  <p className="text-xs text-slate-500">Selected Plot Inspect</p>
                </div>
                {getStatusBadge(selectedPlot.status)}
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 font-medium">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span>Farm Area Coverage:</span>
                  <strong className="text-slate-800">{selectedPlot.areaValue} {selectedPlot.areaUnit}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span>Current seed variety:</span>
                  <strong className="text-slate-600 font-semibold">{selectedPlot.currentCrop || 'Fallow / Uncultivated'}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span>Sowing Date:</span>
                  <strong className="text-slate-800">{selectedPlot.sowingDate || '--'}</strong>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Expected Harvest Duty:</span>
                  <strong className="text-emerald-700 font-bold">{selectedPlot.expectedHarvest || '--'}</strong>
                </div>
              </div>

              {/* Edit/Delete Actions */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlot(selectedPlot)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 font-bold text-xs px-3 py-2 rounded-xl transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Division</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this plot division?')) {
                      onDeletePlot(selectedPlot.id);
                      setSelectedPlot(null);
                    }
                  }}
                  className="flex-shrink-0 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 p-2.5 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-6 text-center text-slate-400 space-y-2 h-full flex flex-col justify-center min-h-[160px]">
              <Info className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">No plot selected.</p>
              <p className="text-[11px] leading-tight">Tap any color box in the field map to inspect current crop records, update date timelines, or delete division.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
