const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const requestAuth = async (path, payload) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Authentication request failed.");
  }

  return data;
};

export const login = (payload) => requestAuth("login", payload);

export const register = (payload) => requestAuth("register", payload);

export const saveSession = ({ token, user }) => {
  localStorage.setItem("vshopToken", token);
  localStorage.setItem("vshopUser", JSON.stringify(user));
};
