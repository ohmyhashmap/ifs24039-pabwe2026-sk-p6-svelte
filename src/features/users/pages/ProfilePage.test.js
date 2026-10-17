import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
vi.mock("../api/userApi.js", () => ({ updateMeApi: vi.fn(), updatePhotoApi: vi.fn(), updatePasswordApi: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
vi.mock("../../auth/states/authStore.js", async (orig) => ({ ...(await orig()), loadProfile: vi.fn() }));
import { updateMeApi, updatePhotoApi, updatePasswordApi } from "../api/userApi.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";
import { profile, loadProfile } from "../../auth/states/authStore.js";
import ProfilePage from "./ProfilePage.svelte";

const submitOf = (placeholder) => screen.getByPlaceholderText(placeholder).closest("form");

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    profile.set({ name: "Ani", email: "a@x.id", photo: "http://x/p.png" });
  });

  it("ubah data sukses & gagal", async () => {
    updateMeApi.mockResolvedValueOnce({ ok: true });
    render(ProfilePage);
    expect(screen.getByAltText("Foto profil")).toBeInTheDocument();
    await fireEvent.input(screen.getByPlaceholderText("Nama"), { target: { value: "Budi" } });
    await fireEvent.submit(submitOf("Nama"));
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith("Profil diperbarui"));
    expect(updateMeApi).toHaveBeenCalledWith("Budi", "a@x.id");
    expect(loadProfile).toHaveBeenCalled();

    updateMeApi.mockResolvedValueOnce({ ok: false, message: "err" });
    await fireEvent.submit(submitOf("Nama"));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err"));
  });
  it("ganti foto: dengan & tanpa berkas", async () => {
    updatePhotoApi.mockResolvedValue({ ok: true });
    const { container } = render(ProfilePage);
    const input = container.querySelector('input[type="file"]');
    await fireEvent.change(input, { target: { files: [] } });
    expect(updatePhotoApi).not.toHaveBeenCalled();
    const file = new File(["x"], "a.png");
    await fireEvent.change(input, { target: { files: [file] } });
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith("Foto diperbarui"));
    expect(updatePhotoApi).toHaveBeenCalledWith(file);
  });
  it("ubah kata sandi: sukses mengosongkan, gagal tidak", async () => {
    render(ProfilePage);
    const old = screen.getByPlaceholderText("Kata sandi lama");
    const neu = screen.getByPlaceholderText("Kata sandi baru");
    await fireEvent.input(old, { target: { value: "o" } });
    await fireEvent.input(neu, { target: { value: "n" } });

    updatePasswordApi.mockResolvedValueOnce({ ok: false, message: "salah" });
    await fireEvent.submit(submitOf("Kata sandi lama"));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("salah"));
    expect(old).toHaveValue("o");

    updatePasswordApi.mockResolvedValueOnce({ ok: true });
    await fireEvent.submit(submitOf("Kata sandi lama"));
    await waitFor(() => expect(old).toHaveValue(""));
    expect(updatePasswordApi).toHaveBeenLastCalledWith("o", "n");
  });
  it("tanpa profil & tanpa foto", () => {
    profile.set(null);
    render(ProfilePage);
    expect(screen.queryByAltText("Foto profil")).toBeNull();
    expect(screen.getByPlaceholderText("Nama")).toHaveValue("");
  });
});
