<script>
  let { title, onclose, onsubmit, busy = false, children } = $props();
</script>

<div class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
  <form {onsubmit} class="bg-white rounded-2xl p-6 w-full max-w-md space-y-3">
    <h2 class="text-lg font-bold">{title}</h2>
    {@render children()}
    <div class="flex justify-end gap-2 pt-2">
      <button type="button" onclick={onclose} class="px-4 py-2 rounded-lg border">Batal</button>
      <button disabled={busy} class="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">
        {busy ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  </form>
</div>
