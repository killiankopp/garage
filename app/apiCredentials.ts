import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_URL_KEY = 'api_url';
const BEARER_TOKEN_KEY = 'bearer_token';

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

export async function clearApiCredentials() {
  if (isWeb) {
    localStorage.removeItem(API_URL_KEY);
    localStorage.removeItem(BEARER_TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(API_URL_KEY);
    await SecureStore.deleteItemAsync(BEARER_TOKEN_KEY);
  }
}
