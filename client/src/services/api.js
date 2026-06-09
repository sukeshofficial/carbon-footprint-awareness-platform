const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch health:", error);
    throw error;
  }
};
