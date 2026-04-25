import api from "./api";

const TOKEN_KEY = "auth_token";
const USER_KEY = "userData";

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const storeAuthData = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        client: user.client ?? null,
        prestataire: user.prestataire ?? null,
      })
    );
  }

  window.dispatchEvent(new Event("auth:changed"));
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem("isAdminAuthenticated");
  sessionStorage.removeItem("isProviderAuthenticated");
  window.dispatchEvent(new Event("auth:changed"));
};

export const getDefaultRouteForRole = (role) => {
  if (role === "prestataire") {
    return "/provider-dashboard";
  }

  if (role === "admin") {
    return "/admin";
  }

  return "/user-dashboard";
};

export const loginUser = async (email, password) => {
  const response = await api.post("/login", { email, password });
  const { user, token } = response.data;

  storeAuthData({ user, token });

  return response.data;
};

export const registerUser = async (payload) => {
  const response = await api.post("/register", payload);
  const { user, token } = response.data;

  storeAuthData({ user, token });

  return response.data;
};

export const logoutUser = async () => {
  try {
    if (getStoredToken()) {
      await api.post("/logout");
    }
  } catch (error) {
    // Ignore logout request failures and clear local auth state anyway.
  } finally {
    clearAuthData();
  }
};

export const forceLogout = (redirectTo = "/connexion") => {
  clearAuthData();

  if (window.location.pathname !== redirectTo) {
    window.location.assign(redirectTo);
  }
};

export const isAuthenticated = () => Boolean(getStoredToken() && getStoredUser());
