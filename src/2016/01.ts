import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const instructions = input.split(", ");
  let x = 0;
  let y = 0;
  let direction = 0;

  for (const instruction of instructions) {
    const turn = instruction[0];
    const distance = Number(instruction.slice(1));

    if (turn === "R") {
      direction = (direction + 1) % 4;
    } else {
      direction = (direction + 3) % 4;
    }

    switch (direction) {
      case 0:
        y += distance;
        break;
      case 1:
        x += distance;
        break;
      case 2:
        y -= distance;
        break;
      case 3:
        x -= distance;
        break;
    }
  }

  return Math.abs(x) + Math.abs(y);
};
const part2: TaskPartSolution = (input) => {
  const instructions = input.split(", ");
  let x = 0;
  let y = 0;
  let direction = 0;
  const visited = new Set<string>();

  for (const instruction of instructions) {
    const turn = instruction[0];
    const distance = Number(instruction.slice(1));

    if (turn === "R") {
      direction = (direction + 1) % 4;
    } else {
      direction = (direction + 3) % 4;
    }

    for (let i = 0; i < distance; i++) {
      switch (direction) {
        case 0:
          y++;
          break;
        case 1:
          x++;
          break;
        case 2:
          y--;
          break;
        case 3:
          x--;
          break;
      }

      const key = `${x},${y}`;
      if (visited.has(key)) {
        return Math.abs(x) + Math.abs(y);
      }
      visited.add(key);
    }
  }

  return -1;
};

const task = new Task(2016, 1, part1, part2, {
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
