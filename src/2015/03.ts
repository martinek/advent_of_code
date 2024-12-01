import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const visited = new Set();
  let x = 0;
  let y = 0;
  visited.add(`${x}_${y}`);
  for (const char of input.split("")) {
    switch (char) {
      case ">":
        x += 1;
        break;
      case "<":
        x -= 1;
        break;
      case "^":
        y -= 1;
        break;
      case "v":
        y += 1;
        break;
    }
    visited.add(`${x}_${y}`);
  }
  return visited.size;
};
const part2: TaskPartSolution = (input) => {
  const chars = input.split("");
  const visited = new Set();
  const pos1 = [0, 0];
  const pos2 = [0, 0];
  visited.add(`0_0`);
  for (let i = 0; i < chars.length; i++) {
    const pos = i % 2 == 0 ? pos1 : pos2;
    const char = chars[i];
    switch (char) {
      case ">":
        pos[0] += 1;
        break;
      case "<":
        pos[0] -= 1;
        break;
      case "^":
        pos[1] -= 1;
        break;
      case "v":
        pos[1] += 1;
        break;
    }
    visited.add(`${pos[0]}_${pos[1]}`);
  }
  return visited.size;
};

const task = new Task(2015, 3, part1, part2, {
  part1: {
    input: ``,
    result: "",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;
