import { apiRequest } from "./client";

const requestAuth = async (path, payload) => {
  return apiRequest(`/api/auth/${path}`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, "Authentication request could not be completed.");
};

export const login = (payload) => requestAuth("login", payload);

export const register = (payload) => requestAuth("register", payload);

export const saveSession = ({ token, user }) => {
  localStorage.setItem("vshopToken", token);
  localStorage.setItem("vshopUser", JSON.stringify(user));
};

export const getSavedUser = () => {
  const savedUser = localStorage.getItem("vshopUser");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("vshopUser");
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("vshopToken");
  localStorage.removeItem("vshopUser");
};
