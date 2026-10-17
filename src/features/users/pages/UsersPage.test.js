import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/svelte";
vi.mock("../api/userApi.js", () => ({ getUsersApi: vi.fn() }));
import { getUsersApi } from "../api/userApi.js";
import UsersPage from "./UsersPage.svelte";

describe("UsersPage", () => {
  it("menampilkan daftar pengguna", async () => {
    getUsersApi.mockResolvedValue({ ok: true, data: { users: [{ id: 1, name: "Ani", email: "ani@x.id" }] } });
    render(UsersPage);
    await waitFor(() => expect(screen.getByText("Ani")).toBeInTheDocument());
    expect(screen.getByText("ani@x.id")).toBeInTheDocument();
  });
  it("gagal -> daftar kosong", async () => {
    getUsersApi.mockResolvedValue({ ok: false });
    render(UsersPage);
    await waitFor(() => expect(getUsersApi).toHaveBeenCalled());
    expect(screen.queryByRole("listitem")).toBeNull();
  });
});
