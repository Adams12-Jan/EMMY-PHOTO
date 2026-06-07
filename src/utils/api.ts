import { simulateApi } from './localDb';

let useLocalFallback = false;

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  if (url.includes('/api/')) {
    if (useLocalFallback) {
      return simulateApi(url, init);
    }

    try {
      const res = await window.fetch(input, init);
      // Vercel serverless or static hosting returns 404/502/405 for missing endpoints
      if (res.status === 404 || res.status >= 500) {
        console.warn(`[API Interceptor] Server returned status ${res.status}. Deploying client-side fallback database emulator.`);
        useLocalFallback = true;
        return simulateApi(url, init);
      }
      return res;
    } catch (err) {
      console.warn('[API Interceptor] Server connection failed or is offline. Activating client-side database emulator.', err);
      useLocalFallback = true;
      return simulateApi(url, init);
    }
  }

  return window.fetch(input, init);
}
