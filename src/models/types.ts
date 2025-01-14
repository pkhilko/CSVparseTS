export interface FilterCondition {
  column: string;
  value: string | number;
  operator: string;
}

export type DataRow = Record<string, string | number>;
