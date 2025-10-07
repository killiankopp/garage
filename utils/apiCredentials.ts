import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL_KEY = 'api_url';
const BEARER_TOKEN_KEY = 'bearer_token';
const OPENING_TIME_KEY = 'opening_time_seconds';
const CLOSING_TIME_KEY = 'closing_time_seconds';

// Fallback for web: use localStorage
const isWeb = Platform.OS === 'web';

export async function saveApiUrl(url: string) {
  if (isWeb) {
    localStorage.setItem(API_URL_KEY, url);
  } else {
    await SecureStore.setItemAsync(API_URL_KEY, url);
  }
}

export async function getApiUrl(): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(API_URL_KEY);
  } else {
    return SecureStore.getItemAsync(API_URL_KEY);
  }
}

export async function saveBearerToken(token: string) {
  if (isWeb) {
    localStorage.setItem(BEARER_TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(BEARER_TOKEN_KEY, token);
  }
}

export async function getBearerToken(): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(BEARER_TOKEN_KEY);
  } else {
    return SecureStore.getItemAsync(BEARER_TOKEN_KEY);
  }
}

export async function saveOpeningTime(seconds: number) {
  const value = seconds.toString();
  if (isWeb) {
    localStorage.setItem(OPENING_TIME_KEY, value);
  } else {
    await SecureStore.setItemAsync(OPENING_TIME_KEY, value);
  }
}

export async function getOpeningTime(): Promise<number | null> {
  const value = isWeb
    ? localStorage.getItem(OPENING_TIME_KEY)
    : await SecureStore.getItemAsync(OPENING_TIME_KEY);

  return value ? parseInt(value, 10) : null;
}

export async function saveClosingTime(seconds: number) {
  const value = seconds.toString();
  if (isWeb) {
    localStorage.setItem(CLOSING_TIME_KEY, value);
  } else {
    await SecureStore.setItemAsync(CLOSING_TIME_KEY, value);
  }
}

export async function getClosingTime(): Promise<number | null> {
  const value = isWeb
    ? localStorage.getItem(CLOSING_TIME_KEY)
    : await SecureStore.getItemAsync(CLOSING_TIME_KEY);

  return value ? parseInt(value, 10) : null;
}

export async function clearApiCredentials() {
  if (isWeb) {
    localStorage.removeItem(API_URL_KEY);
    localStorage.removeItem(BEARER_TOKEN_KEY);
    localStorage.removeItem(OPENING_TIME_KEY);
    localStorage.removeItem(CLOSING_TIME_KEY);
  } else {
    await SecureStore.deleteItemAsync(API_URL_KEY);
    await SecureStore.deleteItemAsync(BEARER_TOKEN_KEY);
    await SecureStore.deleteItemAsync(OPENING_TIME_KEY);
    await SecureStore.deleteItemAsync(CLOSING_TIME_KEY);
  }
}
