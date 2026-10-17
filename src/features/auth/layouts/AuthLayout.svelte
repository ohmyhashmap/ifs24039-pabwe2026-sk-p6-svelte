<script>
  import { Link2 } from "lucide-svelte";
  let { children } = $props();
</script>

<main class="min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-white rounded-2xl shadow p-8">
    <div class="flex flex-col items-center text-center mb-6">
      <Link2 class="w-10 h-10 text-indigo-600" />
      <h1 class="text-2xl font-extrabold mt-2">Delcom Link Tree</h1>
      <p class="text-sm text-slate-600">Kumpulkan dan bagikan semua tautan pentingmu dalam satu tempat.</p>
    </div>
    {@render children()}
  </div>
</main>
