import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

const part1: TaskPartSolution = (input) => {
  let x = 0;
  let y = 0;
  input.split("\n").forEach((row) => {
    const [dir, n] = row.split(" ");
    const num = Number(n);
    switch (dir) {
      case "forward":
        x += num;
        break;
      case "down":
        y += num;
        break;
      case "up":
        y -= num;
        break;
      default:
        break;
    }
  });
  return (x * y).toString();
};
const part2: TaskPartSolution = (input) => {
  let x = 0;
  let y = 0;
  let aim = 0;
  input.split("\n").forEach((row) => {
    const [dir, n] = row.split(" ");
    const num = Number(n);
    switch (dir) {
      case "forward":
        x += num;
        y += aim * num;
        break;
      case "down":
        aim += num;
        break;
      case "up":
        aim -= num;
        break;
      default:
        break;
    }
  });
  return (x * y).toString();
};

const task = new Task(2021, 2, part1, part2);

export default task;
