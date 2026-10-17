import { writable } from "svelte/store";

export function useInput(initial = "") {
  const value = writable(initial);
  return { value, reset: () => value.set(initial) };
}
