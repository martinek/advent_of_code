import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const lights: boolean[][] = Array.from({ length: 1000 }, () => Array.from({ length: 1000 }, () => false));
  const instructions = input
    .trim()
    .split("\n")
    .map((line) => {
      const match = line.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/);
      if (match == null) {
        throw new Error(`Invalid instruction: ${line}`);
      }
      return {
        action: match[1],
        x1: parseInt(match[2]),
        y1: parseInt(match[3]),
        x2: parseInt(match[4]),
        y2: parseInt(match[5]),
      };
    });

  instructions.forEach((instruction) => {
    for (let x = instruction.x1; x <= instruction.x2; x++) {
      for (let y = instruction.y1; y <= instruction.y2; y++) {
        switch (instruction.action) {
          case "turn on":
            lights[x][y] = true;
            break;
          case "turn off":
            lights[x][y] = false;
            break;
          case "toggle":
            lights[x][y] = !lights[x][y];
            break;
        }
      }
    }
  });

  return lights.flat().filter(Boolean).length.toString();
};
const part2: TaskPartSolution = (input) => {
  const lights: number[][] = Array.from({ length: 1000 }, () => Array.from({ length: 1000 }, () => 0));

  const instructions = input
    .trim()
    .split("\n")
    .map((line) => {
      const match = line.match(/(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/);
      if (match == null) {
        throw new Error(`Invalid instruction: ${line}`);
      }
      return {
        action: match[1],
        x1: parseInt(match[2]),
        y1: parseInt(match[3]),
        x2: parseInt(match[4]),
        y2: parseInt(match[5]),
      };
    });

  instructions.forEach((instruction) => {
    for (let x = instruction.x1; x <= instruction.x2; x++) {
      for (let y = instruction.y1; y <= instruction.y2; y++) {
        switch (instruction.action) {
          case "turn on":
            lights[x][y]++;
            break;
          case "turn off":
            lights[x][y] = Math.max(0, lights[x][y] - 1);
            break;
          case "toggle":
            lights[x][y] += 2;
            break;
        }
      }
    }
  });

  return lights
    .flat()
    .reduce((total, brightness) => total + brightness, 0)
    .toString();
};

const task = new Task(2015, 6, part1, part2, {
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
