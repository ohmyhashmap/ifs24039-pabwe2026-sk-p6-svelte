import { writable, derived } from "svelte/store";
import { loginApi, registerApi } from "../api/authApi.js";
import { getMeApi } from "../../users/api/userApi.js";
import { putAccessToken, removeAccessToken, getAccessToken } from "../../../helpers/apiHelper.js";
import { navigate } from "../../../router.js";

export const profile = writable(null);
export const isAuthenticated = derived(profile, ($p) => !!$p);

export async function loadProfile() {
  if (!getAccessToken()) {
    profile.set(null);
    return null;
  }
  const r = await getMeApi();
  if (!r.ok) {
    removeAccessToken();
    profile.set(null);
    return null;
  }
  profile.set(r.data.user);
  return r.data.user;
}

export async function login(email, password) {
  const r = await loginApi(email, password);
  if (r.ok) {
    putAccessToken(r.data.token);
    await loadProfile();
  }
  return r;
}

export const register = (name, email, password) => registerApi(name, email, password);

export function logout() {
  removeAccessToken();
  profile.set(null);
  navigate("/auth/login", { replace: true });
}
