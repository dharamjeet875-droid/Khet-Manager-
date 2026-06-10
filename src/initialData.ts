import { Farm, Plot, Crop, JournalEntry, FinanceLedgerEntry, FarmDocument, Livestock, Labour, InventoryItem, MandiRate, WeatherInfo } from './types';

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-sultanpuria',
    name: 'Sultanpuria Farm',
    area: '13.5 Acres',
    location: 'Teh Rania, Distt Sirsa, Haryana',
    crops: ['Rice (Kharif)', 'Wheat (Rabi)', 'Fodder'],
    managedBy: 'Self'
  },
  {
    id: 'farm-suratgarh',
    name: 'Suratgarh Farm',
    area: '90 Bighas',
    location: 'Suratgarh, Sri Ganganagar, Rajasthan',
    crops: ['Cotton (Kharif)', 'Wheat (Rabi)', 'Mustard'],
    managedBy: 'Father (Sh. Baldev Singh)'
  }
];

export const INITIAL_PLOTS: Plot[] = [
  // Sultanpuria Farm (Total 13.5 Acres, say 6 segments/Killas of ~2.25 Acres average)
  {
    id: 'plot-sultan-1',
    farmId: 'farm-sultanpuria',
    name: 'Killa 1-2 (North Block)',
    areaValue: 4.5,
    areaUnit: 'Acres',
    currentCrop: 'Rice (Pusa 1121)',
    sowingDate: '2026-06-15',
    expectedHarvest: '2026-11-10',
    status: 'Growing'
  },
  {
    id: 'plot-sultan-2',
    farmId: 'farm-sultanpuria',
    name: 'Killa 3-4 (Tube-well Side)',
    areaValue: 4.0,
    areaUnit: 'Acres',
    currentCrop: 'Wheat (HD-2967)',
    sowingDate: '2025-11-10',
    expectedHarvest: '2026-04-15',
    status: 'Harvested'
  },
  {
    id: 'plot-sultan-3',
    farmId: 'farm-sultanpuria',
    name: 'Killa 5 (Roadside)',
    areaValue: 2.5,
    areaUnit: 'Acres',
    currentCrop: 'Chari/Barseem (Fodder)',
    sowingDate: '2026-05-01',
    expectedHarvest: '2026-08-30',
    status: 'Growing'
  },
  {
    id: 'plot-sultan-4',
    farmId: 'farm-sultanpuria',
    name: 'Killa 6 (Old Orchard)',
    areaValue: 2.5,
    areaUnit: 'Acres',
    currentCrop: 'Fallow (Khaali)',
    sowingDate: '',
    expectedHarvest: '',
    status: 'Fallow'
  },

  // Suratgarh Farm (Total 90 Bighas, divided into 3 plots of 30 Bighas each)
  {
    id: 'plot-surat-1',
    farmId: 'farm-suratgarh',
    name: 'Johad Block (Plot A)',
    areaValue: 30,
    areaUnit: 'Bighas',
    currentCrop: 'Cotton (BT Cotton)',
    sowingDate: '2026-05-15',
    expectedHarvest: '2026-11-20',
    status: 'Growing'
  },
  {
    id: 'plot-surat-2',
    farmId: 'farm-suratgarh',
    name: 'Canal Face (Plot B)',
    areaValue: 30,
    areaUnit: 'Bighas',
    currentCrop: 'Wheat (Lok-1)',
    sowingDate: '2025-11-05',
    expectedHarvest: '2026-04-10',
    status: 'Harvested'
  },
  {
    id: 'plot-surat-3',
    farmId: 'farm-suratgarh',
    name: 'Dhani Block (Plot C)',
    areaValue: 30,
    areaUnit: 'Bighas',
    currentCrop: 'Mustard (Sarso)',
    sowingDate: '2025-10-20',
    expectedHarvest: '2026-03-15',
    status: 'Harvested'
  }
];

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'crop-sultan-rice',
    farmId: 'farm-sultanpuria',
    name: 'Rice (Dhaan)',
    variety: 'Basmati Pusa 1121',
    season: 'Kharif',
    sowingDate: '2026-06-15',
    expectedHarvest: '2026-11-10',
    areaValue: 4.5,
    areaUnit: 'Acres',
    inputCost: 32000,
    status: 'Growing'
  },
  {
    id: 'crop-sultan-wheat',
    farmId: 'farm-sultanpuria',
    name: 'Wheat (Kanak)',
    variety: 'HD-2967',
    season: 'Rabi',
    sowingDate: '2025-11-10',
    expectedHarvest: '2026-04-15',
    areaValue: 4.0,
    areaUnit: 'Acres',
    inputCost: 24000,
    status: 'Harvested'
  },
  {
    id: 'crop-sultan-fodder',
    farmId: 'farm-sultanpuria',
    name: 'Fodder (Chari)',
    variety: 'Local Tall',
    season: 'Kharif',
    sowingDate: '2026-05-01',
    expectedHarvest: '2026-08-30',
    areaValue: 2.5,
    areaUnit: 'Acres',
    inputCost: 4500,
    status: 'Growing'
  },
  {
    id: 'crop-surat-cotton',
    farmId: 'farm-suratgarh',
    name: 'Cotton (Narma)',
    variety: 'BT Cotton US-341',
    season: 'Kharif',
    sowingDate: '2026-05-15',
    expectedHarvest: '2026-11-20',
    areaValue: 30,
    areaUnit: 'Bighas',
    inputCost: 48000,
    status: 'Growing'
  },
  {
    id: 'crop-surat-wheat',
    farmId: 'farm-suratgarh',
    name: 'Wheat (Kanak)',
    variety: 'Lok-1 Super',
    season: 'Rabi',
    sowingDate: '2025-11-05',
    expectedHarvest: '2026-04-10',
    areaValue: 30,
    areaUnit: 'Bighas',
    inputCost: 36000,
    status: 'Harvested'
  }
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'journal-1',
    farmId: 'farm-sultanpuria',
    date: '2026-06-08',
    activityType: 'Irrigation',
    notes: 'Ran raw water tubewell for 6 hours in Killa 1-2. Paddy nursery showing smooth green shoots. Electricity was steady.',
  },
  {
    id: 'journal-2',
    farmId: 'farm-sultanpuria',
    date: '2026-06-05',
    activityType: 'Fertilizing',
    notes: 'Applied 1 bag of Zinc and Single Super Phosphate (SSP) in paddy nursery before transplanting.',
  },
  {
    id: 'journal-3',
    farmId: 'farm-suratgarh',
    date: '2026-06-07',
    activityType: 'Spraying',
    notes: 'Sprayed neem-based pesticide in Cotton Plot A (30 Bighas) to prevent early whitefly attacks.',
  },
  {
    id: 'journal-4',
    farmId: 'farm-suratgarh',
    date: '2026-06-02',
    activityType: 'Tillage',
    notes: 'Laser leveller hired for Cotton Plot B to ensure equal canal water distribution.',
  }
];

export const INITIAL_FINANCEDATA: FinanceLedgerEntry[] = [
  {
    id: 'fin-1',
    farmId: 'farm-sultanpuria',
    type: 'expense',
    category: 'Seeds',
    amount: 8500,
    date: '2026-06-02',
    notes: 'Basmati Pusa 1121 long grain seeds from Sirsa Mandi store',
    season: 'Kharif'
  },
  {
    id: 'fin-2',
    farmId: 'farm-sultanpuria',
    type: 'expense',
    category: 'Fertilizer',
    amount: 12400,
    date: '2026-06-04',
    notes: 'Purchased SSP and Zinc fertilizers (Iffco Coop)',
    season: 'Kharif'
  },
  {
    id: 'fin-3',
    farmId: 'farm-sultanpuria',
    type: 'income',
    category: 'Sale Income',
    amount: 142000,
    date: '2026-04-28',
    notes: 'Wheat sale of 62 quintals at MSP rate Sirsa Mandi',
    season: 'Rabi'
  },
  {
    id: 'fin-4',
    farmId: 'farm-suratgarh',
    type: 'expense',
    category: 'Labour',
    amount: 15000,
    date: '2026-05-18',
    notes: 'Labour payment for Cotton sowing (30 Bighas)',
    season: 'Kharif'
  },
  {
    id: 'fin-5',
    farmId: 'farm-suratgarh',
    type: 'income',
    category: 'Subsidy',
    amount: 12000,
    date: '2026-03-10',
    notes: 'State drip irrigation promotion subsidy credited',
    season: 'Rabi'
  },
  {
    id: 'fin-6',
    farmId: 'farm-sultanpuria',
    type: 'expense',
    category: 'Machinery',
    amount: 6500,
    date: '2026-05-25',
    notes: 'Tractor diesel & rotavator rent for tillage',
    season: 'Kharif'
  }
];

export const INITIAL_DOCUMENTS: FarmDocument[] = [
  {
    id: 'doc-1',
    farmId: 'farm-sultanpuria',
    title: 'Girdawari Certificate 2025-26',
    type: 'Girdawari',
    uploadDate: '2026-02-15',
    description: 'Official patwari crop inspection of 13.5 acres under wheat.'
  },
  {
    id: 'doc-2',
    farmId: 'farm-sultanpuria',
    title: 'KCC Passbook SBI Sirsa',
    type: 'KCC',
    uploadDate: '2025-05-10',
    description: 'SBI Kisan Credit Card loan record. Limit: Rs 3,00,000.'
  },
  {
    id: 'doc-3',
    farmId: 'farm-suratgarh',
    title: 'PMFBY Crop Insurance Slip 2026',
    type: 'PMFBY Insurance',
    uploadDate: '2026-05-20',
    description: 'Kharif Cotton Crop Insurance Premium Receipt, Rajasthan State.'
  }
];

export const INITIAL_LIVESTOCK: Livestock[] = [
  {
    id: 'live-1',
    farmId: 'farm-sultanpuria',
    type: 'Buffalo',
    breed: 'Murrah Black',
    count: 3,
    healthEvents: 'FMD vaccination completed on 2026-05-10. Next deworming scheduled for August.',
    feedCost: 8500,
    milkLogs: [
      { id: 'ml-1', date: '2026-06-08', yieldLiters: 18.2 },
      { id: 'ml-2', date: '2026-06-09', yieldLiters: 19.5 }
    ]
  },
  {
    id: 'live-2',
    farmId: 'farm-suratgarh',
    type: 'Cow',
    breed: 'Sahiwal Red',
    count: 2,
    healthEvents: 'Regular vet checkup done. Milk quality fat is ~4.5%.',
    feedCost: 5200,
    milkLogs: [
      { id: 'ml-3', date: '2026-06-08', yieldLiters: 12.0 },
      { id: 'ml-4', date: '2026-06-09', yieldLiters: 11.8 }
    ]
  }
];

export const INITIAL_LABOUR: Labour[] = [
  {
    id: 'lab-1',
    farmId: 'farm-sultanpuria',
    name: 'Sukhwinder Singh',
    phone: '98765-43210',
    dailyWage: 450,
    advancePaid: 2000,
    attendance: [
      { date: '2026-06-05', status: 'Present', wageEarned: 450 },
      { date: '2026-06-06', status: 'Present', wageEarned: 450 },
      { date: '2026-06-07', status: 'Present', wageEarned: 450 },
      { date: '2026-06-08', status: 'Present', wageEarned: 450 },
      { date: '2026-06-09', status: 'Present', wageEarned: 450 }
    ]
  },
  {
    id: 'lab-2',
    farmId: 'farm-sultanpuria',
    name: 'Joginder Ram',
    phone: '94162-83561',
    dailyWage: 400,
    advancePaid: 500,
    attendance: [
      { date: '2026-06-05', status: 'Present', wageEarned: 400 },
      { date: '2026-06-06', status: 'Present', wageEarned: 400 },
      { date: '2026-06-07', status: 'Absent', wageEarned: 0 },
      { date: '2026-06-08', status: 'Present', wageEarned: 400 },
      { date: '2026-06-09', status: 'Half Day', wageEarned: 200 }
    ]
  },
  {
    id: 'lab-3',
    farmId: 'farm-suratgarh',
    name: 'Madan Lal',
    phone: '89555-12341',
    dailyWage: 400,
    advancePaid: 1000,
    attendance: [
      { date: '2026-06-07', status: 'Present', wageEarned: 400 },
      { date: '2026-06-08', status: 'Present', wageEarned: 400 },
      { date: '2026-06-09', status: 'Present', wageEarned: 400 }
    ]
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    farmId: 'farm-sultanpuria',
    itemName: 'Urea (IFFCO)',
    category: 'Fertilizer',
    quantity: 12,
    unit: 'Bags',
    purchaseDate: '2026-05-10',
    cost: 3200,
    lowStockThreshold: 4
  },
  {
    id: 'inv-2',
    farmId: 'farm-sultanpuria',
    itemName: 'Roundup Herbicide',
    category: 'Pesticides',
    quantity: 5,
    unit: 'Liters',
    purchaseDate: '2026-05-20',
    cost: 2200,
    lowStockThreshold: 2
  },
  {
    id: 'inv-3',
    farmId: 'farm-sultanpuria',
    itemName: 'Diesel (HSD)',
    category: 'Diesel',
    quantity: 15,
    unit: 'Liters',
    purchaseDate: '2026-06-08',
    cost: 1400,
    lowStockThreshold: 20
  },
  {
    id: 'inv-4',
    farmId: 'farm-suratgarh',
    itemName: 'Cotton Seeds BT-Rice Coop',
    category: 'Seeds',
    quantity: 2,
    unit: 'Packets',
    purchaseDate: '2026-05-12',
    cost: 1720,
    lowStockThreshold: 1
  }
];

// Sirsa and Suratgarh Mandi statistics
export const MANDI_PRICES: MandiRate[] = [
  { crop: 'Wheat (Kanak)', state: 'Haryana', mandi: 'Sirsa', minPrice: 2275, maxPrice: 2450, modalPrice: 2350, date: '2026-06-09' },
  { crop: 'Paddy Basmati 1121', state: 'Haryana', mandi: 'Sirsa', minPrice: 3800, maxPrice: 4600, modalPrice: 4200, date: '2026-06-09' },
  { crop: 'Raw Cotton (Narma)', state: 'Rajasthan', mandi: 'Suratgarh', minPrice: 6500, maxPrice: 7200, modalPrice: 6850, date: '2026-06-09' },
  { crop: 'Guar Seed', state: 'Rajasthan', mandi: 'Suratgarh', minPrice: 4800, maxPrice: 5300, modalPrice: 5120, date: '2026-06-09' },
  { crop: 'Mustard (Sarso)', state: 'Rajasthan', mandi: 'Suratgarh', minPrice: 5100, maxPrice: 5650, modalPrice: 5400, date: '2026-06-09' }
];

export const WEATHER_DATA: Record<string, WeatherInfo> = {
  'farm-sultanpuria': {
    temp: 41,
    condition: 'Sunny & Dry',
    humidity: 28,
    windSpeed: 16,
    forecast: [
      { day: 'Wed', temp: 42, condition: 'Clear Sky' },
      { day: 'Thu', temp: 43, condition: 'Extremely Hot' },
      { day: 'Fri', temp: 41, condition: 'Dusty Winds' },
      { day: 'Sat', temp: 39, condition: 'Partly Cloudy' }
    ]
  },
  'farm-suratgarh': {
    temp: 43,
    condition: 'Hot & Searing',
    humidity: 22,
    windSpeed: 18,
    forecast: [
      { day: 'Wed', temp: 44, condition: 'Heatwave' },
      { day: 'Thu', temp: 45, condition: 'Extremely Hot' },
      { day: 'Fri', temp: 42, condition: 'Strong Winds' },
      { day: 'Sat', temp: 40, condition: 'Clear Sky' }
    ]
  }
};
