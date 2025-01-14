import * as readline from "readline";
import { executeQuery } from "./engine/queryEngine";
import { DataRow } from "./models/types";

// Creates REPL user interface, takes over the control of the terminal, handles user input
export const runRepl = (data: DataRow[]): void => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> ",
  });

  rl.prompt();
  rl.on("line", (line) => {
    const input = line.trim();
    if (input === "exit") {
      console.log("Exiting the REPL...");
      rl.close();
      return;
    }

    try {
      console.log("Input is = ", input);
      console.log(executeQuery(data, input));
    } catch (err) {
      console.error(`Error: `, err);
    }

    rl.prompt();
  });

  rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
  });
};
