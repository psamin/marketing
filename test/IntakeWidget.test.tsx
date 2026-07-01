import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "@/lib/i18n";
import IntakeWidget from "@/components/IntakeWidget";

function renderWidget() {
  return render(
    <LanguageProvider>
      <IntakeWidget />
    </LanguageProvider>,
  );
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
});

describe("IntakeWidget", () => {
  it("opens on step 1 with the first question", () => {
    renderWidget();
    expect(screen.getByText("What happened?")).toBeInTheDocument();
  });

  it("blocks advancing until an accident type is chosen", () => {
    renderWidget();
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("What happened?")).toBeInTheDocument(); // still step 1
  });

  it("marks a chosen accident type as pressed", () => {
    renderWidget();
    const choice = screen.getByRole("button", { name: "Car or truck accident" });
    fireEvent.click(choice);
    expect(choice).toHaveAttribute("aria-pressed", "true");
  });

  it("keeps submit disabled until the TCPA consent box is checked", () => {
    renderWidget();
    // step 1 → pick a type → continue
    fireEvent.click(screen.getByRole("button", { name: "Car or truck accident" }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    // step 2 → continue (no required fields)
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    // step 3 → fill required contact fields
    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Alex" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "5551234567" } });

    const submit = screen.getByRole("button", { name: /get my free review/i });
    expect(submit).toBeDisabled(); // consent unchecked → blocked

    fireEvent.click(screen.getByRole("checkbox"));
    expect(submit).toBeEnabled(); // consent checked → allowed
  });
});
