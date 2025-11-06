import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'TRY';
export type Language = 'en' | 'tr' | 'es' | 'fr' | 'de';
export type GasPreference = 'low' | 'medium' | 'high' | 'custom';

interface Settings {
  // Display
  currency: Currency;
  language: Language;
  showBalance: boolean;
  compactMode: boolean;

  // Privacy
  analyticsEnabled: boolean;
  crashReportsEnabled: boolean;

  // Transaction
  gasPreference: GasPreference;
  customGasPrice?: string;
  autoApprove: boolean;
  slippageTolerance: number;

  // Security
  requireConfirmation: boolean;
  phishingWarnings: boolean;
  secureMode: boolean;

  // Notifications
  notificationsEnabled: boolean;
  transactionNotifications: boolean;
  priceAlerts: boolean;
}

interface SettingsState extends Settings {
  // Actions
  updateSettings: (settings: Partial<Settings>) => void;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
  setGasPreference: (preference: GasPreference) => void;
  setSlippageTolerance: (tolerance: number) => void;
  toggleShowBalance: () => void;
  toggleAnalytics: () => void;
  toggleNotifications: () => void;
  reset: () => void;
}

const defaultSettings: Settings = {
  // Display
  currency: 'USD',
  language: 'en',
  showBalance: true,
  compactMode: false,

  // Privacy
  analyticsEnabled: true,
  crashReportsEnabled: true,

  // Transaction
  gasPreference: 'medium',
  autoApprove: false,
  slippageTolerance: 0.5,

  // Security
  requireConfirmation: true,
  phishingWarnings: true,
  secureMode: true,

  // Notifications
  notificationsEnabled: true,
  transactionNotifications: true,
  priceAlerts: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (settings) =>
        set((state) => ({ ...state, ...settings })),

      setCurrency: (currency) => set({ currency }),

      setLanguage: (language) => set({ language }),

      setGasPreference: (preference) => set({ gasPreference: preference }),

      setSlippageTolerance: (tolerance) => set({ slippageTolerance: tolerance }),

      toggleShowBalance: () =>
        set((state) => ({ showBalance: !state.showBalance })),

      toggleAnalytics: () =>
        set((state) => ({ analyticsEnabled: !state.analyticsEnabled })),

      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

      reset: () => set(defaultSettings),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
