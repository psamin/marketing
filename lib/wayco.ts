import { config } from "./config";
import { Lead } from "./leads";

export interface IntegrationResult {
  provider: string;
  ok: boolean;
  mode: "live" | "mock";
  reference?: string;
  detail?: string;
}

/**
 * Forward a normalized lead to the Wayco intake platform. When WAYCO_INTAKE_URL
 * is unset it runs in mock mode (logged) so the pipeline completes in dev.
 * Never throws — returns a status the caller reports back.
 */
export async function forwardToWayco(lead: Lead): Promise<IntegrationResult> {
  const { url, apiKey } = config.wayco;

  if (!url) {
    console.log("[wayco] mock mode — set WAYCO_INTAKE_URL to deliver leads live", {
      leadId: lead.leadId,
      tier: lead.qualification.tier,
      score: lead.qualification.score,
    });
    return { provider: "wayco", ok: true, mode: "mock", reference: `mock-wayco-${lead.leadId}` };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}`, "x-api-key": apiKey } : {}),
      },
      body: JSON.stringify(lead),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        provider: "wayco",
        ok: false,
        mode: "live",
        detail: `HTTP ${res.status}: ${body.slice(0, 300)}`,
      };
    }
    let reference: string | undefined;
    try {
      const data = (await res.json()) as { id?: string; leadId?: string };
      reference = data?.id ?? data?.leadId;
    } catch {
      // body may be empty — that's fine
    }
    return { provider: "wayco", ok: true, mode: "live", reference };
  } catch (err) {
    return { provider: "wayco", ok: false, mode: "live", detail: (err as Error).message };
  }
}
