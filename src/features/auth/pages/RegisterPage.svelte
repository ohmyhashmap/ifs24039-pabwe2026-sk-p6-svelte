<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { register } from "../states/authStore.js";
  import { navigate } from "../../../router.js";
  import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";
  import Link from "../../common/components/Link.svelte";

  const { value: name } = useInput();
  const { value: email } = useInput();
  const { value: password } = useInput();
  let busy = $state(false);

  async function submit(e) {
    e.preventDefault();
    busy = true;
    const r = await register($name, $email, $password);
    busy = false;
    if (r.ok) {
      await showSuccessDialog("Akun dibuat, silakan masuk.");
      navigate("/auth/login");
    } else showErrorDialog(r.message);
  }
</script>

<form onsubmit={submit} class="space-y-4">
  <h2 class="text-xl font-bold text-center">Daftar</h2>
  <div>
    <label for="register-name-input" class="block text-sm font-medium text-slate-700 mb-1">Nama</label>
    <input id="register-name-input" name="name" autocomplete="name" placeholder="Nama" required bind:value={$name} class="w-full border rounded-lg px-3 py-2" />
  </div>
  <div>
    <label for="register-email-input" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
    <input id="register-email-input" name="email" type="email" autocomplete="email" placeholder="Email" required bind:value={$email} class="w-full border rounded-lg px-3 py-2" />
  </div>
  <div>
    <label for="register-password-input" class="block text-sm font-medium text-slate-700 mb-1">Kata sandi</label>
    <input id="register-password-input" name="password" type="password" autocomplete="new-password" placeholder="Kata sandi" required bind:value={$password} class="w-full border rounded-lg px-3 py-2" />
  </div>
  <button id="register-submit-button" type="submit" disabled={busy} class="w-full bg-indigo-600 text-white rounded-lg py-2 font-semibold">
    {busy ? "Memproses..." : "Daftar"}
  </button>
  <p class="text-sm text-center">Sudah punya akun? <Link href="/auth/login" class="text-indigo-600 font-semibold">Masuk</Link></p>
</form>
