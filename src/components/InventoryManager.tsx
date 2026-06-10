import React, { useState } from 'react';
import { InventoryItem, Farm } from '../types';
import { Package, Plus, Trash2, Edit2, ShieldAlert, CheckCircle2, ChevronRight, ShoppingCart } from 'lucide-react';

interface InventoryManagerProps {
  currentFarm: Farm;
  inventory: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdateItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  currentFarm,
  inventory,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  const farmInventory = inventory.filter(i => i.farmId === currentFarm.id);

  // States
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Add Item Fields
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<'Seeds' | 'Fertilizer' | 'Pesticides' | 'Diesel' | 'Tools' | 'Other'>('Seeds');
  const [newQty, setNewQty] = useState<number>(10);
  const [newUnit, setNewUnit] = useState<'Bags' | 'Liters' | 'Kg' | 'Packets' | 'Units'>('Bags');
  const [newDate, setNewDate] = useState('2026-06-09');
  const [newCost, setNewCost] = useState<number>(1500);
  const [newThreshold, setNewThreshold] = useState<number>(3);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || newQty < 0) return;
    onAddItem({
      farmId: currentFarm.id,
      itemName: newName,
      category: newCat,
      quantity: newQty,
      unit: newUnit,
      purchaseDate: newDate,
      cost: newCost,
      lowStockThreshold: newThreshold
    });
    setNewName('');
    setNewQty(10);
    setNewCost(1500);
    setNewThreshold(3);
    setShowAddForm(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    onUpdateItem(editingItem);
    setEditingItem(null);
  };

  const handleQuickRestock = (item: InventoryItem, qtyAdd: number) => {
    const updated: InventoryItem = {
      ...item,
      quantity: item.quantity + qtyAdd
    };
    onUpdateItem(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="title-inventory" className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>Khet Godown / Inventory Store</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit stockpiles of seeds, urea, Single Super Phosphates (SSP), chemical pesticides, and tractor diesel. Ensure low-stock alerts are visible.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition shadow-xs self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stock Item</span>
        </button>
      </div>

      {/* Add Item form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">Add New Godown Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Item Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Di-Ammonuim Phosphate (DAP)"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Stock Category *</label>
              <select
                value={newCat}
                onChange={e => setNewCat(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Seeds">Seeds</option>
                <option value="Fertilizer">Fertilizers / Urea</option>
                <option value="Pesticides">Pesticides / Insecticides</option>
                <option value="Diesel">Diesel Level</option>
                <option value="Tools">Agricultural Tools</option>
                <option value="Other">Other Goods</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={newQty}
                onChange={e => setNewQty(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Stock Units</label>
              <select
                value={newUnit}
                onChange={e => setNewUnit(e.target.value as any)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              >
                <option value="Bags">Bags (Kattey)</option>
                <option value="Liters">Liters (Ltr)</option>
                <option value="Kg">Kg</option>
                <option value="Packets">Packets</option>
                <option value="Units">Tools / Pieces</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Purchase Date</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Total Procurement Cost (₹)</label>
              <input
                type="number"
                min="0"
                value={newCost}
                onChange={e => setNewCost(Number(e.target.value))}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Low Stock Warning Threshold *</label>
              <input
                type="number"
                required
                min="1"
                value={newThreshold}
                onChange={e => setNewThreshold(Number(e.target.value))}
                className="w-full text-sm border border-emerald-300 rounded-xl px-3 py-2 bg-white text-slate-800"
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
              Save Stock Entry
            </button>
          </div>
        </form>
      )}

      {/* Edit Item form */}
      {editingItem && (
        <form onSubmit={handleEditSubmit} className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-amber-800 text-sm">Edit Inventory Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Item Title</label>
              <input
                type="text"
                required
                value={editingItem.itemName}
                onChange={e => setEditingItem({ ...editingItem, itemName: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Quantity</label>
              <input
                type="number"
                required
                min="0"
                value={editingItem.quantity}
                onChange={e => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Low warning Threshold</label>
              <input
                type="number"
                required
                min="1"
                value={editingItem.lowStockThreshold}
                onChange={e => setEditingItem({ ...editingItem, lowStockThreshold: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Cost (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={editingItem.cost}
                onChange={e => setEditingItem({ ...editingItem, cost: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
            >
              Update Stock Info
            </button>
          </div>
        </form>
      )}

      {/* Main Stock layout grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {farmInventory.map((item) => {
          const isLowStock = item.quantity <= item.lowStockThreshold;
          return (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300/80 transition-all ${isLowStock ? 'border-rose-200 ring-2 ring-rose-50' : 'border-slate-100'}`}
            >
              {/* Badge info */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                    {item.category}
                  </span>
                  
                  {isLowStock ? (
                    <span className="text-[10px] text-rose-800 bg-rose-50 border border-rose-100 font-bold px-2 py-0.5 rounded flex items-center space-x-0.5 uppercase tracking-wider animate-pulse">
                      <ShieldAlert className="w-3 h-3 text-rose-600" />
                      <span>Low Stock!</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-100 font-semibold px-2 py-0.5 rounded flex items-center space-x-0.5 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>In Stock</span>
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-slate-800 text-base leading-snug">{item.itemName}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Procured: {item.purchaseDate}</p>

                {/* Core quantitative info size */}
                <div className="my-3.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100/60 leading-tight">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Available Stock Pile</span>
                  <div className="flex items-baseline space-x-1.5 mt-1">
                    <span className="text-2xl font-black text-slate-900">{item.quantity}</span>
                    <span className="text-sm font-bold text-slate-500">{item.unit}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1.5 block">
                    Low Stock Threshold Limit: <b className="text-slate-700">{item.lowStockThreshold} {item.unit}</b>
                  </span>
                </div>
              </div>

              {/* Action layout */}
              <div className="border-t border-slate-50 pt-4 space-y-3">
                
                {/* Micro operational trigger: quick restock button */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-2 rounded-xl">
                  <span>Quick Restock:</span>
                  <div className="space-x-1">
                    <button
                      onClick={() => handleQuickRestock(item, 5)}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded shadow-xs"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => handleQuickRestock(item, 10)}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded shadow-xs"
                    >
                      +10
                    </button>
                  </div>
                </div>

                {/* Edit/Delete row */}
                <div className="flex space-x-2 text-xs font-bold pt-1">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 rounded-lg transition text-center"
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this stock item from stockpile logs?')) {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 p-2 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}

        {farmInventory.length === 0 && (
          <div className="col-span-full border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 py-16">
            <Package className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No stock commodities found in godown register.</p>
            <p className="text-xs">Click "Add Stock Item" to track your seed bags, fertilizers, and diesel levels.</p>
          </div>
        )}
      </div>

    </div>
  );
};
