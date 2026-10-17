import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
vi.mock("../states/linkTreesStore.js", async (orig) => ({
  ...(await orig()), fetchLinkTrees: vi.fn(), removeLinkTree: vi.fn(), removeAllLinkTrees: vi.fn(),
}));
vi.mock("../../../helpers/toolsHelper.js", async (orig) => ({
  ...(await orig()), showConfirmDialog: vi.fn(), showErrorDialog: vi.fn(), showSuccessDialog: vi.fn(),
}));
import { fetchLinkTrees, removeLinkTree, removeAllLinkTrees } from "../states/linkTreesStore.js";
import { showConfirmDialog, showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";
import { linkTrees } from "../states/linkTreesStore.js";
import { tick } from "svelte";
import { renderWithProviders } from "../../../test-utils.js";
import HomePage from "./HomePage.svelte";

const data = [
  { id: 1, user_id: 1, title: "Alpha", description: "d", type: "public", cover: "http://x/c.png", created_at: "2026-01-01" },
  { id: 2, user_id: 2, title: "Beta", description: "d", type: "private" },
  { id: 3, user_id: 1, title: "Gamma", description: "d", type: "unlisted" },
];
const render = (stores = {}) => renderWithProviders(HomePage, { stores: { profile: { id: 1 }, linkTrees: data, ...stores } });

describe("HomePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memuat data, statistik, dan daftar", () => {
    render();
    expect(fetchLinkTrees).toHaveBeenCalled();
    expect(screen.getByText("Alpha")).toHaveAttribute("href", "/link-trees/1");
    expect(screen.getByAltText("Alpha")).toBeInTheDocument();
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(3);
    expect(screen.getByLabelText("Hapus Alpha")).toBeInTheDocument();
    expect(screen.queryByLabelText("Hapus Beta")).toBeNull();
  });
  it("status memuat & kosong", () => {
    const a = render({ loading: true, linkTrees: [] });
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
    a.unmount();
    render({ linkTrees: [] });
    expect(screen.getByText("Tidak ada link tree.")).toBeInTheDocument();
  });
  it("pencarian & filter milik saya", async () => {
    render();
    await fireEvent.input(screen.getByPlaceholderText("Cari judul..."), { target: { value: "bet" } });
    expect(screen.queryByText("Alpha")).toBeNull();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    await fireEvent.input(screen.getByPlaceholderText("Cari judul..."), { target: { value: "" } });
    await fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.queryByText("Beta")).toBeNull();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });
  it("hapus satu: batal, sukses, gagal", async () => {
    render();
    showConfirmDialog.mockResolvedValueOnce(false);
    await fireEvent.click(screen.getByLabelText("Hapus Alpha"));
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(removeLinkTree).not.toHaveBeenCalled();

    showConfirmDialog.mockResolvedValueOnce(true);
    removeLinkTree.mockResolvedValueOnce({ ok: true });
    await fireEvent.click(screen.getByLabelText("Hapus Alpha"));
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith("Link tree dihapus"));

    showConfirmDialog.mockResolvedValueOnce(true);
    removeLinkTree.mockResolvedValueOnce({ ok: false, message: "err" });
    await fireEvent.click(screen.getByLabelText("Hapus Alpha"));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err"));
  });
  it("hapus semua: batal, sukses, gagal", async () => {
    render();
    showConfirmDialog.mockResolvedValueOnce(false);
    await fireEvent.click(screen.getByText("Hapus Semua"));
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(removeAllLinkTrees).not.toHaveBeenCalled();

    showConfirmDialog.mockResolvedValueOnce(true);
    removeAllLinkTrees.mockResolvedValueOnce({ ok: true });
    await fireEvent.click(screen.getByText("Hapus Semua"));
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith("Semua link tree dihapus"));

    showConfirmDialog.mockResolvedValueOnce(true);
    removeAllLinkTrees.mockResolvedValueOnce({ ok: false, message: "err2" });
    await fireEvent.click(screen.getByText("Hapus Semua"));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err2"));
  });
  it("membuka dan menutup modal tambah", async () => {
    render();
    await fireEvent.click(screen.getByText("Tambah"));
    expect(screen.getByText("Tambah Link Tree")).toBeInTheDocument();
    await fireEvent.click(screen.getByText("Batal"));
    expect(screen.queryByText("Tambah Link Tree")).toBeNull();
  });
  it("tanpa profil: tidak ada item milik sendiri", async () => {
    render({ profile: null });
    expect(screen.queryByLabelText("Hapus Alpha")).toBeNull();
    await fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByText("Tidak ada link tree.")).toBeInTheDocument();
  });
  it("memperbarui tampilan saat store berubah", async () => {
    render();
    linkTrees.set(data.map((d) => ({ ...d, title: d.title + "!" })));
    await tick();
    expect(screen.getByText("Alpha!")).toBeInTheDocument();
    linkTrees.set(data.map((d) => ({ ...d, description: "baru" })));
    await tick();
    expect(screen.getAllByText("baru")).toHaveLength(3);
  });
  it("data tanpa judul/tipe/deskripsi tetap dirender", () => {
    render({ linkTrees: [{ id: 4, user_id: 1 }] });
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
