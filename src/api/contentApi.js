import { api } from "./api";

export const getPageContent = (page) => api.get(`/page/${page}`).then(res => res.data);
export const updatePageContent = (page, payload) => api.put(`/page/${page}`, payload).then(res => res.data);
