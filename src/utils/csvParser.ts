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

  // Trim the row to handle cases where it might be just whitespace
  row = row.trim();

  // If the row is empty after trimming, return an array with an empty string
  if (row.length === 0) {
    return [""]; // Return an array with an empty string for empty rows
  }

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"' && (i === 0 || row[i - 1] !== "\\")) {
      insideQuote = !insideQuote; // Toggle the insideQuote flag
    } else if (char === "," && !insideQuote) {
      values.push(current.trim());
      current = "";
    } else if (char === '"' && insideQuote && row[i + 1] === '"') {
      // Handle escaped quotes
      current += '"'; // Add a single quote if we encounter two quotes
      i++; // Skip the next quote
    } else {
      current += char;
    }
  }
  values.push(current.trim()); // Push the last value
  return values;
}
