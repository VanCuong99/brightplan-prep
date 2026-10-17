import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, it } from "vitest";
import { QueryLab } from "./QueryLab";
it("surfaces a simulated failure and succeeds on retry", async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  render(
    <QueryClientProvider client={client}>
      <QueryLab />
    </QueryClientProvider>,
  );
  expect(screen.getByRole("status")).toHaveTextContent("Loading people");
  expect(
    await screen.findByRole("alert", {}, { timeout: 2000 }),
  ).toHaveTextContent("Simulated connection error");
  await userEvent.click(screen.getByRole("button", { name: "Retry loading" }));
  expect(
    await screen.findByText("Alex Morgan", {}, { timeout: 2000 }),
  ).toBeInTheDocument();
  client.clear();
});
