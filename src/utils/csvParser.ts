import fs from "fs";

export function parseCSV(filePath: string): string[][] {
  const csvContent = fs.readFileSync(filePath, "utf-8");
  const rows = csvContent.split("\n");
  return rows.map((row) => parseRow(row));
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
