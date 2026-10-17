import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
vi.mock("../states/authStore.js", () => ({ login: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showErrorDialog: vi.fn() }));
import { login } from "../states/authStore.js";
import { showErrorDialog } from "../../../helpers/toolsHelper.js";
import LoginPage from "./LoginPage.svelte";

async function fill() {
  await fireEvent.input(screen.getByPlaceholderText("Email"), { target: { value: "a@b.c" } });
  await fireEvent.input(screen.getByPlaceholderText("Kata sandi"), { target: { value: "pw" } });
  await fireEvent.submit(screen.getByRole("button", { name: /Masuk|Memproses/ }).closest("form"));
}

describe("LoginPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("login sukses -> ke beranda, tombol sibuk saat proses", async () => {
    let done;
    login.mockReturnValue(new Promise((r) => (done = r)));
    render(LoginPage);
    await fill();
    expect(screen.getByText("Memproses...")).toBeInTheDocument();
    done({ ok: true });
    await waitFor(() => expect(window.location.pathname).toBe("/"));
    expect(login).toHaveBeenCalledWith("a@b.c", "pw");
  });
  it("login gagal menampilkan dialog error", async () => {
    login.mockResolvedValue({ ok: false, message: "salah" });
    render(LoginPage);
    await fill();
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("salah"));
  });
});
