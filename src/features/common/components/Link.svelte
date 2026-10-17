<script>
  import { navigate } from "../../../router.js";
  let { href, class: cls = "", children } = $props();
  function go(e) {
    e.preventDefault();
    navigate(href);
  }
</script>

<a {href} class={cls} onclick={go}>{@render children()}</a>
