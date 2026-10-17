import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
vi.mock("../states/linkTreesStore.js", async (orig) => ({ ...(await orig()), addItem: vi.fn(), changeItem: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showErrorDialog: vi.fn() }));
import { addItem, changeItem } from "../states/linkTreesStore.js";
import { showErrorDialog } from "../../../helpers/toolsHelper.js";
import { renderWithProviders } from "../../../test-utils.js";
import ItemModal from "./ItemModal.svelte";

describe("ItemModal", () => {
  beforeEach(() => vi.clearAllMocks());
  it("mode tambah", async () => {
    addItem.mockResolvedValue({ ok: true });
    const onclose = vi.fn();
    renderWithProviders(ItemModal, { props: { linkTreeId: 1, onclose } });
    expect(screen.getByText("Tambah Tautan", { selector: "h2" })).toBeInTheDocument();
    await fireEvent.input(screen.getByPlaceholderText("Judul tautan"), { target: { value: "GH" } });
    await fireEvent.input(screen.getByPlaceholderText("https://..."), { target: { value: "https://g.com" } });
    await fireEvent.submit(screen.getByPlaceholderText("Judul tautan").closest("form"));
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(addItem).toHaveBeenCalledWith(1, { title: "GH", url: "https://g.com" });
  });
  it("mode ubah", async () => {
    changeItem.mockResolvedValue({ ok: true });
    const onclose = vi.fn();
    renderWithProviders(ItemModal, { props: { linkTreeId: 1, item: { id: 9, title: "A", url: "https://a.com" }, onclose } });
    expect(screen.getByText("Ubah Tautan")).toBeInTheDocument();
    await fireEvent.submit(screen.getByDisplayValue("A").closest("form"));
    await waitFor(() => expect(changeItem).toHaveBeenCalledWith(1, 9, { title: "A", url: "https://a.com" }));
    expect(onclose).toHaveBeenCalled();
  });
  it("gagal", async () => {
    addItem.mockResolvedValue({ ok: false, message: "err" });
    renderWithProviders(ItemModal, { props: { linkTreeId: 1, onclose: vi.fn() } });
    await fireEvent.submit(screen.getByPlaceholderText("Judul tautan").closest("form"));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err"));
  });
});
