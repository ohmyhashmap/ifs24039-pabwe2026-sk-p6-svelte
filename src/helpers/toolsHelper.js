// SweetAlert2 dimuat lazy supaya tidak membebani bundle awal halaman.
const swal = async () => (await import("sweetalert2")).default;

export const showSuccessDialog = async (text) => (await swal()).fire({ icon: "success", title: "Berhasil", text });
export const showErrorDialog = async (text) => (await swal()).fire({ icon: "error", title: "Gagal", text });
export const showWarningDialog = async (text) => (await swal()).fire({ icon: "warning", title: "Peringatan", text });
export async function showConfirmDialog(text) {
  const r = await (await swal()).fire({
    icon: "question", title: "Konfirmasi", text,
    showCancelButton: true, confirmButtonText: "Ya", cancelButtonText: "Batal",
  });
  return r.isConfirmed;
}

export function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
