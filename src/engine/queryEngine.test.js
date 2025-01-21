import { describe, it, expect } from "vitest";
import { executeQuery } from "./queryEngine";

describe("Query Engine", () => {
  // Sample Data
  const mockData = [
    { id: 1, name: "Alice", age: 25, city: "New York" },
    { id: 2, name: "Bob", age: 30, city: "Los Angeles" },
    { id: 3, name: "Charlie", age: 35, city: "Chicago" },
  ];

  it("should filter data where age > 30", () => {
    const query = "PROJECT id,name FILTER age > 30";
    const result = executeQuery(mockData, query);

    expect(result).toEqual([{ id: 3, name: "Charlie" }]);
  });

  it("should filter data where city = 'Chicago'", () => {
    const query = 'PROJECT id,age FILTER city = "Chicago"';
    const result = executeQuery(mockData, query);

    expect(result).toEqual([{ id: 3, age: 35 }]);
  });

  it("should filter data where age <= 30", () => {
    const query = "PROJECT name,city FILTER age <= 30";
    const result = executeQuery(mockData, query);

    expect(result).toEqual([
      { name: "Alice", city: "New York" },
      { name: "Bob", city: "Los Angeles" },
    ]);
  });

  it("should return all rows if no filter is specified", () => {
    const query = "PROJECT name,city";
    const result = executeQuery(mockData, query);

    expect(result).toEqual([
      { name: "Alice", city: "New York" },
      { name: "Bob", city: "Los Angeles" },
      { name: "Charlie", city: "Chicago" },
    ]);
  });

  it("should throw an error for an invalid filter condition", () => {
    const query = "PROJECT id,name FILTER invalid > 30";

    expect(() => executeQuery(mockData, query)).toThrowError(
      "Invalid filter condition"
    );
  });

  it("should handle numeric filters correctly", () => {
    const query = "PROJECT name FILTER id = 1";
    const result = executeQuery(mockData, query);

    expect(result).toEqual([{ name: "Alice" }]);
  });

  it("should handle not equal (!=) filters", () => {
    const query = 'PROJECT name FILTER city != "Los Angeles"';
    const result = executeQuery(mockData, query);

    expect(result).toEqual([{ name: "Alice" }, { name: "Charlie" }]);
  });
});
