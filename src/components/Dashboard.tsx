import React from 'react';
import { 
  Sprout, 
  IndianRupee, 
  BookOpen, 
  Users, 
  CloudSun, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Farm, Crop, FinanceLedgerEntry, InventoryItem, WeatherInfo, MandiRate } from '../types';
import { WEATHER_DATA, MANDI_PRICES } from '../initialData';

interface DashboardProps {
  currentFarm: Farm;
  crops: Crop[];
  finances: FinanceLedgerEntry[];
  inventory: InventoryItem[];
  labourCount: number;
  onNavigate: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentFarm,
  crops,
  finances,
  inventory,
  labourCount,
  onNavigate
}) => {
  // Filter data for active farm
  const farmCrops = crops.filter(c => c.farmId === currentFarm.id);
  const activeCrops = farmCrops.filter(c => c.status === 'Growing' || c.status === 'Sown');
  const farmFinances = finances.filter(f => f.farmId === currentFarm.id);
  
  // Calculate financial balances
  const totalIncome = farmFinances
    .filter(f => f.type === 'income')
    .reduce((sum, f) => sum + f.amount, 0);
  const totalExpense = farmFinances
    .filter(f => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);
    
  // Check low stock inventory
  const lowStockItems = inventory
    .filter(i => i.farmId === currentFarm.id && i.quantity <= i.lowStockThreshold);

  // Weather snapshot
  const weather: WeatherInfo = WEATHER_DATA[currentFarm.id] || {
    temp: 35,
    condition: 'Sunny',
    humidity: 30,
    windSpeed: 10,
    forecast: []
  };

  // Filter Mandi Rates based on selected farm's state
  const isHaryana = currentFarm.id === 'farm-sultanpuria';
  const stateFilter = isHaryana ? 'Haryana' : 'Rajasthan';
  const relevantMandiPrices = MANDI_PRICES.filter(rate => rate.state === stateFilter);

  return (
    <div className="space-y-6">
      {/* Welcome & Farm Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-15 transform translate-x-12 -translate-y-6">
          <Sprout className="w-64 h-64" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2 bg-emerald-900/40 w-fit px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>{currentFarm.location}</span>
          </div>
          <h1 id="headline-farm-name" className="text-3xl font-extrabold tracking-tight">{currentFarm.name}</h1>
          <p className="text-emerald-100 opacity-90 max-w-xl">
            Area: <span className="font-semibold text-white">{currentFarm.area}</span> &bull; 
            {currentFarm.managedBy && ` Supervisor: ${currentFarm.managedBy}`}
          </p>
          <div className="pt-2 flex items-center space-x-3 text-xs text-emerald-200">
            <span className="bg-emerald-700/60 px-2.5 py-1 rounded">Kharif: June-Nov</span>
            <span className="bg-emerald-700/60 px-2.5 py-1 rounded">Rabi: Nov-Apr</span>
          </div>
        </div>
      </div>

      {/* Grid of Key Numerical/Status KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Active Crops Card */}
        <button 
          onClick={() => onNavigate('crops')}
          className="flex flex-col justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-emerald-500 transition-all text-left group"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Active Crops</span>
            <span className="text-2xl font-bold text-slate-800 focus:outline-none">{activeCrops.length} Crops</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-1">
              {activeCrops.map(c => c.name.split(' ')[0]).join(', ') || 'None active'}
            </span>
          </div>
        </button>

        {/* Expenses/Finance KPI */}
        <button 
          onClick={() => onNavigate('finance')}
          className="flex flex-col justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-rose-500 transition-all text-left group"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-100 transition-colors">
              <TrendingDown className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Season Costs</span>
            <span className="text-2xl font-bold text-slate-800">₹{totalExpense.toLocaleString()}</span>
            <span className="text-[10px] text-rose-600 font-medium block mt-1">
              Seeds, urea & wages
            </span>
          </div>
        </button>

        {/* Income KPI */}
        <button 
          onClick={() => onNavigate('finance')}
          className="flex flex-col justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-teal-600 transition-all text-left group"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-teal-50 rounded-xl text-teal-600 group-hover:bg-teal-100 transition-colors">
              <TrendingUp className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Sales/Subsidies</span>
            <span className="text-2xl font-bold text-slate-800">₹{totalIncome.toLocaleString()}</span>
            <span className="text-[10px] text-teal-600 font-semibold block mt-1">
              Profit Margin: +₹{(totalIncome - totalExpense).toLocaleString()}
            </span>
          </div>
        </button>

        {/* Labour Count KPI */}
        <button 
          onClick={() => onNavigate('labour')}
          className="flex flex-col justify-between bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-amber-500 transition-all text-left group"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
          </div>
          <div className="mt-4">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">Labour Strength</span>
            <span className="text-2xl font-bold text-slate-800">{labourCount} Workers</span>
            <span className="text-[10px] text-amber-600 font-medium block mt-1">
              Attendance tracked daily
            </span>
          </div>
        </button>
      </div>

      {/* Main split: Weather and Ticker side-by-side, visual reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel 1: Weather report customized for location */}
        <div className="p-6 bg-white border border-slate-100 shadow-xs rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center space-x-2">
              <CloudSun className="w-5 h-5 text-amber-500" />
              <span>Sirsa/Suratgarh Weather</span>
            </h2>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Real-time</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
            <div>
              <span className="text-4xl font-extrabold text-slate-800">{weather.temp}°C</span>
              <span className="text-sm block font-semibold text-amber-600 mt-1">{weather.condition}</span>
            </div>
            <div className="text-right text-xs text-slate-500 space-y-0.5">
              <p>Humidity: <b className="text-slate-700">{weather.humidity}%</b></p>
              <p>Wind speed: <b className="text-slate-700">{weather.windSpeed} km/h</b></p>
              <p className="text-[10px] text-slate-400 mt-1">Ideal for transplanting</p>
            </div>
          </div>
          {/* Weather 4-day forecast */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            {weather.forecast.map((fc, i) => (
              <div key={i} className="p-2 bg-slate-50/50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 font-semibold block">{fc.day}</span>
                <span className="text-sm font-bold text-slate-700 block">{fc.temp}°</span>
                <span className="text-[9px] text-amber-700 font-medium block leading-none">{fc.condition.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2: Mandi Price Ticker (Sirsa / Suratgarh APMC) */}
        <div className="p-6 bg-white border border-slate-100 shadow-xs rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>APMC Mandi Rates (₹/Qtl)</span>
            </h2>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">MSP Active</span>
          </div>
          <div className="space-y-3">
            {relevantMandiPrices.map((rate, i) => (
              <div key={i} className="flex justify-between items-center text-sm p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-all">
                <div>
                  <span className="font-bold text-slate-800 block">{rate.crop}</span>
                  <span className="text-[10px] text-slate-500 font-semibold block">Mandi: {rate.mandi} ({rate.state})</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 block">₹{rate.modalPrice}</span>
                  <span className="text-[10px] text-slate-400 font-semibold block">Range: ₹{rate.minPrice} - ₹{rate.maxPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Quick Alerts/Reminders checklist & Local actions */}
        <div className="p-6 bg-white border border-slate-100 shadow-xs rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-slate-800 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Alerts & Low Stocks</span>
            </h2>
          </div>
          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-amber-50/70 border border-amber-100 rounded-xl">
                  <Package className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">{item.itemName} Alert</span>
                    <span className="text-[10px] text-amber-700 block leading-tight">
                      Only {item.quantity} {item.unit} remaining! (Threshold: {item.lowStockThreshold} {item.unit})
                    </span>
                  </div>
                  <button 
                    onClick={() => onNavigate('inventory')}
                    className="text-xs font-bold text-amber-800 underline flex-shrink-0 hover:text-amber-950"
                  >
                    Buy
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 bg-emerald-50/50 text-emerald-800 border border-emerald-100 rounded-xl text-center text-xs space-y-1">
                <p className="font-bold">✓ All Stocks Healthy</p>
                <p className="text-[10px] text-emerald-600 font-medium">None of your seed bags or fertilizers are low.</p>
              </div>
            )}

            {/* Quick reminders of agriculture calendar */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Season Reminders</span>
              <ul className="text-xs space-y-1.5 text-slate-600 font-medium">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span>Transplant paddy nursery before crop timeline limit (late June)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span>File Girdawari details with Patwari before deadline</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Mini Quick-Navigation Bento row */}
      <div className="bg-slate-50 rounded-2xl p-4 flex flex-wrap gap-2 items-center justify-between border border-slate-100">
        <span className="text-xs font-bold text-slate-500">Quick-Jump Modules:</span>
        <div className="flex flex-wrap gap-2">
          {['map', 'diary', 'documents', 'livestock', 'inventory', 'weather'].map((tab) => (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 transition-all capitalize"
            >
              {tab === 'map' ? 'Farm Map' : tab === 'diary' ? 'Journal' : tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
