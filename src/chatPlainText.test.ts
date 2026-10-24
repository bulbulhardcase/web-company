import { describe, expect, it } from "vitest";
import { stripMarkdownForChat } from "./chatPlainText";

describe("stripMarkdownForChat", () => {
  it("removes bold asterisks", () => {
    expect(stripMarkdownForChat("Hello **world**")).toBe("Hello world");
  });

  it("keeps dimensions and file names intact", () => {
    expect(stripMarkdownForChat("Ukuran 60*56*68.5 cm, file my_case_v2.pdf")).toBe(
      "Ukuran 60*56*68.5 cm, file my_case_v2.pdf",
    );
  });

  it("preserves plain text", () => {
    expect(stripMarkdownForChat("Line one\n\nLine two")).toBe("Line one\n\nLine two");
  });
});
