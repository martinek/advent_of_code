import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  let count = 0;
  input
    .replaceAll("L", "-")
    .replaceAll("R", "")
    .split("\n")
    .reduce((acc, line) => {
      const n = acc + Number(line);
      if (n % 100 === 0) {
        count++;
      }
      return n;
    }, 50);
  return count;
};
const part2: TaskPartSolution = (input) => {
  let count = 0;
  input
    .replaceAll("L", "-")
    .replaceAll("R", "")
    .split("\n")
    .reduce((acc, line) => {
      const n = Number(line);
      let r = acc;
      for (let i = 0; i < Math.abs(n); i++) {
        r = n > 0 ? r + 1 : r - 1;
        if (r % 100 === 0) {
          count++;
        }
      }
      return r;
    }, 50);
  return count;
};

const task = new Task(2025, 1, part1, part2, {
  part1: {
    input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
    result: "3",
  },
  part2: {
    input: `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`,
    result: "6",
  },
});

export default task;
