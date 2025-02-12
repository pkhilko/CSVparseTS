import { parseCSV } from "./utils/csvParser";
import { DataRow, ColumnTypeMap } from "./models/types";
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

// Input - data (or first element of data)
// Output - ColumnTypeMap
export function getDataTypes(anyData: DataRow[]) {
  //=> not work export???
  const dataTypes: ColumnTypeMap = {};
  const firstElement = anyData[0];
  console.log("lol?2>>>", firstElement);
  const keysOfFirstElement = Object.keys(firstElement);
  for (const key of keysOfFirstElement) {
    dataTypes[key] = typeof firstElement[key] as "string" | "number";
  }
  return dataTypes;
  //return only in fundtion???
  // TODO: Move dataTypes code here
  // TODO: Use this function in tests to generate dataTypes inside tests (for mockData)
}

const main = () => {
  const filePath = "./src/sample_data2.csv";
  const data = loadCSV(filePath);
  //const dataTypes: ColumnTypeMap = {};
  //const firstElement = data[0];
  // 👆
  // {
  //   name: "John",
  //   age: 25,
  //   city: "Chicago",
  // }
  // const keysOfFirstElement = Object.keys(firstElement); // ['name', 'age', 'city']
  // for (const key of keysOfFirstElement) {
  //   dataTypes[key] = typeof firstElement[key] as "string" | "number";
  //   // dataTypes[key] = typeof 25
  // }

  /**
   * {
   *  name: 'string',
   *  age: 'number',
   *  city: 'string'
   * }
   */
  const data1 = getDataTypes(data);
  runRepl(data, data1);
};

main();
