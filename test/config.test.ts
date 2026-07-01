import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { FIRM, LEGAL } from "@/lib/config";

describe("firm config", () => {
  it("intake email is iqbol@wayco.ai", () => {
    expect(FIRM.email).toBe("iqbol@wayco.ai");
  });

  it("phone number + tel href are well-formed", () => {
    expect(FIRM.phone).toMatch(/^\(\d{3}\) \d{3}-\d{4}$/);
    expect(FIRM.phoneHref).toMatch(/^tel:\+1\d{10}$/);
  });
});

describe("legal entity separation", () => {
  it("Wayco is the disclosed non-lawyer tech entity", () => {
    expect(LEGAL.techEntity).toBe("Wayco Inc.");
  });

  it("all firm-identity fields exist (placeholders allowed pre-launch)", () => {
    for (const key of ["firmEntity", "responsibleAttorney", "officeAddress", "admittedStates"] as const) {
      expect(LEGAL[key]).toBeTruthy();
    }
  });
});

describe("language toggle label", () => {
  it("shows the Spanish option as “Español”, not “Spanish”", () => {
    const i18n = readFileSync(resolve(process.cwd(), "lib/i18n.tsx"), "utf8");
    expect(i18n).toContain('es: "Español"');
    expect(i18n).not.toContain('es: "Spanish"');
  });
});
