/**
 * Soci-Eye Frontend API Service
 * Handles communication with the FastAPI backend
 * Robust URL resolver supporting both local development and Render/Vercel production
 */

function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl && envUrl !== 'undefined' && envUrl !== 'null' && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }
    return clean;
  }

  // Automatic production resolution when hosted on onrender.com
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    return 'https://soci-eye-backend.onrender.com';
  }

  // Local development default
  return 'http://localhost:8000';
}

const API_BASE_URL = getApiBaseUrl();

export async function analyzeTopic(topic) {
  const cleanTopic = topic.trim();
  if (!cleanTopic) {
    throw new Error("Please enter a brand, product, person or topic to analyze.");
  }

  try {
    const url = `${API_BASE_URL}/api/analyze?topic=${encodeURIComponent(cleanTopic)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error("Non-JSON response received:", text.slice(0, 300));
      throw new Error(`Server returned non-JSON response from ${API_BASE_URL}. Please ensure the backend is running.`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || data.detail || `Server error (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error("API Error during analysis:", error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error(`Cannot connect to Soci-Eye backend at ${API_BASE_URL}. The server may be waking up from sleep. Please retry in a few seconds.`);
    }
    throw error;
  }
}

export async function checkBackendHealth() {
  try {
    const url = `${API_BASE_URL}/api/health`;
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
