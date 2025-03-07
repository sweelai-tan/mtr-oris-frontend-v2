'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import moment from 'moment-timezone';

import { DateRange, EventSource, LoginData } from '@/lib/types';

export type Language = 'EN' | 'ZH';
export interface Config {
  api: {
    baseURL: string;
    timeout: number;
  };
  source: EventSource | null;
  language: Language;
  user: LoginData | null;
  dateRange: DateRange | undefined;
  updateConfig: (newConfig: Partial<Config>) => void;
}

const ConfigContext = createContext<Config | null>(null);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<Config>({
    api: {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://20.205.128.43',
      timeout: 5000,
    },
    source: null,
    language: 'EN',
    user: null,
    updateConfig: (newConfig: Partial<Config>) => {
      setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
    },
    dateRange: {
      from: moment
        .tz('Asia/Hong_Kong')
        .subtract(1, 'day')
        .set({ hour: 5, minute: 0 })
        .toDate(),
      to: moment.tz('Asia/Hong_Kong').set({ hour: 4, minute: 59 }).toDate(),
    },
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    const savedSource = localStorage.getItem('source');
    const savedUser = localStorage.getItem('user');

    if (savedLanguage) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        language: savedLanguage as Language,
      }));
    }

    if (savedSource) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        source: savedSource as EventSource,
      }));
    }

    if (savedUser) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        user: JSON.parse(savedUser) as LoginData,
      }));
    }
  }, []);

  const updateConfig = (newConfig: Partial<Config>) => {
    setConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig, ...newConfig };
      if (newConfig.language) {
        localStorage.setItem('language', newConfig.language);
      }

      if (newConfig.source) {
        localStorage.setItem('source', newConfig.source);
      }

      if (newConfig.user) {
        localStorage.setItem('user', JSON.stringify(newConfig.user));
      }

      if (newConfig.dateRange) {
        // localStorage.setItem('dateRange', JSON.stringify(newConfig.dateRange));
      }
      return updatedConfig;
    });
  };

  return (
    <ConfigContext.Provider value={{ ...config, updateConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
