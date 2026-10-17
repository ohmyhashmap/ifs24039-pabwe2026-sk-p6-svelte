import { apiFetch } from "../../../helpers/apiHelper.js";

export const loginApi = (email, password) => apiFetch("/auth/login", { method: "POST", body: { email, password } });
export const registerApi = (name, email, password) =>
  apiFetch("/auth/register", { method: "POST", body: { name, email, password } });
