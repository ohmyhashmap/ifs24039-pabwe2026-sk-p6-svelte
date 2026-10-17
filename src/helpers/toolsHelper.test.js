import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));
import Swal from "sweetalert2";
import { showSuccessDialog, showErrorDialog, showWarningDialog, showConfirmDialog, formatDate } from "./toolsHelper.js";

beforeEach(() => vi.clearAllMocks());

describe("toolsHelper", () => {
  it("dialog sukses/error/peringatan", async () => {
    await showSuccessDialog("a");
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: "success", text: "a" }));
    await showErrorDialog("b");
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: "error", text: "b" }));
    await showWarningDialog("c");
    expect(Swal.fire).toHaveBeenLastCalledWith(expect.objectContaining({ icon: "warning", text: "c" }));
  });
  it("konfirmasi", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("x")).toBe(true);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("x")).toBe(false);
  });
  it("formatDate", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate("2026-01-15T00:00:00Z")).toMatch(/2026/);
  });
});
