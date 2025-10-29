import { UserProfile, HistoryItem } from './types';

const PROFILE_KEY = 'kisan-profile';
const HISTORY_KEY = 'kisan-history';

export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveToHistory = (item: HistoryItem) => {
  const history = getHistory();
  history.unshift(item);
  // Keep only last 20 items
  const trimmed = history.slice(0, 20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
};

export const getHistory = (): HistoryItem[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearHistory = () => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
};
