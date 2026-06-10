import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Khet Manager Supabase Configuration
 * 
 * Replace these placeholder credentials with your actual Supabase Project details to enable Cloud storage.
 * Go to: Project Settings -> API in your Supabase Dashboard.
 * 
 * When empty or placeholder, Khet Manager automatically operates in
 * High-Performance Offline Mode (persisting to browser localStorage).
 */
export const SUPABASE_CONFIG = {
  url: ((import.meta as any).env?.VITE_SUPABASE_URL || 'https://mxerbdvkozfvsnnretks.supabase.co').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''),
  anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_CxlslZSTHSP5FlsgqZBnDw_dYyGOWfd'
};

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const isConfigured = 
    SUPABASE_CONFIG.url && 
    SUPABASE_CONFIG.anonKey && 
    !SUPABASE_CONFIG.url.includes('your-supabase-project-id') &&
    !SUPABASE_CONFIG.anonKey.includes('your-supabase-anon-key');

  if (isConfigured) {
    try {
      cachedClient = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      console.log('Khet Manager: Supabase client initialized and connected successfully!');
      return cachedClient;
    } catch (error) {
      console.error('Khet Manager: Failed to initialize Supabase client:', error);
      return null;
    }
  }

  return null;
}

/**
 * Check if cloud syncing is active.
 */
export function isCloudSyncEnabled(): boolean {
  return getSupabaseClient() !== null;
}

/**
 * State helper: Load state from LocalStorage, with option to seed if empty.
 */
export function loadLocalState<T>(key: string, seedData: T): T {
  try {
    const item = localStorage.getItem(`khet_manager_${key}`);
    if (item) {
      return JSON.parse(item) as T;
    }
  } catch (error) {
    console.error(`Khet Manager: Error reading key "${key}" from localStorage:`, error);
  }
  // Store seed data initially
  saveLocalState(key, seedData);
  return seedData;
}

/**
 * State helper: Save state to LocalStorage and optionally enqueue cloud sync.
 */
export function saveLocalState<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`khet_manager_${key}`, JSON.stringify(data));
    
    // If Supabase is connected, attempt to sync the change asynchronously
    const supabase = getSupabaseClient();
    if (supabase) {
      syncWithSupabase(key, data, supabase);
    }
  } catch (error) {
    console.error(`Khet Manager: Error writing key "${key}" to localStorage:`, error);
  }
}

/**
 * Background synchronizer of lists to Supabase tables.
 * To make this work, Supabase tables should match the schemas defined in types.ts.
 */
async function syncWithSupabase<T>(key: string, data: T, supabase: SupabaseClient) {
  console.log(`Khet Manager: Cloud syncing module "${key}" to Supabase...`);
  
  try {
    // For lists, we update values in the corresponding table
    // Table names map directly: e.g. 'crops', 'journal', 'finance', 'livestock', 'labour', 'inventory', 'plots'
    const tableName = key; // e.g. 'crops', 'finance', etc.
    
    // In production, we'd upsert each item or write to the specific table.
    // For demo/simplicity and reliable syncing, we upsert the rows.
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.id) {
          const { error } = await supabase
            .from(tableName)
            .upsert(item, { onConflict: 'id' });
            
          if (error) {
            console.warn(`Supabase sync warning for table ${tableName} on row ${item.id}:`, error.message);
          }
        }
      }
    } else {
      // Single object sync (e.g. general settings)
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value: data }, { onConflict: 'key' });
        
      if (error) {
        console.warn(`Supabase sync warning for settings:`, error.message);
      }
    }
  } catch (err) {
    console.error('Khet Manager: Supabase sync exception:', err);
  }
}
