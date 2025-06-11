import { USER_AGENT } from "../constants";

export const makeNWSRequest = async <T>(url: string): Promise<T | null> => {
  const headers = {
    "User-Agent": "weather-app/1.0",
    Accept: "application/geo+json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error making NWS request:", error);
    return null;
  }
};
