import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const lines = input.trim().split("\n");
  const keypad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
  ];
  let x = 1;
  let y = 1;
  const code: string[] = [];
  for (const line of lines) {
    for (const char of line) {
      switch (char) {
        case "U":
          y = Math.max(0, y - 1);
          break;
        case "D":
          y = Math.min(2, y + 1);
          break;
        case "L":
          x = Math.max(0, x - 1);
          break;
        case "R":
          x = Math.min(2, x + 1);
          break;
      }
    }
    code.push(keypad[y][x]);
  }
  return code.join("");
};
const part2: TaskPartSolution = (input) => {
  const lines = input.trim().split("\n");
  const keypad = [
    [null, null, "1", null, null],
    [null, "2", "3", "4", null],
    ["5", "6", "7", "8", "9"],
    [null, "A", "B", "C", null],
    [null, null, "D", null, null],
  ];
  let x = 0;
  let y = 2;
  const code: string[] = [];
  for (const line of lines) {
    for (const char of line) {
      let newX = x;
      let newY = y;
      switch (char) {
        case "U":
          newY = Math.max(0, y - 1);
          break;
        case "D":
          newY = Math.min(4, y + 1);
          break;
        case "L":
          newX = Math.max(0, x - 1);
          break;
        case "R":
          newX = Math.min(4, x + 1);
          break;
      }
      if (keypad[newY][newX] !== null) {
        x = newX;
        y = newY;
      }
    }
    code.push(keypad[y][x]!);
  }
  return code.join("");
};

const task = new Task(2016, 2, part1, part2, {
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
