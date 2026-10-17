import { it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import NotFoundPage from "./NotFoundPage.svelte";

it("menampilkan 404", () => {
  render(NotFoundPage);
  expect(screen.getByText("404")).toBeInTheDocument();
  expect(screen.getByText("Kembali ke beranda")).toHaveAttribute("href", "/");
});
