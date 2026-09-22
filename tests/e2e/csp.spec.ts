import { expect, test } from "@playwright/test";

/* The built server (playwright.config.ts webServer) must send an ENFORCED
   Content-Security-Policy whose nonce is the one every inline script of that
   same response carries — and a new one per response. The raw HTML is read
   with `request`, not the page: browsers hide a parsed nonce attribute. */

const nonceOf = (policy: string) => /'nonce-([^']+)'/.exec(policy)?.[1];

test("each page is served with its own enforced nonce policy", async ({
  request,
}) => {
  const first = await request.get("/");
  const second = await request.get("/");

  const policy = first.headers()["content-security-policy"] ?? "";
  expect(policy).toContain("script-src 'self' 'nonce-");
  expect(policy).not.toContain("'unsafe-inline' 'nonce");
  expect(policy).toContain("frame-ancestors 'self'");
  expect(first.headers()["x-frame-options"]).toBe("SAMEORIGIN");

  const nonce = nonceOf(policy);
  expect(nonce).toBeTruthy();
  const html = await first.text();
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)];
  expect(inline.length).toBeGreaterThan(0);
  for (const [, attrs] of inline) {
    expect(attrs, "every inline script carries the response's nonce").toContain(
      `nonce="${nonce}"`,
    );
  }

  const nextNonce = nonceOf(second.headers()["content-security-policy"] ?? "");
  expect(nextNonce).toBeTruthy();
  expect(nextNonce).not.toBe(nonce);
});

test("the app renders and hydrates without a single CSP violation", async ({
  page,
}) => {
  const violations: string[] = [];
  page.on("console", (msg) => {
    if (/Content Security Policy|Refused to/i.test(msg.text())) {
      violations.push(msg.text());
    }
  });
  page.on("pageerror", (err) => violations.push(String(err)));

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.goto("/account");
  await page.waitForLoadState("networkidle");

  expect(violations).toEqual([]);
});
