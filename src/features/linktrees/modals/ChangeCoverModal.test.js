import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
vi.mock("../states/linkTreesStore.js", async (orig) => ({ ...(await orig()), changeCover: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({ showErrorDialog: vi.fn() }));
import { changeCover } from "../states/linkTreesStore.js";
import { showErrorDialog } from "../../../helpers/toolsHelper.js";
import { renderWithProviders } from "../../../test-utils.js";
import ChangeCoverModal from "./ChangeCoverModal.svelte";

describe("ChangeCoverModal", () => {
  beforeEach(() => vi.clearAllMocks());
  it("tanpa berkas menampilkan error", async () => {
    const { container } = renderWithProviders(ChangeCoverModal, { props: { linkTree: { id: 1 }, onclose: vi.fn() } });
    await fireEvent.submit(container.querySelector("form"));
    expect(showErrorDialog).toHaveBeenCalled();
    expect(changeCover).not.toHaveBeenCalled();
  });
  it("sukses & gagal", async () => {
    const onclose = vi.fn();
    const { container } = renderWithProviders(ChangeCoverModal, { props: { linkTree: { id: 1 }, onclose } });
    const file = new File(["x"], "c.png");
    await fireEvent.change(container.querySelector("input[type=file]"), { target: { files: [file] } });

    changeCover.mockResolvedValueOnce({ ok: false, message: "err" });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("err"));

    changeCover.mockResolvedValueOnce({ ok: true });
    await fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(changeCover).toHaveBeenCalledWith(1, file);
  });
});
