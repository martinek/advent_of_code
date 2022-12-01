import { getInput } from "../utils/input";

const input = getInput(__dirname).split("\n");

let max = 0;
let runningCount = 0;
for (const row of input) {
  if (row === "") {
    if (runningCount > max) {
      max = runningCount;
    }
    runningCount = 0;
  } else {
    runningCount += Number(row);
  }
}

console.log(max);
