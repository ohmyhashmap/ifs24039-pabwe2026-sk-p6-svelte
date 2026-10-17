import { it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import { get } from "svelte/store";
import { currentPath } from "../../../router.js";
import { snippet } from "../../../test-utils.js";
import Link from "./Link.svelte";

it("Link menavigasi tanpa reload", async () => {
  render(Link, { props: { href: "/users", class: "x", children: snippet("<span>Pengguna</span>") } });
  const a = screen.getByText("Pengguna").closest("a");
  expect(a).toHaveAttribute("href", "/users");
  await fireEvent.click(a);
  expect(get(currentPath)).toBe("/users");
});
it("Link tanpa class", () => {
  render(Link, { props: { href: "/", children: snippet("<span>Home</span>") } });
  expect(screen.getByText("Home")).toBeInTheDocument();
});
