import Task, { TaskPartSolution } from "../utils/task.js";

const parseInput = (input: string): [number[], number[]] => {
  return input.split("\n").reduce<[number[], number[]]>(
    (acc, line) => {
      const [a, b] = line.split(/\W+/).map(Number);
      return [
        [...acc[0], a],
        [...acc[1], b],
      ];
    },
    [[], []]
  );
};

const part1: TaskPartSolution = (input) => {
  const [col1, col2] = parseInput(input);
  col1.sort((a, b) => a - b);
  col2.sort((a, b) => a - b);
  let result = 0;
  for (let i = 0; i < col1.length; i++) {
    result += Math.abs(col1[i] - col2[i]);
  }
  return result;
};
const part2: TaskPartSolution = (input) => {
  const [col1, col2] = parseInput(input);
  let result = 0;
  for (let i = 0; i < col1.length; i++) {
    const a = col1[i];
    result += a * col2.filter((n) => n === a).length;
  }
  return result;
};

const task = new Task(2024, 1, part1, part2, {
  part1: {
    input: `3   4
4   3
2   5
1   3
3   9
3   3`,
    result: "11",
  },
  part2: {
    input: `3   4
4   3
2   5
1   3
3   9
3   3`,
    result: "31",
  },
});

export default task;
