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
    console.log(rowObject);
    return rowObject;
  });
}

const main = () => {
  const filePath = "./src/sample_data2.csv";
  const data = loadCSV(filePath);
  runRepl(data);
};

main();
