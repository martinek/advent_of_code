import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  let max = 0;
  let runningCount = 0;
  for (const row of input.split("\n")) {
    if (row === "") {
      if (runningCount > max) {
        max = runningCount;
      }
      runningCount = 0;
    } else {
      runningCount += Number(row);
    }
  }

  return max.toString();
};

const part2: TaskPartSolution = (input) => {
  const counts: number[] = [];

  let runningCount = 0;
  for (const row of input.split("\n")) {
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

  return topThreeSum.toString();
};

const task = new Task(2022, 1, part1, part2);

export default task;
