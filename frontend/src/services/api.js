/**
 * Soci-Eye Frontend API Service
 * Handles communication with the FastAPI backend
 * Robust runtime & build-time URL resolver
 */

function getApiBaseUrl() {
  // 1. Direct browser runtime check: If on onrender.com or any remote production domain, always use production backend
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const proto = window.location.protocol;
    
    // Check if on Render or any cloud deployment
    if (host.includes('onrender.com') || host.includes('vercel.app') || (proto === 'https:' && !host.includes('localhost') && !host.includes('127.0.0.1'))) {
      return 'https://soci-eye-backend.onrender.com';
    }
  }

  // 2. Build-time environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() && envUrl !== 'undefined' && envUrl !== 'null') {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  }

  // 3. Localhost fallback
  return 'http://localhost:8000';
}

const API_BASE_URL = getApiBaseUrl();

export async function analyzeTopic(topic) {
  const cleanTopic = topic.trim();
  if (!cleanTopic) {
    throw new Error("Please enter a brand, product, person or topic to analyze.");
  }

  const base = getApiBaseUrl();
  const url = `${base}/api/analyze?topic=${encodeURIComponent(cleanTopic)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error("Non-JSON response received from", url, ":", text.slice(0, 200));
      throw new Error(`Connected to ${base}, but received non-JSON response. Please ensure the backend is active.`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || data.detail || `Server error (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error("API Error during analysis:", error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error(`Cannot connect to Soci-Eye backend at ${base}. The free server may be waking up from sleep. Please retry in a few seconds.`);
    }
    throw error;
  }
}

export async function checkBackendHealth() {
  try {
    const base = getApiBaseUrl();
    const url = `${base}/api/health`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}

export { API_BASE_URL };
