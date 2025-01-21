import { describe, it, expect } from "vitest";
import { parseCSV } from "../utils/csvParser";

describe("CSV Parser", () => {
  it("parses a simple CSV string into an array of arrays", () => {
    const csvFile = `./src/testCSV.csv`;
    const result = parseCSV(csvFile);

    expect(result).toEqual([
      ["name", "age", "city"],
      ["Alice", "25", "New York"],
      ["Bob", "30", "Los Angeles"],
    ]);
  });
});
