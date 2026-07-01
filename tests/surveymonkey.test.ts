import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";
import {
  flattenResponse,
  buildRawIntake,
  verifyWebhookSignature,
  type SMResponseDetails,
} from "@/lib/surveymonkey";

const details: SMResponseDetails = {
  id: "r1",
  survey_id: "s1",
  collector_id: "c1",
  pages: [
    {
      id: "p1",
      questions: [
        { id: "q_first", answers: [{ text: "Jordan" }] },
        { id: "q_email", answers: [{ text: "jordan@example.com" }] },
        { id: "q_phone", answers: [{ text: "(312) 555-0142" }] },
        { id: "q_choice", answers: [{ simple_text: "Yes" }] },
        { id: "q_cid", answers: [{ choice_id: "12345" }] },
      ],
    },
  ],
};

describe("flattenResponse", () => {
  it("flattens text, simple_text, and choice_id answers", () => {
    const { byQuestion, allText } = flattenResponse(details);
    expect(byQuestion.q_first).toEqual(["Jordan"]);
    expect(byQuestion.q_choice).toEqual(["Yes"]);
    expect(byQuestion.q_cid).toEqual(["12345"]);
    expect(allText).toContain("jordan@example.com");
  });
});

describe("buildRawIntake", () => {
  it("maps via an explicit field->question map", () => {
    const flat = flattenResponse(details);
    const { raw, mappingComplete } = buildRawIntake(flat, {
      firstName: "q_first",
      email: "q_email",
      phone: "q_phone",
    });
    expect(raw.firstName).toBe("Jordan");
    expect(raw.email).toBe("jordan@example.com");
    expect(raw.phone).toBe("(312) 555-0142");
    expect(mappingComplete).toBe(true);
  });

  it("heuristically finds email/phone with no map and records unmapped answers", () => {
    const flat = flattenResponse(details);
    const { raw, unmapped, mappingComplete } = buildRawIntake(flat, {});
    expect(raw.email).toBe("jordan@example.com");
    expect(raw.phone).toContain("312");
    expect(mappingComplete).toBe(false);
    expect(Object.keys(unmapped)).toContain("q_first");
  });
});

describe("verifyWebhookSignature", () => {
  const body = '{"a":1}';
  const secret = "shh";
  const good = createHmac("sha256", secret).update(body, "utf8").digest("hex");

  it("returns null when no secret is configured", () => {
    expect(verifyWebhookSignature(body, good, "")).toBeNull();
  });
  it("returns false when the signature header is missing", () => {
    expect(verifyWebhookSignature(body, null, secret)).toBe(false);
  });
  it("returns true for a valid signature", () => {
    expect(verifyWebhookSignature(body, good, secret)).toBe(true);
  });
  it("returns false for a wrong signature", () => {
    expect(verifyWebhookSignature(body, "deadbeef", secret)).toBe(false);
  });
});
