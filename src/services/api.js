export const API_BASE = "http://127.0.0.1:8000/api";

export const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});