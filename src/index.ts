import { parseCSV } from "./utils/csvParser";
import { executeQuery } from "./engine/queryEngine";
import { DataRow } from "./models/types";
import { runRepl } from "./repl";

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

const main = () => {
  // TODO:
  // 1. Take filename from CLI argument 🚧
  const filePath = "./src/sample_data2.csv";
  // 2. Parse CSV file 🚧
  const data = loadCSV(filePath);
  // 3. Run REPL ✅
  runRepl(data);
  // PROJECT name FILTER age > 30"
};

main();
