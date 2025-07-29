import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Settings, SettingsForm } from '../types';

interface SettingsContextType {
  settings: Settings;
  updateSettings: (settingsData: Partial<SettingsForm>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

// Configurações padrão
const defaultSettings: Settings = {
  id: '1',
  userId: '1',
  theme: 'light',
  language: 'pt-BR',
  notifications: {
    tasks: true,
    goals: true,
    events: true,
    finances: true,
    courses: true,
    email: true,
    push: false,
  },
  privacy: {
    shareProgress: false,
    shareStats: false,
    publicProfile: false,
  },
  display: {
    compactMode: false,
    showCompletedTasks: true,
    showCompletedGoals: true,
    dashboardLayout: 'default',
  },
  business: {
    businessName: '',
    businessType: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    taxId: '',
  },
  preferences: {
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    weekStart: 'monday',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações do localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = localStorage.getItem('mamaboss_settings');
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({
            ...defaultSettings,
            ...parsedSettings,
            createdAt: new Date(parsedSettings.createdAt || Date.now()),
            updatedAt: new Date(parsedSettings.updatedAt || Date.now()),
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        setSettings(defaultSettings);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Salvar configurações no localStorage
  const saveSettings = (newSettings: Settings) => {
    try {
      localStorage.setItem('mamaboss_settings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  // Atualizar configurações
  const updateSettings = (settingsData: Partial<SettingsForm>) => {
    const updatedSettings: Settings = {
      ...settings,
      ...settingsData,
      // Garantir que as propriedades aninhadas sejam mescladas corretamente
      notifications: {
        ...settings.notifications,
        ...settingsData.notifications,
      },
      privacy: {
        ...settings.privacy,
        ...settingsData.privacy,
      },
      display: {
        ...settings.display,
        ...settingsData.display,
      },
      business: {
        ...settings.business,
        ...settingsData.business,
      },
      preferences: {
        ...settings.preferences,
        ...settingsData.preferences,
      },
      updatedAt: new Date(),
    };
    
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  // Resetar configurações para padrão
  const resetSettings = () => {
    const resetSettingsData: Settings = {
      ...defaultSettings,
      updatedAt: new Date(),
    };
    
    setSettings(resetSettingsData);
    saveSettings(resetSettingsData);
  };

  const value: SettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
}; 