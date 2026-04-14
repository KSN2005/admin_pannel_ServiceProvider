import { api } from "./api";

export const getSubmissions = () => api.get("/api/submissions").then((res) => res.data);
export const deleteSubmission = (id) => api.delete(`/api/submissions/${id}`);
export const submitContact = (payload) => api.post("/api/contact", payload);
