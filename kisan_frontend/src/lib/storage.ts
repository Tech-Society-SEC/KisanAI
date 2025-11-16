import { UserProfile, HistoryItem } from './types';

const PROFILE_KEY = 'kisan-profile';
const HISTORY_KEY = 'kisan-history';
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/* ----------------------------------------
   PROFILE STORAGE
---------------------------------------- */
export const saveProfile = (profile: UserProfile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

/* ----------------------------------------
   HISTORY STORAGE
---------------------------------------- */
export const saveToHistory = (item: HistoryItem) => {
  const history = getHistory();
  history.unshift(item);
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

/* ----------------------------------------
   TOKEN STORAGE (NEW)
---------------------------------------- */
export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/* ----------------------------------------
   LOGOUT (NEW)
---------------------------------------- */
export const logoutUser = () => {
  clearTokens();
  localStorage.removeItem(PROFILE_KEY);
  // NOTE: history is optional — up to you:
  // clearHistory();
};
