import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
vi.mock("../api/authApi.js", () => ({ loginApi: vi.fn(), registerApi: vi.fn() }));
vi.mock("../../users/api/userApi.js", () => ({ getMeApi: vi.fn() }));
import { loginApi, registerApi } from "../api/authApi.js";
import { getMeApi } from "../../users/api/userApi.js";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper.js";
import { currentPath } from "../../../router.js";
import { profile, isAuthenticated, loadProfile, login, register, logout } from "./authStore.js";

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  profile.set(null);
});

describe("authStore", () => {
  it("loadProfile tanpa token", async () => {
    expect(await loadProfile()).toBeNull();
    expect(getMeApi).not.toHaveBeenCalled();
  });
  it("loadProfile gagal menghapus token", async () => {
    putAccessToken("t");
    getMeApi.mockResolvedValue({ ok: false });
    expect(await loadProfile()).toBeNull();
    expect(getAccessToken()).toBeNull();
  });
  it("loadProfile sukses", async () => {
    putAccessToken("t");
    getMeApi.mockResolvedValue({ ok: true, data: { user: { id: 1 } } });
    expect(await loadProfile()).toEqual({ id: 1 });
    expect(get(profile)).toEqual({ id: 1 });
    expect(get(isAuthenticated)).toBe(true);
  });
  it("login sukses menyimpan token & memuat profil", async () => {
    loginApi.mockResolvedValue({ ok: true, data: { token: "abc" } });
    getMeApi.mockResolvedValue({ ok: true, data: { user: { id: 2 } } });
    const r = await login("e", "p");
    expect(r.ok).toBe(true);
    expect(getAccessToken()).toBe("abc");
    expect(get(profile)).toEqual({ id: 2 });
  });
  it("login gagal", async () => {
    loginApi.mockResolvedValue({ ok: false, message: "salah" });
    const r = await login("e", "p");
    expect(r.ok).toBe(false);
    expect(getAccessToken()).toBeNull();
  });
  it("register", async () => {
    registerApi.mockResolvedValue({ ok: true });
    expect((await register("n", "e", "p")).ok).toBe(true);
    expect(registerApi).toHaveBeenCalledWith("n", "e", "p");
  });
  it("logout", () => {
    putAccessToken("t");
    profile.set({ id: 1 });
    logout();
    expect(getAccessToken()).toBeNull();
    expect(get(profile)).toBeNull();
    expect(get(currentPath)).toBe("/auth/login");
  });
});
