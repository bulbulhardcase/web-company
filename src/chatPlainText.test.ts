import { describe, expect, it } from "vitest";
import { stripMarkdownForChat } from "./chatPlainText";

describe("stripMarkdownForChat", () => {
  it("removes bold asterisks", () => {
    expect(stripMarkdownForChat("Hello **world**")).toBe("Hello world");
  });

  it("preserves plain text", () => {
    expect(stripMarkdownForChat("Line one\n\nLine two")).toBe("Line one\n\nLine two");
  });
});
