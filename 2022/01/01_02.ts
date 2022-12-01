import { getInput } from "../utils/input";

const input = getInput(__dirname).split("\n");

const counts: number[] = [];

let runningCount = 0;
for (const row of input) {
  if (row === "") {
    counts.push(runningCount);
    runningCount = 0;
  } else {
    runningCount += Number(row);
  }
}

counts.sort((a, b) => a - b).reverse();
const topThree = counts.slice(0, 3);
const topThreeSum = topThree.reduce((sum, n) => sum + n, 0);

console.log(topThreeSum);
