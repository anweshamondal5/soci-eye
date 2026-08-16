/**
 * Soci-Eye Frontend API Service
 * Handles communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analyzeTopic(topic) {
  const cleanTopic = topic.trim();
  if (!cleanTopic) {
    throw new Error("Please enter a brand, product, person or topic to analyze.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze?topic=${encodeURIComponent(cleanTopic)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || data.detail || `Server error (${response.status})`);
    }

    return data;
  } catch (error) {
    console.error("API Error during analysis:", error);
    // If backend is unreachable
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error("Cannot connect to Soci-Eye backend server. Make sure the backend is running on http://localhost:8000.");
    }
    throw error;
  }
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    return null;
  }
}
