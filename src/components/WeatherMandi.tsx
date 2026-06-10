import React, { useState } from 'react';
import { WEATHER_DATA, MANDI_PRICES } from '../initialData';
import { CloudSun, TrendingUp, Search, MapPin, Wind, Thermometer, Droplets, RefreshCw } from 'lucide-react';

interface WeatherMandiProps {
  currentFarmId: string;
}

export const WeatherMandi: React.FC<WeatherMandiProps> = ({ currentFarmId }) => {
  // Weather state & mock refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localMandiPriceList, setLocalMandiPriceList] = useState(MANDI_PRICES);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<'All' | 'Haryana' | 'Rajasthan'>('All');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate slight mandi price fluctuations
      const randomized = localMandiPriceList.map(item => {
        const delta = Math.floor((Math.random() - 0.5) * 40); // fluctuate up to 20 rupees
        return {
          ...item,
          modalPrice: item.modalPrice + delta,
          minPrice: item.minPrice + Math.min(0, delta),
          maxPrice: item.maxPrice + Math.max(0, delta),
          date: '2026-06-09'
        };
      });
      setLocalMandiPriceList(randomized);
      setIsRefreshing(false);
    }, 800);
  };

  // Filtered price list
  const filteredPrices = localMandiPriceList.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.mandi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === 'All' || item.state === stateFilter;
    
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 id="title-weather-mandi" className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <CloudSun className="w-6 h-6 text-emerald-600" />
            <span>Weather & Mandi Price Desk</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time weather parameters and APMC Mandi price tickers for Sri Ganganagar, Sirsa and Suratgarh regions.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition border border-slate-200 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Live Rates</span>
        </button>
      </div>

      {/* Weather grids side-by-side (Sirsa + Suratgarh) */}
      <h3 className="font-extrabold text-slate-800 text-sm flex items-center space-x-1.5">
        <MapPin className="w-4 h-4 text-rose-500" />
        <span>Regional Atmosphere Metrics</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Sirsa, Haryana */}
        <div className="bg-gradient-to-tr from-sky-400/90 to-blue-500/95 text-white rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-100 block">District Sirsa</span>
              <h4 className="text-xl font-extrabold">Sirsa, Haryana</h4>
            </div>
            <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">HQ Sultanpuria</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-4xl font-black">{WEATHER_DATA['farm-sultanpuria']?.temp}°C</span>
            <div className="text-right">
              <span className="text-sm font-extrabold text-sky-100 block">{WEATHER_DATA['farm-sultanpuria']?.condition}</span>
              <span className="text-[11px] opacity-80 block font-semibold">Dry summer climate</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-white/20 pt-3">
            <div className="p-1 px-2.5 bg-white/10 rounded-xl">
              <span className="text-[10px] text-sky-100 block opacity-80 font-bold">Humidity</span>
              <span className="font-extrabold">{WEATHER_DATA['farm-sultanpuria']?.humidity}%</span>
            </div>
            <div className="p-1 px-2.5 bg-white/10 rounded-xl">
              <span className="text-[10px] text-sky-100 block opacity-80 font-bold">Wind Speed</span>
              <span className="font-extrabold">{WEATHER_DATA['farm-sultanpuria']?.windSpeed} km/h</span>
            </div>
            <div className="p-1 px-2.5 bg-white/10 rounded-xl">
              <span className="text-[10px] text-sky-100 block opacity-80 font-bold">Evaporat</span>
              <span className="font-extrabold">High</span>
            </div>
          </div>
        </div>

        {/* Suratgarh, Rajasthan */}
        <div className="bg-gradient-to-tr from-amber-400 to-orange-500 text-white rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-100 block">Thar Border Ganganagar</span>
              <h4 className="text-xl font-extrabold">Suratgarh, Rajasthan</h4>
            </div>
            <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">HQ Suratgarh</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-4xl font-black">{WEATHER_DATA['farm-suratgarh']?.temp}°C</span>
            <div className="text-right">
              <span className="text-sm font-extrabold text-amber-100 block">{WEATHER_DATA['farm-suratgarh']?.condition}</span>
              <span className="text-[11px] opacity-80 block font-semibold">Severe dry heatwave</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-white/20 pt-3">
            <div className="p-1 px-2.5 bg-white/10 rounded-xl">
              <span className="text-[10px] text-amber-100 block opacity-80 font-bold">Humidity</span>
              <span className="font-extrabold">{WEATHER_DATA['farm-suratgarh']?.humidity}%</span>
            </div>
            <div className="p-1 px-2.5 bg-white/10 rounded-xl">
              <span className="text-[10px] text-amber-100 block opacity-80 font-bold">Wind Speed</span>
              <span className="font-extrabold">{WEATHER_DATA['farm-suratgarh']?.windSpeed} km/h</span>
            </div>
            <div className="p-1 px-2.5 bg-white/10 rounded-xl">
              <span className="text-[10px] text-amber-100 block opacity-80 font-bold font-mono">Looh Wind</span>
              <span className="font-extrabold text-red-900">Extremely Active</span>
            </div>
          </div>
        </div>

      </div>

      {/* Mandi Tickers controls & list */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center space-x-1.5 animate-pulse">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>APMC Mandi MSP Rate indexes</span>
          </h3>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search */}
            <input
              type="text"
              placeholder="Search crop or mandi..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50"
            />
            {/* State filter */}
            <select
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value as any)}
              className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white"
            >
              <option value="All">All Mandi States</option>
              <option value="Haryana">Haryana State</option>
              <option value="Rajasthan">Rajasthan State</option>
            </select>
          </div>
        </div>

        {/* Live Prices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrices.map((item, i) => (
            <div key={i} className="border border-slate-100 p-4 rounded-2xl hover:border-emerald-200 transition-all bg-slate-50/50 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-slate-800">{item.crop}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Mandi: <b className="text-slate-600">{item.mandi} ({item.state})</b></p>
                </div>
                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                  Verified {item.date}
                </span>
              </div>

              <div className="flex justify-between items-baseline bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500">Benchmark Rate:</span>
                <span className="text-lg font-black text-emerald-700">₹{item.modalPrice}/Qtl</span>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1.5">
                <span>Min: ₹{item.minPrice}</span>
                <span>Max: ₹{item.maxPrice}</span>
              </div>
            </div>
          ))}

          {filteredPrices.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-12 col-span-full">No Mandi price data matches search.</p>
          )}
        </div>
      </div>
    </div>
  );
};
