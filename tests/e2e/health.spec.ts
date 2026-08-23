import { expect, test } from "@playwright/test";

// The Docker HEALTHCHECK probes this static asset (no SSR render per probe).
// Guard it so a cleanup never silently removes the file the probe depends on.
test("health asset responds ok", async ({ request }) => {
  const res = await request.get("/health.txt");
  expect(res.status()).toBe(200);
  expect((await res.text()).trim()).toBe("ok");
});
