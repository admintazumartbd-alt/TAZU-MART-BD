import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type ActivityType = 
  | 'LOGIN' 
  | 'REGISTRATION' 
  | 'ADD_TO_CART' 
  | 'REMOVE_FROM_CART' 
  | 'START_CHECKOUT' 
  | 'ORDER_PLACED' 
  | 'VIEW_PRODUCT'
  | 'WISHLIST_ADDED';

export interface ActivityLog {
  id: number;
  userId: string | 'GUEST';
  userName: string;
  type: ActivityType;
  details?: any;
  timestamp: string;
  device: 'Mobile' | 'Desktop';
}

interface ActivityContextType {
  logActivity: (type: ActivityType, details?: any) => void;
  getActivities: () => ActivityLog[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const logActivity = (type: ActivityType, details?: any) => {
    const activities = JSON.parse(localStorage.getItem('tazu_activities') || '[]');
    const newLog: ActivityLog = {
      id: Date.now(),
      userId: user?.id || 'GUEST',
      userName: user?.name || 'Guest User',
      type,
      details,
      timestamp: new Date().toISOString(),
      device: window.innerWidth < 768 ? 'Mobile' : 'Desktop'
    };
    activities.push(newLog);
    localStorage.setItem('tazu_activities', JSON.stringify(activities));
    
    // Also update "Customer Monitoring" summary
    updateMonitoringSummary(type);
  };

  const updateMonitoringSummary = (type: ActivityType) => {
    const summary = JSON.parse(localStorage.getItem('tazu_monitoring_summary') || '{}');
    summary[type] = (summary[type] || 0) + 1;
    localStorage.setItem('tazu_monitoring_summary', JSON.stringify(summary));
  };

  const getActivities = () => {
    return JSON.parse(localStorage.getItem('tazu_activities') || '[]');
  };

  return (
    <ActivityContext.Provider value={{ logActivity, getActivities }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) throw new Error('useActivity must be used within an ActivityProvider');
  return context;
}
