import { FilterCondition, DataRow } from "../models/types";

export function executeQuery(data: DataRow[], query: string): DataRow[] {
  const [projectPart, filterPart] = query.split("FILTER");

  // Parse projections (e.g., PROJECTcol1,col2)
  const projections = parseProjection(projectPart);

  // Parse filter condition (e.g., col3 > "value")
  const filterCondition = filterPart
    ? parseFilter(filterPart.trim(), data)
    : null;

  // Filter the data if filterCondition exists
  let filteredData = filterCondition
    ? data.filter((item) => evaluateFilter(item, filterCondition))
    : data;

  // Project the data to include only selected columns
  return filteredData.map((item) => projectData(item, projections));
}

function parseProjection(projectionPart: string): string[] {
  return projectionPart
    .replace("PROJECT", "")
    .split(",")
    .map((col) => col.trim());
}

function parseFilter(filterPart: string, data: DataRow[]): FilterCondition {
  // Identify operator and split accordingly
  const operatorMatch = filterPart.match(/(>=|<=|!=|>|<|=)/);

  if (!operatorMatch) {
    throw new Error("Invalid filter condition");
  }

  const operator = operatorMatch[0];
  const [column, valuePart] = filterPart.split(operator);
  const value = valuePart.trim().replace(/^"|"$/g, ""); // Remove quotes

  // column,csv data

  if (!data[0].hasOwnProperty(column.trim())) {
    throw new Error("Invalid filter condition");
  }

  // const data = [{name:"filip",age:12},{name:"te",age:123}]
  // const column = "name"

  return {
    column: column.trim(),
    value: isNaN(Number(value)) ? value : Number(value), // Convert numeric values
    operator,
  };
}

function evaluateFilter(item: DataRow, filter: FilterCondition): boolean {
  const itemValue = item[filter.column];

  switch (filter.operator) {
    case ">":
      return itemValue > filter.value;
    case "<":
      return itemValue < filter.value;
    case "=":
      return itemValue == filter.value; // Loose equality
    case "!=":
      return itemValue != filter.value; // Not equal
    case ">=":
      return itemValue >= filter.value;
    case "<=":
      return itemValue <= filter.value;
    default:
      throw new Error(`Unsupported operator: ${filter.operator}`);
  }
}

function projectData(item: DataRow, projections: string[]): DataRow {
  const projectedData: DataRow = {};
  projections.forEach((col) => {
    if (col in item) {
      projectedData[col] = item[col];
    }
  });
  return projectedData;
}
