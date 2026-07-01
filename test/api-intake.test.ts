// @vitest-environment node
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/intake/route";

describe("POST /api/intake", () => {
  it("accepts a valid lead and returns ok:true", async () => {
    const req = new Request("http://localhost/api/intake", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "Car or truck accident", firstName: "Test", phone: "5551234567" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it("does not throw on malformed JSON", async () => {
    const req = new Request("http://localhost/api/intake", { method: "POST", body: "not-json" });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
