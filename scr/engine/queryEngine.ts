import { FilterCondition, DataRow } from "../models/types";

export function executeQuery(data: DataRow[], query: string): DataRow[] {
  const [projectPart, filterPart] = query.split("FILTER");

  // Parse projections (e.g., PROJECTcol1,col2)
  const projections = parseProjection(projectPart);

  // Parse filter condition (e.g., col3 > "value")
  const filterCondition = filterPart ? parseFilter(filterPart.trim()) : null;

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

function parseFilter(filterPart: string): FilterCondition {
  const [column, operatorValue] = filterPart.split(">");
  const operator = ">";
  const value = operatorValue.trim().replace(/^"|"$/g, ""); // Remove quotes around string values
  return {
    column: column.trim(),
    value: isNaN(Number(value)) ? value : Number(value),
    operator,
  };
}

function evaluateFilter(item: DataRow, filter: FilterCondition): boolean {
  const itemValue = item[filter.column];

  if (filter.operator === ">") {
    return itemValue > filter.value;
  }

  return false;
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
