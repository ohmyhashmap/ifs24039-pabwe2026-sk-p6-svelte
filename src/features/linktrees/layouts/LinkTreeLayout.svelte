<script>
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  let { children } = $props();
</script>

<Navbar />
<div class="flex min-h-[calc(100vh-3.5rem)]">
  <Sidebar />
  <main class="flex-1 p-5 max-w-5xl">{@render children()}</main>
</div>
