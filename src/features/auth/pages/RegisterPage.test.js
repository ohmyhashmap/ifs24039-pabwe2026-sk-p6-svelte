import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
vi.mock("../states/authStore.js", () => ({ register: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn().mockResolvedValue() }));
import { register } from "../states/authStore.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";
import RegisterPage from "./RegisterPage.svelte";

async function fill() {
  await fireEvent.input(screen.getByPlaceholderText("Nama"), { target: { value: "N" } });
  await fireEvent.input(screen.getByPlaceholderText("Email"), { target: { value: "a@b.c" } });
  await fireEvent.input(screen.getByPlaceholderText("Kata sandi"), { target: { value: "pw" } });
  await fireEvent.submit(screen.getByRole("button", { name: /Daftar|Memproses/ }).closest("form"));
}

describe("RegisterPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("register sukses -> dialog & ke login", async () => {
    let done;
    register.mockReturnValue(new Promise((r) => (done = r)));
    render(RegisterPage);
    await fill();
    expect(screen.getByText("Memproses...")).toBeInTheDocument();
    done({ ok: true });
    await waitFor(() => expect(window.location.pathname).toBe("/auth/login"));
    expect(register).toHaveBeenCalledWith("N", "a@b.c", "pw");
    expect(showSuccessDialog).toHaveBeenCalled();
  });
  it("register gagal", async () => {
    register.mockResolvedValue({ ok: false, message: "dipakai" });
    render(RegisterPage);
    await fill();
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("dipakai"));
  });
});
