import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: 'en' | 'sw' | 'zu' | 'xh' | 'af';
  notifications?: boolean;
  defaultDashboard?: 'traveler' | 'mafunzo' | 'abantu' | 'retreat';
  animationsEnabled?: boolean;
  soundEnabled?: boolean;
  [key: string]: string | boolean | number | undefined;
}

interface AppState {
  user: User | null;
  currentDashboard: string | null;
  userPreferences: UserPreferences;
  navigationHistory: string[];
  isLoading: boolean;
  lastActivity: Date | null;
  sessionId: string | null;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CURRENT_DASHBOARD'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'ADD_TO_HISTORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_ACTIVITY'; payload: Date }
  | { type: 'SET_SESSION'; payload: string | null }
  | { type: 'RESET_STATE' };

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: true,
  defaultDashboard: 'traveler',
  animationsEnabled: true,
  soundEnabled: false,
};

const initialState: AppState = {
  user: null,
  currentDashboard: null,
  userPreferences: defaultPreferences,
  navigationHistory: [],
  isLoading: true,
  lastActivity: null,
  sessionId: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CURRENT_DASHBOARD':
      return { ...state, currentDashboard: action.payload };
    case 'UPDATE_PREFERENCES':
      return { 
        ...state, 
        userPreferences: { ...state.userPreferences, ...action.payload }
      };
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        navigationHistory: [...state.navigationHistory.slice(-9), action.payload]
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_ACTIVITY':
      return { ...state, lastActivity: action.payload };
    case 'SET_SESSION':
      return { ...state, sessionId: action.payload };
    case 'RESET_STATE':
      return { ...initialState, userPreferences: defaultPreferences };
    default:
      return state;
  }
};

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addToHistory: (path: string) => void;
  resetAppState: () => void;
} | null>(null);

export { AppStateContext };

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions
  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: prefs });
    // Persist to localStorage
    try {
      localStorage.setItem('bantu-user-preferences', JSON.stringify({ ...state.userPreferences, ...prefs }));
    } catch (error) {
      console.warn('Failed to save preferences to localStorage:', error);
    }
  }, [state.userPreferences]);

  const addToHistory = useCallback((path: string) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: path });
    dispatch({ type: 'UPDATE_ACTIVITY', payload: new Date() });
  }, []);

  const resetAppState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
    try {
      localStorage.removeItem('bantu-user-preferences');
    } catch (error) {
      console.warn('Failed to clear preferences from localStorage:', error);
    }
  }, []);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('bantu-user-preferences');
      if (savedPrefs) {
        const preferences = JSON.parse(savedPrefs);
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
      }
    } catch (error) {
      console.warn('Failed to load preferences from localStorage:', error);
    }

    // Generate session ID
    const sessionId = crypto.randomUUID();
    dispatch({ type: 'SET_SESSION', payload: sessionId });
  }, []);

  return (
    <AppStateContext.Provider value={{ 
      state, 
      dispatch, 
      updatePreferences, 
      addToHistory, 
      resetAppState 
    }}>
      {children}
    </AppStateContext.Provider>
  );
};
