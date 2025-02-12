import {
  FilterCondition,
  DataRow,
  Person,
  ColumnTypeMap,
} from "../models/types";

export function executeQuery(
  data: DataRow[],
  query: string,
  dataTypes: ColumnTypeMap
): DataRow[] {
  const [projectPart, filterPart] = query.split("FILTER");

  // Parse projections (e.g., PROJECTcol1,col2)
  const projections = parseProjection(projectPart);

  // Parse filter condition (e.g., col3 > "value")
  const filterCondition = filterPart
    ? parseFilter(filterPart.trim(), data, dataTypes)
    : null;

  // Filter the data if filterCondition exists
  let filteredData = filterCondition
    ? data.filter((item) => evaluateFilter(item, filterCondition))
    : data;

  // Project the data to include only selected columns
  return filteredData.map((item) => projectData(item, projections));
}

function parseProjection(projectionPart: string): string[] {
  if (!projectionPart.trim().startsWith("PROJECT")) {
    throw new Error("Query must start with the PROJECT keyword");
  }
  return projectionPart
    .replace("PROJECT", "")
    .split(",")
    .map((col) => col.trim());
}

function parseFilter(
  filterPart: string,
  data: DataRow[],
  dataTypes: ColumnTypeMap
): FilterCondition {
  // Identify operator and split accordingly
  const operatorMatch = filterPart.match(/(>=|<=|!=|>|<|=)/);

  if (!operatorMatch) {
    throw new Error("Unsopported operator");
  }

  const operator = operatorMatch[0];
  const [column, valuePart] = filterPart.split(operator);
  const value = valuePart.trim().replace(/^"|"$/g, ""); // Remove quotes

  if (!data[0].hasOwnProperty(column.trim())) {
    throw new Error(`Column ${column.trim()} does not exist`);
  }

  // TODO:
  // 1. If column type is number and we're comparing it to value of type string -> show error
  // 2. If column type is string and we're comparing to value of type number -> show error
  // 3. If column type matches the type of comapring value -> no error, continue the code

  // value numericValue
  // "24"  24
  // "Kek" NaN

  //dataTypes:
  // * {
  //  *  name: 'string',
  //  *  age: 'number',
  //  *  city: 'string'
  //  * }
  // typeof(value) <- functions (not a thing)
  // typeof value <- operator (gets type of variable, in runtime)
  // typeof "Chicago" -> 'string
  // typeof 25 -> "number"
  // typeof true -> "boolean"
  //                                           value of type string
  console.log("LOL3>>>>>>", dataTypes);
  if (dataTypes[column.trim()] === "number" && typeof value === "string") {
    console.log("LOL>>>>>>", value);
    console.log("LOL2>>>>>>", data);
    console.log("LOL3>>>>>>", dataTypes);
    // If the value is not a number and not an empty string, it's invalid"
    throw new Error(
      `Cannot compare number to string (when comparing ${column} to ${value})`
    );
  }

  const valueIsNumber = !isNaN(Number(value));
  if (dataTypes[column.trim()] === "string" && valueIsNumber) {
    throw new Error(
      `Cannot compare string to number (when comparing ${column} to ${value})`
    );
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
      return itemValue == filter.value;
    case "!=":
      return itemValue != filter.value;
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
