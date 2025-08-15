import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

function isIpAddress(value: string) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(value);
}

function isPrivateIp(ip: string) {
  if (!isIpAddress(ip)) return false;
  const [a, b] = ip.split('.').map((n) => parseInt(n, 10));
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

export function getApiBaseUrl(port: number = 5000): string {
  // 1) Manual override via app.json -> expo.extra.apiUrl
  const extra = (Constants.expoConfig?.extra as any) || {};
  const explicit = typeof extra.apiUrl === 'string' ? (extra.apiUrl as string) : undefined;
  if (explicit && explicit.trim().length > 0) {
    return explicit.trim();
  }

  // 2) Determine per-platform/device
  const dbgHost: string | undefined = (Constants as any)?.expoGoConfig?.debuggerHost;
  const lanIp = dbgHost?.split(':')?.[0];

  if (Platform.OS === 'android') {
    // Android emulator should always use 10.0.2.2
    if (!Device.isDevice) {
      return `http://10.0.2.2:${port}`;
    }
    // Physical Android device: prefer LAN IP if available; otherwise fallback to 10.0.2.2
    if (lanIp && isPrivateIp(lanIp)) {
      return `http://${lanIp}:${port}`;
    }
    return `http://10.0.2.2:${port}`;
  }

  if (Platform.OS === 'ios') {
    // iOS simulator uses localhost
    if (!Device.isDevice) {
      return `http://127.0.0.1:${port}`;
    }
    // Physical iOS device: prefer LAN IP if available; otherwise fallback to localhost
    if (lanIp && isPrivateIp(lanIp)) {
      return `http://${lanIp}:${port}`;
    }
    return `http://127.0.0.1:${port}`;
  }

  // Default fallback
  return `http://127.0.0.1:${port}`;
}

export const API_BASE_URL = getApiBaseUrl();




