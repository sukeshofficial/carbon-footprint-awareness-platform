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

export const submitFeedback = async ({ name, email, message, anonymous = false }) => {
  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, message, anonymous }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to send feedback.");
  }

  return data;
};

