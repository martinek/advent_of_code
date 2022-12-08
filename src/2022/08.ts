import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `30373
25512
65332
33549
35390`;

const { max } = Math;
// const join = (l: number[]) => l.join("");

const isVisibleList = (list: number[], i: number) => {
  // console.log("isVisibleList", join(list), i);
  const value = list[i];
  if (max(...list.slice(0, i)) < value) {
    // console.log("start");
    return true;
  }
  if (max(...list.slice(i + 1)) < value) {
    // console.log("end");
    return true;
  }
  // console.log("no");
  return false;
};

const isVisible = (grid: number[][], x: number, y: number): boolean => {
  if (x === 0 || y === 0) return true;

  const row = grid[x];
  if (y === row.length - 1) return true;
  if (isVisibleList(row, y)) return true;

  const col = grid.map((r) => r[y]);
  if (x === col.length - 1) return true;
  if (isVisibleList(col, x)) return true;

  return false;
};

const part1: TaskPartSolution = (input) => {
  const grid = input
    .trim()
    .split("\n")
    .map((r) => r.split("").map(Number));
  const visibilityGrid: number[][] = [];
  let count = 0;
  for (let x = 0; x < grid.length; x++) {
    visibilityGrid.push([]);
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      const vis = isVisible(grid, x, y);
      visibilityGrid[x].push(vis ? 1 : 0);
      count += vis ? 1 : 0;
    }
  }

  return count.toString();
};

const countUntilFirstLarger = (list: number[]) => {
  const first = list[0];
  for (let i = 1; i < list.length; i++) {
    const tree = list[i];
    if (tree == null) return i - 1;
    if (tree >= first) return i;
  }
  return list.length - 1;
};

const scenicScore = (grid: number[][], x: number, y: number): number => {
  const leftScore = countUntilFirstLarger(grid[x].slice(0, y + 1).reverse());
  const rightScore = countUntilFirstLarger(grid[x].slice(y));
  const col = grid.map((r) => r[y]);
  const topScore = countUntilFirstLarger(col.slice(0, x + 1).reverse());
  const bottomScore = countUntilFirstLarger(col.slice(x));
  return leftScore * rightScore * topScore * bottomScore;
};

const part2: TaskPartSolution = (input) => {
  const grid = input
    .trim()
    .split("\n")
    .map((r) => r.split("").map(Number));

  const scoreGrid: number[][] = [];
  let maxScore = 0;
  for (let x = 0; x < grid.length; x++) {
    scoreGrid.push([]);
    const row = grid[x];
    for (let y = 0; y < row.length; y++) {
      const score = scenicScore(grid, x, y);
      scoreGrid[x].push(score);
      maxScore = max(maxScore, score);
    }
  }

  return maxScore.toString();
};

const task = new Task(2022, 8, part1, part2);

export default task;
