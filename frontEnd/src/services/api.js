import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const TOKEN_KEY = "auth_token";
const USER_KEY = "userData";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("auth:changed"));
      window.dispatchEvent(
        new CustomEvent("toast:add", {
          detail: {
            type: "error",
            message: "Votre session a expire. Veuillez vous reconnecter.",
          },
        })
      );

      if (window.location.pathname !== "/connexion") {
        window.location.assign("/connexion");
      }
    }

    return Promise.reject(error);
  }
);

export const fetchServices = async (params = {}) => {
  const response = await api.get("/services", { params });
  return response.data;
};

export const fetchPrestataires = async () => {
  const response = await api.get("/prestataires");
  return response.data;
};

export const fetchPrestatairePhotos = async (prestataireId) => {
  const response = await api.get(`/photos/${prestataireId}`);
  return response.data;
};

export const uploadPrestatairePhoto = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post("/photos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updatePrestatairePhoto = async (photoId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post(`/photos/${photoId}?_method=PUT`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deletePrestatairePhoto = async (photoId) => {
  const response = await api.delete(`/photos/${photoId}`);
  return response.data;
};

export const fetchServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

export const fetchMyServices = async () => {
  const response = await api.get("/my-services");
  return response.data;
};

export const createService = async (payload) => {
  const response = await api.post("/services", payload);
  return response.data;
};

export const updateService = async (serviceId, payload) => {
  const response = await api.put(`/services/${serviceId}`, payload);
  return response.data;
};

export const deleteService = async (serviceId) => {
  const response = await api.delete(`/services/${serviceId}`);
  return response.data;
};

export const createReservation = async (payload) => {
  const response = await api.post("/reservations", payload);
  return response.data;
};

export const fetchMyReservations = async () => {
  const response = await api.get("/my-reservations");
  return response.data;
};

export const acceptReservation = async (reservationId) => {
  const response = await api.post(`/accept-reservation/${reservationId}`);
  return response.data;
};

export const refuseReservation = async (reservationId) => {
  const response = await api.post(`/refuse-reservation/${reservationId}`);
  return response.data;
};

export const createAvis = async (payload) => {
  const response = await api.post("/avis", payload);
  return response.data;
};

export default api;
