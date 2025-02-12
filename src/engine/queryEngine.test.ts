import { describe, it, expect } from "vitest";
import { executeQuery } from "./queryEngine";
import { getDataTypes } from "..";

describe("Query Engine", () => {
  // Sample Data
  const mockData = [
    { id: 1, name: "Alice", age: 25, city: "New York" },
    { id: 2, name: "Bob", age: 30, city: "Los Angeles" },
    { id: 3, name: "Charlie", age: 35, city: "Chicago" },
  ];

  //npm vs github
  //|| ??
  //array.map() map(array)
  //pnpm∏
  //() => void;

  // const functioName: type = (argument: argumentType) => {
  //
  // }

  // const logMessage: () => void = () => {
  //   console.log("LALA");
  // };
  // const logMessage2 = (arg: number): void => {
  //   console.log(`arg is ${arg}`);
  //   return;
  // };

  it("1 should project specified columns without filtering", () => {
    const result = executeQuery(
      mockData,
      "PROJECT name",
      getDataTypes(mockData) //mockData.getDataTypes()
    );
    console.log("lol?>>>", getDataTypes(mockData));
    //not possible kakto? console.log("lol?2>>>", getDataTypes.firstElement(mockData));
    expect(result).toEqual([
      { name: "Alice" },
      { name: "Bob" },
      { name: "Charlie" },
    ]);
  });

  //fix code
  it("2 should throw an error whem comparing numbers to strings", () => {
    expect(() =>
      executeQuery(
        mockData,
        'PROJECT name FILTER age > "someString"',
        getDataTypes(mockData)
      )
    ).toThrow();
  });

  it("3 should return an empty array for empty data", () => {
    const result = executeQuery([], "PROJECT name", getDataTypes(mockData));
    expect(result).toEqual([]);
  });

  it("4 should return an empty array when filter matches no data", () => {
    const result = executeQuery(
      mockData,
      "PROJECT name FILTER age < 20",
      getDataTypes(mockData)
    );
    expect(result).toEqual([]);
  });

  it("5 should throw an error for unsupported operator", () => {
    expect(() =>
      executeQuery(
        mockData,
        "PROJECT name FILTER age % 30",
        getDataTypes(mockData)
      )
    ).toThrow("Unsopported operator");
  });

  it("6 hould throw an error for missing column in filter", () => {
    expect(() =>
      executeQuery(
        mockData,
        "PROJECT name FILTER nonExistentColumn > 30",
        getDataTypes(mockData)
      )
    ).toThrow(`Column nonExistentColumn does not exist`);
  });

  it("7 should throw an error if query does not start with PROJECT", () => {
    expect(() =>
      executeQuery(mockData, "INVALID name", getDataTypes(mockData))
    ).toThrow("Query must start with the PROJECT keyword");
  });

  //11111

  it("8 should filter data when comparing numbers (>)", () => {
    const query = "PROJECT id,name FILTER age > 30";
    const result = executeQuery(mockData, query, getDataTypes(mockData));
    expect(result).toEqual([{ id: 3, name: "Charlie" }]);
  });

  it("9 should filter data when comparing strings (=)", () => {
    const query = 'PROJECT id,age FILTER city = "Chicago"';
    // columName = "SomeString"
    // columnName > 123
    // columnName = "some string"
    // columnName > "SomeString"
    // TODO: use mapping of column names and value types to fix this
    const result = executeQuery(mockData, query, getDataTypes(mockData));
    expect(result).toEqual([{ id: 3, age: 35 }]);
  });

  it("10 should filter data where age <= 30", () => {
    const query = "PROJECT name,city FILTER age <= 30";
    const result = executeQuery(mockData, query, getDataTypes(mockData));

    expect(result).toEqual([
      { name: "Alice", city: "New York" },
      { name: "Bob", city: "Los Angeles" },
    ]);
  });

  it("11 should return all rows if no filter is specified", () => {
    const query = "PROJECT name,city";
    const result = executeQuery(mockData, query, getDataTypes(mockData));

    expect(result).toEqual([
      { name: "Alice", city: "New York" },
      { name: "Bob", city: "Los Angeles" },
      { name: "Charlie", city: "Chicago" },
    ]);
  });

  it("12 should handle numeric filters correctly", () => {
    const query = "PROJECT name FILTER id = 1";
    const result = executeQuery(mockData, query, getDataTypes(mockData));

    expect(result).toEqual([{ name: "Alice" }]);
  });

  it("13 should handle not equal (!=) filters", () => {
    const query = 'PROJECT name FILTER city != "Los Angeles"';
    const result = executeQuery(mockData, query, getDataTypes(mockData));

    expect(result).toEqual([{ name: "Alice" }, { name: "Charlie" }]);
  });
});
