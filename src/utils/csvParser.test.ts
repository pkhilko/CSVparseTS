import { describe, it, expect, vi } from "vitest";
import { parseCSV } from "../utils/csvParser";
import fs from "fs";

vi.mock("fs");

describe("parseCSV", () => {
  it("should parse a CSV file with name, age, and city", () => {
    fs.readFileSync = vi
      .fn()
      .mockReturnValue("name,age,city\nAlice,25,New York\nBob,30,Los Angeles");
    const result = parseCSV("dummyPath");
    expect(result).toEqual([
      ["name", "age", "city"],
      ["Alice", "25", "New York"],
      ["Bob", "30", "Los Angeles"],
    ]);
  });

  it("should handle quoted values with commas", () => {
    fs.readFileSync = vi
      .fn()
      .mockReturnValue(
        'name,age,city\n"Alice, A",25,"New York, NY"\n"Bob, B",30,"Los Angeles, CA"'
      );
    const result = parseCSV("dummyPath");
    expect(result).toEqual([
      ["name", "age", "city"],
      ["Alice, A", "25", "New York, NY"],
      ["Bob, B", "30", "Los Angeles, CA"],
    ]);
  });

  // it("should handle escaped quotes", () => {
  //   fs.readFileSync = vi
  //     .fn()
  //     .mockReturnValue(
  //       'name,age,city\n"Alice ""A""",25,"New York"\n"Bob ""B""",30,"Los Angeles"'
  //     );
  //   const result = parseCSV("dummyPath");
  //   expect(result).toEqual([
  //     ["name", "age", "city"],
  //     ['Alice "A"', "25", "New York"],
  //     ['Bob "B"', "30", "Los Angeles"],
  //   ]);
  // });

  it("should handle empty rows", () => {
    fs.readFileSync = vi.fn().mockReturnValue("name,age\n\nAlice,30\n");
    const result = parseCSV("dummyPath");
    expect(result).toEqual([["name", "age"], [""], ["Alice", "30"], [""]]);
  });

  it("should trim whitespace", () => {
    fs.readFileSync = vi
      .fn()
      .mockReturnValue('name,age\n " Alice ", 30 \n" Bob ", 25 ');
    const result = parseCSV("dummyPath");
    expect(result).toEqual([
      ["name", "age"],
      ["Alice", "30"],
      ["Bob", "25"],
    ]);
  });

  it("should handle multiple rows", () => {
    fs.readFileSync = vi
      .fn()
      .mockReturnValue("name,age\nAlice,30\nBob,25\nCharlie,35");
    const result = parseCSV("dummyPath");
    expect(result).toEqual([
      ["name", "age"],
      ["Alice", "30"],
      ["Bob", "25"],
      ["Charlie", "35"],
    ]);
  });

  it("should handle malformed CSV gracefully", () => {
    fs.readFileSync = vi.fn().mockReturnValue("name,age\nAlice,30\nBob");
    const result = parseCSV("dummyPath");
    expect(result).toEqual([["name", "age"], ["Alice", "30"], ["Bob"]]);
  });
});

// describe("CSV Parser", () => {
//   it.only("should handle quoted values with commas", () => {
//     const csvFile = `./src/testCSV.csv`;
//     const result = parseCSV(csvFile);
//     expect(result).toEqual([
//       ["name", "age", "city"],
//       ["Alice, A", "25", "New York"],
//       ["Bob, B", "30", "Los Angeles"],
//     ]);
//   });
// });
