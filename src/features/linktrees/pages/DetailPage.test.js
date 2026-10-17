import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
vi.mock("../states/linkTreesStore.js", async (orig) => ({ ...(await orig()), fetchLinkTree: vi.fn(), removeItem: vi.fn(), changeCover: vi.fn(), addItem: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", async (orig) => ({
  ...(await orig()), showConfirmDialog: vi.fn(), showErrorDialog: vi.fn(),
}));
import { fetchLinkTree, removeItem, changeCover, addItem } from "../states/linkTreesStore.js";
import { showConfirmDialog, showErrorDialog } from "../../../helpers/toolsHelper.js";
import { linkTree } from "../states/linkTreesStore.js";
import { tick } from "svelte";
import { renderWithProviders } from "../../../test-utils.js";
import DetailPage from "./DetailPage.svelte";

const tree = {
  id: 7, user_id: 1, title: "Tree", description: "Deskripsi", type: "public", cover: "http://x/c.png",
  items: [{ id: 11, title: "GitHub", url: "https://github.com" }],
};
const render = (stores = {}) =>
  renderWithProviders(DetailPage, { props: { params: { linkTreeId: "7" } }, stores: { profile: { id: 1 }, linkTree: tree, ...stores } });

describe("DetailPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("pemilik: detail, item, dan tombol aksi", () => {
    render();
    expect(fetchLinkTree).toHaveBeenCalledWith("7");
    expect(screen.getByText("Tree")).toBeInTheDocument();
    expect(screen.getByAltText("Tree")).toBeInTheDocument();
    expect(screen.getByText("GitHub").closest("a")).toHaveAttribute("href", "https://github.com");
    expect(screen.getByText("Sampul")).toBeInTheDocument();
  });
  it("bukan pemilik: tanpa tombol aksi, tanpa cover, tanpa items", () => {
    render({ profile: { id: 99 }, linkTree: { ...tree, cover: null, items: undefined } });
    expect(screen.queryByText("Sampul")).toBeNull();
    expect(screen.queryByAltText("Tree")).toBeNull();
    expect(screen.getByText("Belum ada tautan.")).toBeInTheDocument();
  });
  it("memuat & tidak ditemukan", () => {
    const a = render({ loading: true });
    expect(screen.getByText("Memuat...")).toBeInTheDocument();
    a.unmount();
    render({ linkTree: null });
    expect(screen.getByText(/tidak ditemukan/)).toBeInTheDocument();
  });
  it("membuka & menutup modal ubah, sampul, dan item", async () => {
    render();
    await fireEvent.click(screen.getByText("Ubah"));
    expect(screen.getByText("Ubah Link Tree")).toBeInTheDocument();
    await fireEvent.click(screen.getByText("Batal"));
    await fireEvent.click(screen.getByText("Sampul"));
    expect(screen.getByText("Ubah Sampul")).toBeInTheDocument();
    await fireEvent.click(screen.getByText("Batal"));
    await fireEvent.click(screen.getByText("Tambah"));
    expect(screen.getByText("Tambah Tautan", { selector: "h2" })).toBeInTheDocument();
    await fireEvent.click(screen.getByText("Batal"));
    await fireEvent.click(screen.getByLabelText("Ubah GitHub"));
    expect(screen.getByDisplayValue("GitHub")).toBeInTheDocument();
    await fireEvent.click(screen.getByText("Batal"));
    expect(screen.queryByDisplayValue("GitHub")).toBeNull();
  });
  it("hapus item: batal, sukses, gagal", async () => {
    render();
    showConfirmDialog.mockResolvedValueOnce(false);
    await fireEvent.click(screen.getByLabelText("Hapus GitHub"));
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(removeItem).not.toHaveBeenCalled();

    showConfirmDialog.mockResolvedValueOnce(true);
    removeItem.mockResolvedValueOnce({ ok: true });
    await fireEvent.click(screen.getByLabelText("Hapus GitHub"));
    await waitFor(() => expect(removeItem).toHaveBeenCalledWith(7, 11));
    expect(showErrorDialog).not.toHaveBeenCalled();

    showConfirmDialog.mockResolvedValueOnce(true);
    removeItem.mockResolvedValueOnce({ ok: false, message: "err" });
    await fireEvent.click(screen.getByLabelText("Hapus GitHub"));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err"));
  });
  it("bukan pemilik: item tampil tanpa tombol ubah/hapus", () => {
    render({ profile: { id: 99 } });
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.queryByLabelText("Ubah GitHub")).toBeNull();
    expect(screen.queryByLabelText("Hapus GitHub")).toBeNull();
  });
  it("tanpa profil dianggap bukan pemilik", () => {
    render({ profile: null });
    expect(screen.queryByText("Sampul")).toBeNull();
  });
  it("memperbarui item saat store berubah", async () => {
    render();
    const item = tree.items[0];
    linkTree.set({ ...tree, items: [{ ...item, url: "https://baru.com" }] });
    await tick();
    expect(screen.getByText("GitHub").closest("a")).toHaveAttribute("href", "https://baru.com");
    linkTree.set({ ...tree, items: [{ ...item, url: "https://baru.com", title: "GL" }] });
    await tick();
    expect(screen.getByLabelText("Ubah GL")).toBeInTheDocument();
  });
  it("submit dari modal sampul dan item membaca data link tree", async () => {
    changeCover.mockResolvedValue({ ok: true });
    addItem.mockResolvedValue({ ok: true });
    const { container } = render();
    await fireEvent.click(screen.getByText("Sampul"));
    const file = new File(["x"], "c.png");
    await fireEvent.change(container.querySelector("input[type=file]"), { target: { files: [file] } });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(changeCover).toHaveBeenCalledWith(7, file));
    await waitFor(() => expect(screen.queryByText("Ubah Sampul")).toBeNull());

    await fireEvent.click(screen.getByText("Tambah"));
    await fireEvent.submit(screen.getByPlaceholderText("Judul tautan").closest("form"));
    await waitFor(() => expect(addItem).toHaveBeenCalledWith(7, { title: "", url: "" }));
  });
  it("item tanpa judul tetap dirender", () => {
    render({ linkTree: { ...tree, items: [{ id: 12, url: "https://x.com" }] } });
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
