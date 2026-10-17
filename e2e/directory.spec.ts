import { test, expect } from "@playwright/test";
test("desktop search, empty state and clear work in a real browser", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("listitem")).toHaveCount(5);
  await page
    .getByRole("searchbox", { name: "Search by name" })
    .fill("no-match");
  await expect(
    page.getByRole("heading", { name: "No people found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.getByRole("listitem")).toHaveCount(5);
  await page.screenshot({
    path: "test-results/desktop-wide.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("searchbox")).toBeVisible();
  await page.screenshot({
    path: "test-results/desktop-narrow.png",
    fullPage: true,
  });
});

test("query lab exposes a local simulated error, retry and results", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Async query lab" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Simulated connection error",
  );
  await page.getByRole("button", { name: "Retry loading" }).click();
  await expect(page.getByText("Alex Morgan")).toBeVisible();
});
test("RN web checkpoint filters and clears; this is not native verification", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:8082");
  await expect(page.getByText("Alex Morgan")).toBeVisible();
  await page.getByRole("textbox", { name: "Search by name" }).fill("nobody");
  await expect(page.getByText("No people found")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.getByText("Alex Morgan")).toBeVisible();
  await page.screenshot({
    path: "test-results/rn-web-checkpoint.png",
    fullPage: true,
  });
});
test("Storybook empty state renders independently", async ({ page }) => {
  await page.goto(
    "http://127.0.0.1:6007/iframe.html?id=directory-people--empty&viewMode=story",
  );
  await expect(
    page.getByText("There are no people in this directory yet."),
  ).toBeVisible();
});
