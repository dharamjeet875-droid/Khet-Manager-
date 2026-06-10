/**
 * Types for Khet Manager Farm Management Application
 */

export interface Farm {
  id: string;
  name: string;
  area: string;
  location: string;
  crops: string[];
  managedBy?: string;
}

export type PlotStatus = 'Sowed' | 'Growing' | 'Harvested' | 'Fallow';

export interface Plot {
  id: string;
  farmId: string;
  name: string; // e.g., "Killa 1", "Murabba 2, Kanal 1"
  areaValue: number;
  areaUnit: 'Acres' | 'Bighas' | 'Kanals' | 'Killas';
  currentCrop: string;
  sowingDate: string;
  expectedHarvest: string;
  status: PlotStatus;
}

export type CropSeason = 'Kharif' | 'Rabi' | 'Zaid';
export type CropStatus = 'Planned' | 'Sown' | 'Growing' | 'Harvested' | 'Nursery';

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  season: CropSeason;
  sowingDate: string;
  expectedHarvest: string;
  areaValue: number;
  areaUnit: 'Acres' | 'Bighas' | 'Kanals' | 'Killas';
  inputCost: number;
  fertilizerCost?: number;
  pesticideCost?: number;
  laborCost?: number;
  harvestIncome?: number;
  status: CropStatus;
}

export type JournalActivityType = 'Irrigation' | 'Spraying' | 'Fertilizing' | 'Harvesting' | 'Tillage' | 'Sowing' | 'Other';

export interface JournalEntry {
  id: string;
  farmId: string;
  date: string;
  activityType: JournalActivityType;
  notes: string;
  photoUrl?: string; // base64 or placeholder
}

export type ExpressCategory = 'Seeds' | 'Fertilizer' | 'Pesticide' | 'Labour' | 'Irrigation' | 'Machinery' | 'Sale Income' | 'Subsidy' | 'Other';

export interface FinanceLedgerEntry {
  id: string;
  farmId: string;
  type: 'income' | 'expense';
  category: ExpressCategory;
  amount: number;
  date: string;
  notes: string;
  season: CropSeason;
}

export type DocType = 'Girdawari' | 'KCC' | 'PMFBY Insurance' | 'MFMB' | 'Land Records' | 'Other';

export interface FarmDocument {
  id: string;
  farmId: string;
  title: string;
  type: DocType;
  uploadDate: string;
  fileUrl?: string; // simulated data uri
  description: string;
}

export interface MilkLogEntry {
  id: string;
  date: string;
  yieldLiters: number;
  fatPercent?: number;
}

export interface Livestock {
  id: string;
  farmId: string;
  type: 'Buffalo' | 'Cow' | 'Goat' | 'Sheep' | 'Poultry' | 'Other';
  breed?: string;
  count: number;
  healthEvents: string; // text history of vaccinations / issues
  feedCost: number; // ongoing calculations
  milkLogs: MilkLogEntry[];
}

export interface AttendanceRecord {
  date: string;
  status: 'Present' | 'Absent' | 'Half Day';
  wageEarned: number;
}

export interface Labour {
  id: string;
  farmId: string;
  name: string;
  phone: string;
  dailyWage: number;
  advancePaid: number;
  attendance: AttendanceRecord[];
}

export interface InventoryItem {
  id: string;
  farmId: string;
  itemName: string;
  category: 'Seeds' | 'Fertilizer' | 'Pesticides' | 'Diesel' | 'Tools' | 'Other';
  quantity: number;
  unit: 'Bags' | 'Liters' | 'Kg' | 'Packets' | 'Units';
  purchaseDate: string;
  cost: number;
  lowStockThreshold: number;
}

export interface MandiRate {
  crop: string;
  state: string;
  mandi: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: { day: string; temp: number; condition: string }[];
}
