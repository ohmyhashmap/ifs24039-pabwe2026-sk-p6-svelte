import { it, expect } from "vitest";
import { get } from "svelte/store";
import { useInput } from "./useInput.js";

it("useInput: nilai awal, ubah, reset", () => {
  const { value, reset } = useInput("a");
  expect(get(value)).toBe("a");
  value.set("b");
  expect(get(value)).toBe("b");
  reset();
  expect(get(value)).toBe("a");
  expect(get(useInput().value)).toBe("");
});
