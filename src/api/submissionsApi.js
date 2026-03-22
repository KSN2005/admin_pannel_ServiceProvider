import { api } from "./api";

export const getSubmissions = () => api.get("/submissions").then(res => res.data);
export const deleteSubmission = (id) => api.delete(`/submissions/${id}`);
export const submitContact = (payload) => api.post("/contact", payload);
