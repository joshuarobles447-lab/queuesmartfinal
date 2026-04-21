import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '@/constants/translations';

type Role = 'staff' | 'customer' | null;

interface QueueItem {
  ticket: string;
  status: 'serving' | 'next' | 'standby' | 'call';
}

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  ticketNumber: string;
  setTicketNumber: (t: string) => void;
  queuePosition: number;
  setQueuePosition: (n: number) => void;
  queueList: QueueItem[];
  setQueueList: (items: QueueItem[]) => void;
  inQueueCount: number;
  setInQueueCount: (n: number) => void;
  nowServing: string;
  setNowServing: (t: string) => void;
  acceptingCustomers: boolean;
  setAcceptingCustomers: (v: boolean) => void;
  queuePaused: boolean;
  setQueuePaused: (v: boolean) => void;
  noShowAlertsEnabled: boolean;
  setNoShowAlertsEnabled: (v: boolean) => void;
  queueFullAlertsEnabled: boolean;
  setQueueFullAlertsEnabled: (v: boolean) => void;
  calledToCounterEnabled: boolean;
  setCalledToCounterEnabled: (v: boolean) => void;
  secondLineEnabled: boolean;
  setSecondLineEnabled: (v: boolean) => void;
  appSettings: {
    businessName: string;
    businessHours: { day: string; open: boolean; startTime: string; endTime: string }[];
    queueSettings: {
      maxQueueSize: number;
      estimatedServiceTime: number;
      autoCallNext: boolean;
    };
  };
  setAppSettings: (settings: AppState['appSettings']) => void;
}

const AppContext = createContext<AppState | null>(null);

const defaultQueueList: QueueItem[] = [
  { ticket: 'A-001', status: 'serving' },
  { ticket: 'A-002', status: 'next' },
  { ticket: 'A-003', status: 'standby' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('A-001');
  const [queuePosition, setQueuePosition] = useState(1);
  const [queueList, setQueueList] = useState<QueueItem[]>(defaultQueueList);
  const [inQueueCount, setInQueueCount] = useState(15);
  const [nowServing, setNowServing] = useState('A-001');
  const [acceptingCustomers, setAcceptingCustomers] = useState(true);
  const [queuePaused, setQueuePaused] = useState(false);
  const [noShowAlertsEnabled, setNoShowAlertsEnabled] = useState(true);
  const [queueFullAlertsEnabled, setQueueFullAlertsEnabled] = useState(true);
  const [calledToCounterEnabled, setCalledToCounterEnabled] = useState(true);
  const [secondLineEnabled, setSecondLineEnabled] = useState(true);
  const [appSettings, setAppSettings] = useState<AppState['appSettings']>({
    businessName: 'Grand Dental Clinic',
    businessHours: [
      { day: 'Monday', open: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Tuesday', open: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Wednesday', open: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Thursday', open: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Friday', open: true, startTime: '09:00', endTime: '18:00' },
      { day: 'Saturday', open: true, startTime: '10:00', endTime: '16:00' },
      { day: 'Sunday', open: false, startTime: '00:00', endTime: '00:00' },
    ],
    queueSettings: {
      maxQueueSize: 50,
      estimatedServiceTime: 30,
      autoCallNext: true,
    },
  });

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        isLoggedIn,
        setIsLoggedIn,
        ticketNumber,
        setTicketNumber,
        queuePosition,
        setQueuePosition,
        queueList,
        setQueueList,
        inQueueCount,
        setInQueueCount,
        nowServing,
        setNowServing,
        acceptingCustomers,
        setAcceptingCustomers,
        queuePaused,
        setQueuePaused,
        noShowAlertsEnabled,
        setNoShowAlertsEnabled,
        queueFullAlertsEnabled,
        setQueueFullAlertsEnabled,
        calledToCounterEnabled,
        setCalledToCounterEnabled,
        secondLineEnabled,
        setSecondLineEnabled,
        appSettings,
        setAppSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useT() {
  const { language } = useApp();
  const { translations } = require('@/constants/translations');
  return (key: string): string => translations[language]?.[key] ?? translations['en'][key] ?? key;
}
