import { apiFetch } from "../../../helpers/apiHelper.js";

export const getUsersApi = () => apiFetch("/users");
export const getMeApi = () => apiFetch("/users/me");
export const updateMeApi = (name, email) => apiFetch("/users/me", { method: "PUT", body: { name, email } });
export const updatePhotoApi = (file) => {
  const form = new FormData();
  form.append("photo", file);
  return apiFetch("/users/me/photo", { method: "POST", form });
};
export const updatePasswordApi = (password, new_password) =>
  apiFetch("/users/me/password", { method: "PUT", body: { password, new_password } });
