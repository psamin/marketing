import { promises as fs } from "fs";
import path from "path";
import { Lead } from "./leads";

// Best-effort local persistence for dev/demo. Contains PII, so data/*.jsonl is
// gitignored. In serverless/read-only environments the writes fail silently
// (caught) — a real datastore is the production path (see TODOS.md).

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "leads.jsonl");

export async function persistLead(lead: Lead): Promise<boolean> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(FILE, JSON.stringify(lead) + "\n", "utf8");
    return true;
  } catch (err) {
    console.warn("[store] could not persist lead locally:", (err as Error).message);
    return false;
  }
}

export async function readLeads(limit = 200): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const lines = raw.split("\n").filter((l) => l.trim());
    const leads = lines
      .map((l) => {
        try {
          return JSON.parse(l) as Lead;
        } catch {
          return null;
        }
      })
      .filter((l): l is Lead => l !== null);
    return leads.slice(-limit).reverse();
  } catch {
    return [];
  }
}
