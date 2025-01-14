import { parseCSV } from "./utils/csvParser";
import { executeQuery } from "./engine/queryEngine";
import { DataRow } from "./models/types";

function loadCSV(filePath: string): DataRow[] {
  const rows = parseCSV(filePath);
  const headers = rows[0];
  const data = rows.slice(1);

  // Convert to an array of objects
  return data.map((row) => {
    const rowObject: DataRow = {};
    row.forEach((value, index) => {
      const header = headers[index];
      rowObject[header] = /^\d+$/.test(value) ? Number(value) : value;
    });
    return rowObject;
  });
}

// Entry Point
const filePath = "./sample_data2.csv"; // Path to your CSV file
const data = loadCSV(filePath);

// Sample queries
const query = "PROJECT name FILTER age > 30";
const result = executeQuery(data, query);
console.log(result);
