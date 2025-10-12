// Centralized API Configuration
// Development: http://localhost:4010
// Production: http://103.195.102.76:4010

const getApiBaseUrl = () => {
  // Priority 1: Environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Priority 2: Check if in production mode
  if (process.env.NODE_ENV === "production") {
    return "http://103.195.102.76:4010";
  }

  // Priority 3: Default to localhost for development
  return "http://localhost:4010";
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;
