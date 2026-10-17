import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/svelte";
vi.mock("./features/auth/states/authStore.js", async (orig) => ({ ...(await orig()), loadProfile: vi.fn() }));
import { profile, loadProfile } from "./features/auth/states/authStore.js";
import { navigate } from "./router.js";
import App from "./App.svelte";

beforeEach(() => {
  vi.clearAllMocks();
  profile.set(null);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    json: async () => ({ status: "success", data: { link_trees: [], users: [], link_tree: null } }),
  }));
});

describe("App", () => {
  it("menampilkan 'Memuat...' sebelum sesi siap", () => {
    loadProfile.mockReturnValue(new Promise(() => {}));
    navigate("/");
    render(App);
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
  });
  it("belum login di rute aplikasi -> diarahkan ke login", async () => {
    loadProfile.mockResolvedValue(null);
    navigate("/users");
    render(App);
    await waitFor(() => expect(window.location.pathname).toBe("/auth/login"));
    expect(await screen.findByPlaceholderText("Email")).toBeInTheDocument();
  });
  it("sudah login di rute auth -> diarahkan ke beranda", async () => {
    loadProfile.mockImplementation(async () => profile.set({ id: 1, name: "Ani" }));
    navigate("/auth/login");
    render(App);
    await waitFor(() => expect(window.location.pathname).toBe("/"));
    expect(await screen.findByRole("heading", { name: "Semua Link Tree" })).toBeInTheDocument();
  });
  it("sudah login: halaman 404 untuk rute tak dikenal", async () => {
    loadProfile.mockImplementation(async () => profile.set({ id: 1, name: "Ani" }));
    navigate("/tidak-ada");
    render(App);
    expect(await screen.findByText("404")).toBeInTheDocument();
  });
  it("sudah login: halaman register diarahkan, detail tampil", async () => {
    loadProfile.mockImplementation(async () => profile.set({ id: 1, name: "Ani" }));
    navigate("/link-trees/1");
    render(App);
    expect(await screen.findByText(/tidak ditemukan/)).toBeInTheDocument();
  });
});
