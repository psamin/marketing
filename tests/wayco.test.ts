import { describe, it, expect } from "vitest";
import { forwardToWayco } from "@/lib/wayco";
import { normalizeLead } from "@/lib/leads";
import { widgetToRawIntake } from "@/lib/intake";

const NOW = new Date("2026-06-30T12:00:00Z");

describe("forwardToWayco (mock mode)", () => {
  it("returns a mock result when WAYCO_INTAKE_URL is unset", async () => {
    const lead = normalizeLead(
      widgetToRawIntake({ type: "auto_truck", firstName: "A", phone: "1", consent: true }),
      { mode: "live", now: NOW }
    );
    const r = await forwardToWayco(lead);
    expect(r.provider).toBe("wayco");
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("mock");
  });
});
