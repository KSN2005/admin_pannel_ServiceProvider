import { api } from "./api";

export const getSettings = () => api.get("/settings").then(res => res.data);
export const updateSetting = (key, value) => api.put("/settings", { key, value }).then(res => res.data);
