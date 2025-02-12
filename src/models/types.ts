export interface FilterCondition {
  column: string;
  value: string | number;
  operator: string;
}

export type DataRow = Record<string, string | number>;

export interface Person {
  id: number;
  name: string;
  age: 12 | 13;
  city: string;
}

export type ColumnTypeMap = Record<string, "string" | "number">;

/**
 * DataRow example
 * {
 *   columnName: "someValue",
 *   anotherColumnName: "otherValue",
 *   numberColumn: 42
 * }
 */
