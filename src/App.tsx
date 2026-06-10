import React, { useState, useEffect } from 'react';
import { 
  Farm, 
  Crop, 
  Plot, 
  JournalEntry, 
  FinanceLedgerEntry, 
  FarmDocument, 
  Livestock, 
  Labour, 
  InventoryItem 
} from './types';
import { 
  INITIAL_FARMS, 
  INITIAL_PLOTS, 
  INITIAL_CROPS, 
  INITIAL_JOURNAL, 
  INITIAL_FINANCEDATA, 
  INITIAL_DOCUMENTS, 
  INITIAL_LIVESTOCK, 
  INITIAL_LABOUR, 
  INITIAL_INVENTORY 
} from './initialData';
import { 
  loadLocalState, 
  saveLocalState, 
  isCloudSyncEnabled, 
  SUPABASE_CONFIG 
} from './supabaseClient';

// Import Modular Screen Components
import { Dashboard } from './components/Dashboard';
import { FarmMap } from './components/FarmMap';
import { CropManager } from './components/CropManager';
import { JournalDiary } from './components/JournalDiary';
import { FinanceTracker } from './components/FinanceTracker';
import { Documents } from './components/Documents';
import { LivestockManager } from './components/LivestockManager';
import { LabourManager } from './components/LabourManager';
import { InventoryManager } from './components/InventoryManager';
import { WeatherMandi } from './components/WeatherMandi';

// Icons
import { 
  Compass, 
  Map, 
  Sprout, 
  BookOpen, 
  IndianRupee, 
  Layers, 
  Briefcase, 
  Heart, 
  FileText, 
  Package, 
  CloudSun,
  Database,
  ChevronsUpDown,
  MoreHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Global context states
  const [currentFarm, setCurrentFarm] = useState<Farm>(INITIAL_FARMS[0]);
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [isCloudActive] = useState<boolean>(isCloudSyncEnabled());

  // Navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  // Core Data Lists synced to LocalStorage falls back to static seed data
  const [crops, setCrops] = useState<Crop[]>(() => loadLocalState('crops', INITIAL_CROPS));
  const [plots, setPlots] = useState<Plot[]>(() => loadLocalState('plots', INITIAL_PLOTS));
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => loadLocalState('journal', INITIAL_JOURNAL));
  const [finances, setFinances] = useState<FinanceLedgerEntry[]>(() => loadLocalState('finance', INITIAL_FINANCEDATA));
  const [documents, setDocuments] = useState<FarmDocument[]>(() => loadLocalState('documents', INITIAL_DOCUMENTS));
  const [livestock, setLivestock] = useState<Livestock[]>(() => loadLocalState('livestock', INITIAL_LIVESTOCK));
  const [labourTeam, setLabourTeam] = useState<Labour[]>(() => loadLocalState('labour', INITIAL_LABOUR));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadLocalState('inventory', INITIAL_INVENTORY));

  // Sync state effect handlers
  useEffect(() => { saveLocalState('crops', crops); }, [crops]);
  useEffect(() => { saveLocalState('plots', plots); }, [plots]);
  useEffect(() => { saveLocalState('journal', journalEntries); }, [journalEntries]);
  useEffect(() => { saveLocalState('finance', finances); }, [finances]);
  useEffect(() => { saveLocalState('documents', documents); }, [documents]);
  useEffect(() => { saveLocalState('livestock', livestock); }, [livestock]);
  useEffect(() => { saveLocalState('labour', labourTeam); }, [labourTeam]);
  useEffect(() => { saveLocalState('inventory', inventory); }, [inventory]);

  // CRUD Operation Handlers (Crops)
  const handleAddCrop = (newCrop: Omit<Crop, 'id'>) => {
    const cropId = `crop-${Date.now()}`;
    const crop: Crop = { ...newCrop, id: cropId };
    setCrops(prev => [crop, ...prev]);

    // Auto-sync multiple expenses and returns to the global Finance ledger
    const newTransactions: FinanceLedgerEntry[] = [];
    const dateStr = newCrop.sowingDate || new Date().toISOString().split('T')[0];

    const addTx = (category: any, amount: number, label: string) => {
      if (amount > 0) {
        newTransactions.push({
          id: `finance-${category}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          farmId: newCrop.farmId,
          type: category === 'Sale Income' ? 'income' : 'expense',
          category: category,
          amount: amount,
          date: dateStr,
          notes: `${label} for crop "${newCrop.name}" (${newCrop.variety || 'Standard Var'}) [Crop Ref: ${cropId}] [Type: ${category}]`,
          season: newCrop.season
        });
      }
    };

    addTx('Seeds', newCrop.inputCost, 'Seed/Input Cost');
    if (newCrop.fertilizerCost && newCrop.fertilizerCost > 0) {
      addTx('Fertilizer', newCrop.fertilizerCost, 'Fertilizer Cost');
    }
    if (newCrop.pesticideCost && newCrop.pesticideCost > 0) {
      addTx('Pesticide', newCrop.pesticideCost, 'Pesticide/Spray Cost');
    }
    if (newCrop.laborCost && newCrop.laborCost > 0) {
      addTx('Labour', newCrop.laborCost, 'Labour Cost');
    }
    if (newCrop.harvestIncome && newCrop.harvestIncome > 0) {
      addTx('Sale Income', newCrop.harvestIncome, 'Market Sale Returns/Inflow');
    }

    if (newTransactions.length > 0) {
      setFinances(prev => [...newTransactions, ...prev]);
    }
  };

  const handleUpdateCrop = (updatedCrop: Crop) => {
    setCrops(prev => prev.map(c => c.id === updatedCrop.id ? updatedCrop : c));

    // Update, insert, or remove related financial ledger entries
    setFinances(prev => {
      let updatedFinances = [...prev];
      const categories: { key: keyof Crop; cat: any; label: string }[] = [
        { key: 'inputCost', cat: 'Seeds', label: 'Seed/Input Cost' },
        { key: 'fertilizerCost', cat: 'Fertilizer', label: 'Fertilizer Cost' },
        { key: 'pesticideCost', cat: 'Pesticide', label: 'Pesticide/Spray Cost' },
        { key: 'laborCost', cat: 'Labour', label: 'Labour Cost' },
        { key: 'harvestIncome', cat: 'Sale Income', label: 'Market Sale Returns/Inflow' }
      ];

      for (const item of categories) {
        const value = Number(updatedCrop[item.key] || 0);
        const refToken = `[Crop Ref: ${updatedCrop.id}] [Type: ${item.cat}]`;
        
        // Find existing index by searching reference tags. Handle backward compatibility for non-tagged Seeds records too.
        const existingIdx = updatedFinances.findIndex(f => 
          f.notes.includes(refToken) || 
          (item.cat === 'Seeds' && f.notes.includes(`[Crop Ref: ${updatedCrop.id}]`) && !f.notes.includes('[Type:'))
        );

        if (existingIdx !== -1) {
          if (value > 0) {
            // Update existing entry
            updatedFinances[existingIdx] = {
              ...updatedFinances[existingIdx],
              amount: value,
              date: updatedCrop.sowingDate || new Date().toISOString().split('T')[0],
              season: updatedCrop.season,
              notes: `${item.label} for crop "${updatedCrop.name}" (${updatedCrop.variety || 'Standard Var'}) ${refToken}`
            };
          } else {
            // Cost cleared out or deleted, so filter it out
            updatedFinances = updatedFinances.filter((_, idx) => idx !== existingIdx);
          }
        } else if (value > 0) {
          // Create new financial ledger entry
          updatedFinances.unshift({
            id: `finance-${item.cat}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            farmId: updatedCrop.farmId,
            type: item.cat === 'Sale Income' ? 'income' : 'expense',
            category: item.cat,
            amount: value,
            date: updatedCrop.sowingDate || new Date().toISOString().split('T')[0],
            notes: `${item.label} for crop "${updatedCrop.name}" (${updatedCrop.variety || 'Standard Var'}) ${refToken}`,
            season: updatedCrop.season
          });
        }
      }

      return updatedFinances;
    });
  };

  const handleDeleteCrop = (id: string) => {
    setCrops(prev => prev.filter(c => c.id !== id));
    // Remove all financial ledger transactions associated with this crop reference
    setFinances(prev => prev.filter(f => !f.notes.includes(`[Crop Ref: ${id}]`)));
  };

  // CRUD Operation Handlers (Plots)
  const handleAddPlot = (newPlot: Omit<Plot, 'id'>) => {
    const plot: Plot = { ...newPlot, id: `plot-${Date.now()}` };
    setPlots(prev => [...prev, plot]);
  };
  const handleUpdatePlot = (updatedPlot: Plot) => {
    setPlots(prev => prev.map(p => p.id === updatedPlot.id ? updatedPlot : p));
  };
  const handleDeletePlot = (id: string) => {
    setPlots(prev => prev.filter(p => p.id !== id));
  };

  // CRUD Operation Handlers (Journal)
  const handleAddJournalEntry = (newEntry: Omit<JournalEntry, 'id'>) => {
    const entry: JournalEntry = { ...newEntry, id: `journal-${Date.now()}` };
    setJournalEntries(prev => [entry, ...prev]);
  };
  const handleUpdateJournalEntry = (updatedEntry: JournalEntry) => {
    setJournalEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };
  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  };

  // CRUD Operation Handlers (Finances)
  const handleAddTransaction = (newTrans: Omit<FinanceLedgerEntry, 'id'>) => {
    const trans: FinanceLedgerEntry = { ...newTrans, id: `finance-${Date.now()}` };
    setFinances(prev => [trans, ...prev]);
  };
  const handleUpdateTransaction = (updatedTrans: FinanceLedgerEntry) => {
    setFinances(prev => prev.map(f => f.id === updatedTrans.id ? updatedTrans : f));
  };
  const handleDeleteTransaction = (id: string) => {
    setFinances(prev => prev.filter(f => f.id !== id));
  };

  // CRUD Handlers (Documents)
  const handleAddDocument = (newDoc: Omit<FarmDocument, 'id'>) => {
    const doc: FarmDocument = { ...newDoc, id: `doc-${Date.now()}` };
    setDocuments(prev => [doc, ...prev]);
  };
  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // CRUD Handlers (Livestock)
  const handleAddLivestock = (newAnimal: Omit<Livestock, 'id'>) => {
    const animal: Livestock = { ...newAnimal, id: `live-${Date.now()}` };
    setLivestock(prev => [animal, ...prev]);
  };
  const handleUpdateLivestock = (updatedAnimal: Livestock) => {
    setLivestock(prev => prev.map(l => l.id === updatedAnimal.id ? updatedAnimal : l));
  };
  const handleDeleteLivestock = (id: string) => {
    setLivestock(prev => prev.filter(l => l.id !== id));
  };

  // CRUD Handlers (Labour)
  const handleAddLabour = (newLab: Omit<Labour, 'id'>) => {
    const worker: Labour = { ...newLab, id: `lab-${Date.now()}` };
    setLabourTeam(prev => [worker, ...prev]);
  };
  const handleUpdateLabour = (updatedLab: Labour) => {
    setLabourTeam(prev => prev.map(l => l.id === updatedLab.id ? updatedLab : l));
  };
  const handleDeleteLabour = (id: string) => {
    setLabourTeam(prev => prev.filter(l => l.id !== id));
  };

  // CRUD Handlers (Inventory)
  const handleAddInventory = (newItem: Omit<InventoryItem, 'id'>) => {
    const item: InventoryItem = { ...newItem, id: `inv-${Date.now()}` };
    setInventory(prev => [item, ...prev]);
  };
  const handleUpdateInventory = (updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
  };
  const handleDeleteInventory = (id: string) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  // Dynamic Navigation director
  const handleNavigate = (tabId: string) => {
    setActiveTab(tabId);
    setShowMoreMenu(false);
  };

  // Render correct active screen module inside wrapper container
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            currentFarm={currentFarm}
            crops={crops}
            finances={finances}
            inventory={inventory}
            labourCount={labourTeam.filter(l => l.farmId === currentFarm.id).length}
            onNavigate={handleNavigate}
          />
        );
      case 'map':
        return (
          <FarmMap 
            currentFarm={currentFarm}
            plots={plots}
            onAddPlot={handleAddPlot}
            onUpdatePlot={handleUpdatePlot}
            onDeletePlot={handleDeletePlot}
          />
        );
      case 'crops':
        return (
          <CropManager 
            currentFarm={currentFarm}
            crops={crops}
            onAddCrop={handleAddCrop}
            onUpdateCrop={handleUpdateCrop}
            onDeleteCrop={handleDeleteCrop}
          />
        );
      case 'diary':
        return (
          <JournalDiary 
            currentFarm={currentFarm}
            journalEntries={journalEntries}
            onAddEntry={handleAddJournalEntry}
            onUpdateEntry={handleUpdateJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
            plots={plots}
            onAddCrop={handleAddCrop}
            onAddTransaction={handleAddTransaction}
            onUpdatePlot={handleUpdatePlot}
          />
        );
      case 'finance':
        return (
          <FinanceTracker 
            currentFarm={currentFarm}
            finances={finances}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        );
      case 'documents':
        return (
          <Documents 
            currentFarm={currentFarm}
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        );
      case 'livestock':
        return (
          <LivestockManager 
            currentFarm={currentFarm}
            livestock={livestock}
            onAddAnimal={handleAddLivestock}
            onUpdateAnimal={handleUpdateLivestock}
            onDeleteAnimal={handleDeleteLivestock}
          />
        );
      case 'labour':
        return (
          <LabourManager 
            currentFarm={currentFarm}
            labourTeam={labourTeam}
            onAddLabour={handleAddLabour}
            onUpdateLabour={handleUpdateLabour}
            onDeleteLabour={handleDeleteLabour}
          />
        );
      case 'inventory':
        return (
          <InventoryManager 
            currentFarm={currentFarm}
            inventory={inventory}
            onAddItem={handleAddInventory}
            onUpdateItem={handleUpdateInventory}
            onDeleteItem={handleDeleteInventory}
          />
        );
      case 'weather':
        return (
          <WeatherMandi currentFarmId={currentFarm.id} />
        );
      default:
        return <div className="text-center py-20 font-bold text-slate-500">View not initialized.</div>;
    }
  };

  const getSanskritQuote = () => {
    // Elegant agricultural Sanskrit blessing mantra
    return "कृषिर्मितं कृषिर्धनम् - Farming is a friend, farming is wealth.";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-24 md:pb-6">
      
      {/* GLOBAL HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* App title logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl shadow-xs">
              <Sprout className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-800 block leading-tight">खेती Khet Manager</span>
              <span className="text-[10px] text-emerald-700 font-bold tracking-wide uppercase leading-none block">Sultanpuria & Suratgarh</span>
            </div>
          </div>

          {/* Connected indicators */}
          <div className="flex items-center space-x-3">
            
            {/* Supabase connection indicator bubble */}
            <div 
              title={isCloudActive ? "Supabase Cloud Syncing Enabled" : "High-Performance Local Mode enabled"}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isCloudActive ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
            >
              <Database className="w-3 h-3 flex-shrink-0" />
              <span className="hidden sm:inline">{isCloudActive ? 'Connected (Supabase)' : 'Local Storage Mode'}</span>
              <span className="sm:hidden">{isCloudActive ? 'Syncing' : 'Offline'}</span>
            </div>

            {/* Global Farm Context Switcher selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFarmDropdown(!showFarmDropdown)}
                className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-3 py-2 rounded-xl transition shadow-xs cursor-pointer select-none"
              >
                <span>{currentFarm.name.split(' ')[0]}</span>
                <ChevronsUpDown className="w-3.5 h-3.5 text-emerald-200" />
              </button>
              
              {showFarmDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 text-slate-700 z-50">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 p-2 block">Choose Active Farm</span>
                  {INITIAL_FARMS.map((farm) => (
                    <button
                      key={farm.id}
                      onClick={() => {
                        setCurrentFarm(farm);
                        setShowFarmDropdown(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex flex-col justify-center space-y-0.5 hover:bg-emerald-50 hover:text-emerald-950 ${currentFarm.id === farm.id ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-600' : ''}`}
                    >
                      <span>{farm.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{farm.area} &bull; {farm.location.split(',')[1] || farm.location}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* DETAILED SANSKRIT BLESSING TAPE */}
      <div className="bg-emerald-50/50 border-b border-emerald-100/60 py-1 px-4 text-center">
        <span className="text-[10px] font-bold text-emerald-800 tracking-wide uppercase flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          <span>{getSanskritQuote()}</span>
        </span>
      </div>

      {/* CORE WEB SCREEN GRID CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
        
        {/* Desktop Side Navigation drawer (Hidden on phone, persistent on Tablet/PC) */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-start">
          
          <div className="hidden md:flex flex-col space-y-1.5 p-3.5 bg-white border border-slate-100 rounded-3xl shadow-xs">
            <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 pl-3.5 block mb-2">Modules Directory</span>
            
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavigate('map')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'map' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <Map className="w-4 h-4 text-emerald-600" />
              <span>Farm Map (Killa Layout)</span>
            </button>

            <button
              onClick={() => handleNavigate('crops')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'crops' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Crop Manager (Fasal)</span>
            </button>

            <button
              onClick={() => handleNavigate('diary')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'diary' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Journal / Diary</span>
            </button>

            <button
              onClick={() => handleNavigate('finance')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'finance' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>Finance Ledger</span>
            </button>

            <button
              onClick={() => handleNavigate('documents')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'documents' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Documents Vault</span>
            </button>

            <button
              onClick={() => handleNavigate('livestock')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'livestock' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Livestock (Pashu)</span>
            </button>

            <button
              onClick={() => handleNavigate('labour')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'labour' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <Briefcase className="w-4 h-4 text-amber-600" />
              <span>Labour Manager</span>
            </button>

            <button
              onClick={() => handleNavigate('inventory')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'inventory' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <Package className="w-4 h-4 text-amber-700" />
              <span>Godown (Inventory)</span>
            </button>

            <button
              onClick={() => handleNavigate('weather')}
              className={`flex items-center space-x-2.5 w-full text-left p-3 rounded-2xl text-xs font-bold transition-all hover:bg-emerald-50 hover:text-emerald-950 ${activeTab === 'weather' ? 'bg-emerald-50 text-emerald-900 shadow-xs' : 'text-slate-600'}`}
            >
              <CloudSun className="w-4 h-4 text-sky-500" />
              <span>Weather / Mandi Rates</span>
            </button>
          </div>

          <div className="md:col-span-3 lg:col-span-4 bg-transparent">
            {renderActiveScreen()}
          </div>

        </div>

      </main>

      {/* MORE MODULES SHEET FOR MOBILE OVERLAY */}
      {showMoreMenu && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center md:hidden">
          <div className="w-full bg-white rounded-t-[32px] p-6 space-y-4 max-h-[75vh] overflow-y-auto shadow-2xl relative">
            
            {/* Header overlay */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-sm">More Khet Manager Screens</h3>
              <button
                onClick={() => setShowMoreMenu(false)}
                className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full text-slate-600"
              >
                Close
              </button>
            </div>

            {/* List remaining screens */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleNavigate('documents')}
                className="flex items-center space-x-2.5 p-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 hover:bg-emerald-50 text-left"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Documents Registry</span>
              </button>

              <button
                onClick={() => handleNavigate('livestock')}
                className="flex items-center space-x-2.5 p-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 hover:bg-emerald-50 text-left"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Livestock (Pashu)</span>
              </button>

              <button
                onClick={() => handleNavigate('labour')}
                className="flex items-center space-x-2.5 p-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 hover:bg-emerald-50 text-left"
              >
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span>Labour Register</span>
              </button>

              <button
                onClick={() => handleNavigate('inventory')}
                className="flex items-center space-x-2.5 p-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 hover:bg-emerald-50 text-left"
              >
                <Package className="w-4 h-4 text-orange-700" />
                <span>Inventory Godown</span>
              </button>

              <button
                onClick={() => handleNavigate('weather')}
                className="flex items-center space-x-2.5 p-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 hover:bg-emerald-50 text-left"
              >
                <CloudSun className="w-4 h-4 text-sky-500" />
                <span>Mandi & Weather</span>
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-center text-slate-500 font-semibold border border-slate-100">
              Connected: Khet Manager V1.0 - Digital India initiative
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 py-2.5 bg-white border-t border-slate-100/95 backdrop-blur-md shadow-lg flex justify-around items-center md:hidden z-40 px-2">
        
        <button
          onClick={() => handleNavigate('dashboard')}
          className={`flex flex-col items-center justify-center space-y-0.5 text-slate-500 text-[10px] font-bold ${activeTab === 'dashboard' ? 'text-emerald-700' : ''}`}
        >
          <Compass className="w-5 h-5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => handleNavigate('map')}
          className={`flex flex-col items-center justify-center space-y-0.5 text-slate-500 text-[10px] font-bold ${activeTab === 'map' ? 'text-emerald-700' : ''}`}
        >
          <Map className="w-5 h-5" />
          <span>Farm Map</span>
        </button>

        <button
          onClick={() => handleNavigate('crops')}
          className={`flex flex-col items-center justify-center space-y-0.5 text-slate-500 text-[10px] font-bold ${activeTab === 'crops' ? 'text-emerald-700' : ''}`}
        >
          <Sprout className="w-5 h-5" />
          <span>Crops</span>
        </button>

        <button
          onClick={() => handleNavigate('diary')}
          className={`flex flex-col items-center justify-center space-y-0.5 text-slate-500 text-[10px] font-bold ${activeTab === 'diary' ? 'text-emerald-700' : ''}`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Journal</span>
        </button>

        <button
          onClick={() => handleNavigate('finance')}
          className={`flex flex-col items-center justify-center space-y-0.5 text-slate-500 text-[10px] font-bold ${activeTab === 'finance' ? 'text-emerald-700' : ''}`}
        >
          <IndianRupee className="w-5 h-5" />
          <span>Finances</span>
        </button>

        {/* More button */}
        <button
          onClick={() => setShowMoreMenu(true)}
          className="flex flex-col items-center justify-center space-y-0.5 text-slate-400 text-[10px] font-bold"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span>More</span>
        </button>

      </nav>

    </div>
  );
}
