<script>
  import { useInput } from "../../../hooks/useInput.js";
  import { login } from "../states/authStore.js";
  import { navigate } from "../../../router.js";
  import { showErrorDialog } from "../../../helpers/toolsHelper.js";
  import Link from "../../common/components/Link.svelte";

  const { value: email } = useInput();
  const { value: password } = useInput();
  let busy = $state(false);

  async function submit(e) {
    e.preventDefault();
    busy = true;
    const r = await login($email, $password);
    busy = false;
    if (r.ok) navigate("/", { replace: true });
    else showErrorDialog(r.message);
  }
</script>

<form onsubmit={submit} class="space-y-4">
  <h2 class="text-xl font-bold text-center">Masuk</h2>
  <div>
    <label for="login-email-input" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
    <input id="login-email-input" name="email" type="email" autocomplete="email" placeholder="Email" required bind:value={$email} class="w-full border rounded-lg px-3 py-2" />
  </div>
  <div>
    <label for="login-password-input" class="block text-sm font-medium text-slate-700 mb-1">Kata sandi</label>
    <input id="login-password-input" name="password" type="password" autocomplete="current-password" placeholder="Kata sandi" required bind:value={$password} class="w-full border rounded-lg px-3 py-2" />
  </div>
  <button id="login-submit-button" type="submit" disabled={busy} class="w-full bg-indigo-600 text-white rounded-lg py-2 font-semibold">
    {busy ? "Memproses..." : "Masuk"}
  </button>
  <p class="text-sm text-center">Belum punya akun? <Link href="/auth/register" class="text-indigo-600 font-semibold">Daftar</Link></p>
</form>
