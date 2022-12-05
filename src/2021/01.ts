import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `199
200
208
210
200
207
240
269
260
263`;

const part1: TaskPartSolution = (input) =>
  input
    .split("\n")
    .reduce(
      (acc, r) => {
        const n = Number(r);
        if (acc.prev != -1 && acc.prev < n) {
          acc.count += 1;
        }
        acc.prev = n;
        return acc;
      },
      { prev: -1, count: 0 }
    )
    .count.toString();

const part2: TaskPartSolution = (input) => {
  const items = input.split("\n");
  let count = 0;
  for (let i = 1; i <= items.length - 3; i++) {
    const prevSet = items
      .slice(i - 1, i + 3 - 1)
      .map(Number)
      .reduce((a, b) => a + b, 0);
    const set = items
      .slice(i, i + 3)
      .map(Number)
      .reduce((a, b) => a + b, 0);
    if (set > prevSet) count += 1;
  }
  return count.toString();
};

const task = new Task(2021, 1, part1, part2);

export default task;
