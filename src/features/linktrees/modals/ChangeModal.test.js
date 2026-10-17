import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
vi.mock("../states/linkTreesStore.js", async (orig) => ({ ...(await orig()), changeLinkTree: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showErrorDialog: vi.fn() }));
import { changeLinkTree } from "../states/linkTreesStore.js";
import { showErrorDialog } from "../../../helpers/toolsHelper.js";
import { renderWithProviders } from "../../../test-utils.js";
import ChangeModal from "./ChangeModal.svelte";

const lt = { id: 5, title: "Lama", description: "Desk", type: "public" };

describe("ChangeModal", () => {
  beforeEach(() => vi.clearAllMocks());
  it("terisi data lama & sukses", async () => {
    changeLinkTree.mockResolvedValue({ ok: true });
    const onclose = vi.fn();
    renderWithProviders(ChangeModal, { props: { linkTree: lt, onclose } });
    const title = screen.getByDisplayValue("Lama");
    await fireEvent.input(title, { target: { value: "Baru" } });
    await fireEvent.submit(title.closest("form"));
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(changeLinkTree).toHaveBeenCalledWith(5, { title: "Baru", description: "Desk", type: "public" });
  });
  it("gagal", async () => {
    changeLinkTree.mockResolvedValue({ ok: false, message: "err" });
    renderWithProviders(ChangeModal, { props: { linkTree: lt, onclose: vi.fn() } });
    await fireEvent.submit(screen.getByDisplayValue("Lama").closest("form"));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err"));
  });
});
