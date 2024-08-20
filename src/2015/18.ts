import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const grid = input.split("\n").map((line) => line.split(""));
  const size = grid.length;

  const getNeighbors = (x: number, y: number) => {
    const neighbors = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        if (x + i >= 0 && x + i < size && y + j >= 0 && y + j < size) {
          neighbors.push(grid[x + i][y + j]);
        }
      }
    }
    return neighbors;
  };

  const nextGrid = grid.map((row) => [...row]);
  for (let i = 0; i < 100; i++) {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const neighbors = getNeighbors(x, y);
        const onCount = neighbors.filter((n) => n === "#").length;
        if (grid[x][y] === "#") {
          nextGrid[x][y] = onCount === 2 || onCount === 3 ? "#" : ".";
        } else {
          nextGrid[x][y] = onCount === 3 ? "#" : ".";
        }
      }
    }
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        grid[x][y] = nextGrid[x][y];
      }
    }
  }

  const onCount = grid.flat().filter((c) => c === "#").length;
  return onCount.toString();
};
const part2: TaskPartSolution = (input) => {
  const grid = input.split("\n").map((line) => line.split(""));
  const size = grid.length;

  const getNeighbors = (x: number, y: number) => {
    const neighbors = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        if (x + i >= 0 && x + i < size && y + j >= 0 && y + j < size) {
          neighbors.push(grid[x + i][y + j]);
        }
      }
    }
    return neighbors;
  };

  const nextGrid = grid.map((row) => [...row]);
  for (let i = 0; i < 100; i++) {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const neighbors = getNeighbors(x, y);
        const onCount = neighbors.filter((n) => n === "#").length;
        if (grid[x][y] === "#") {
          nextGrid[x][y] = onCount === 2 || onCount === 3 ? "#" : ".";
        } else {
          nextGrid[x][y] = onCount === 3 ? "#" : ".";
        }
        if (x === 0 || x === size - 1) {
          if (y === 0 || y === size - 1) {
            nextGrid[x][y] = "#";
          }
        }
      }
    }
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        grid[x][y] = nextGrid[x][y];
      }
    }
  }

  const onCount = grid.flat().filter((c) => c === "#").length;
  return onCount.toString();
};

const task = new Task(2015, 18, part1, part2, {
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
