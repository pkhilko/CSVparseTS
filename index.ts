import fs from "fs";

// Step 1: Custom CSV Parser

function parseCSV(filePath: string): string[][] {
  const csvContent = fs.readFileSync(filePath, "utf-8");
  const rows = csvContent.split("\n");
  const parsedRows: string[][] = rows.map((row) => parseRow(row));
  return parsedRows;
}

function parseRow(row: string): string[] {
  const values: string[] = [];
  let current = "";
  let insideQuote = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"' && (i === 0 || row[i - 1] !== "\\")) {
      insideQuote = !insideQuote;
    } else if (char === "," && !insideQuote) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

// Step 2: Data Loading

function loadCSV(filePath: string): Record<string, string | number>[] {
  const rows = parseCSV(filePath);
  const headers = rows[0];
  const data = rows.slice(1);

  // Convert to an array of objects
  return data.map((row) => {
    const rowObject: Record<string, string | number> = {};
    row.forEach((value, index) => {
      const header = headers[index];
      // Convert numeric values if possible
      rowObject[header] = /^\d+$/.test(value) ? Number(value) : value;
    });
    return rowObject;
  });
}

// Step 3: Query Engine

function executeQuery(
  data: Record<string, string | number>[],
  query: string
): Record<string, string | number>[] {
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

// Step 4: Helper Functions

function parseProjection(projectionPart: string): string[] {
  return projectionPart
    .replace("PROJECT", "")
    .split(",")
    .map((col) => col.trim());
}

function parseFilter(filterPart: string): {
  column: string;
  value: string | number;
  operator: string;
} {
  const [column, operatorValue] = filterPart.split(">");
  const operator = ">";
  const value = operatorValue.trim().replace(/^"|"$/g, ""); // Remove quotes around string values
  return {
    column: column.trim(),
    value: isNaN(Number(value)) ? value : Number(value),
    operator,
  };
}

function evaluateFilter(
  item: Record<string, string | number>,
  filter: { column: string; value: string | number; operator: string }
): boolean {
  const itemValue = item[filter.column];

  if (filter.operator === ">") {
    return itemValue > filter.value;
  }

  return false;
}

function projectData(
  item: Record<string, string | number>,
  projections: string[]
): Record<string, string | number> {
  const projectedData: Record<string, string | number> = {};
  projections.forEach((col) => {
    if (col in item) {
      projectedData[col] = item[col];
    }
  });
  return projectedData;
}

// Step 5: Example Usage

const filePath = "./sample_data.csv"; // Path to your CSV file
const data = loadCSV(filePath);

// Sample queries
const query = 'PROJECTcol1,col2FILTERcol3 > "20"';
const result = executeQuery(data, query);
console.log(result);
