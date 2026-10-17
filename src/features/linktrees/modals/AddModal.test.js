import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
vi.mock("../states/linkTreesStore.js", async (orig) => ({ ...(await orig()), addLinkTree: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showErrorDialog: vi.fn() }));
import { addLinkTree } from "../states/linkTreesStore.js";
import { showErrorDialog } from "../../../helpers/toolsHelper.js";
import { renderWithProviders } from "../../../test-utils.js";
import AddModal from "./AddModal.svelte";

async function submit() {
  await fireEvent.input(screen.getByPlaceholderText("Judul"), { target: { value: "T" } });
  await fireEvent.input(screen.getByPlaceholderText("Deskripsi"), { target: { value: "D" } });
  await fireEvent.change(screen.getByRole("combobox"), { target: { value: "private" } });
  await fireEvent.submit(screen.getByPlaceholderText("Judul").closest("form"));
}

describe("AddModal", () => {
  beforeEach(() => vi.clearAllMocks());
  it("sukses menutup modal", async () => {
    addLinkTree.mockResolvedValue({ ok: true });
    const onclose = vi.fn();
    renderWithProviders(AddModal, { props: { onclose } });
    await submit();
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(addLinkTree).toHaveBeenCalledWith({ title: "T", description: "D", type: "private" });
  });
  it("gagal menampilkan error", async () => {
    addLinkTree.mockResolvedValue({ ok: false, message: "x" });
    const onclose = vi.fn();
    renderWithProviders(AddModal, { props: { onclose } });
    await submit();
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("x"));
    expect(onclose).not.toHaveBeenCalled();
  });
  it("tombol Batal & status menyimpan", async () => {
    const onclose = vi.fn();
    renderWithProviders(AddModal, { props: { onclose }, stores: { flags: { add: true } } });
    expect(screen.getByText("Menyimpan...")).toBeDisabled();
    await fireEvent.click(screen.getByText("Batal"));
    expect(onclose).toHaveBeenCalled();
  });
});
