import { it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { snippet } from "../../../test-utils.js";
import AuthLayout from "./AuthLayout.svelte";

it("AuthLayout menampilkan identitas & anak", () => {
  render(AuthLayout, { props: { children: snippet("<p>konten</p>") } });
  expect(screen.getByText("Delcom Link Tree")).toBeInTheDocument();
  expect(screen.getByText(/Kumpulkan dan bagikan/)).toBeInTheDocument();
  expect(screen.getByText("konten")).toBeInTheDocument();
});
