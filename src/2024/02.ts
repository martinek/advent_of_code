import Task, { TaskPartSolution } from "../utils/task.js";

const isSafe = (levels: number[]) => {
  let dir: "up" | "down" | undefined;
  for (let i = 1; i < levels.length; i++) {
    const current = levels[i];
    const prev = levels[i - 1];
    if (i === 1) {
      dir = current > prev ? "up" : "down";
    }
    const d = Math.abs(current - prev);
    // console.log(current, prev, d);
    if (d < 1 || d > 3) return false;
    if (dir === "up" && current < prev) return false;
    if (dir === "down" && current > prev) return false;
  }
  return true;
};

const isSafe2 = (levels: number[]) => {
  if (isSafe(levels)) return true;
  for (let i = 0; i < levels.length; i++) {
    const copy = [...levels];
    copy.splice(i, 1);
    if (isSafe(copy)) return true;
  }
};

const part1: TaskPartSolution = (input) => {
  const reports = input.split("\n").map((line) => {
    return line.split(" ").map(Number);
  });
  return reports.filter((v) => {
    return isSafe(v);
  }).length;
};
const part2: TaskPartSolution = (input) => {
  const reports = input.split("\n").map((line) => {
    return line.split(" ").map(Number);
  });
  return reports.filter((v) => {
    return isSafe2(v);
  }).length;
};

const task = new Task(2024, 2, part1, part2, {
  part1: {
    input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
    result: "2",
  },
  part2: {
    input: `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`,
    result: "4",
  },
});

export default task;
