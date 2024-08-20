import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  return input.split("\n").filter((r) => {
    const [a, b, c] = r.trim().split(/\W+/).map(Number);
    return a + b > c && a + c > b && c + b > a;
  }).length;
};
const part2: TaskPartSolution = (input) => {
  const numbers = input.split("\n").flatMap((r) => {
    return r.trim().split(/\W+/).map(Number);
  });
  let valid = 0;
  while (numbers.length > 0) {
    const mx = numbers.splice(0, 9);
    for (let index = 0; index < 3; index++) {
      const [a, b, c] = [mx[index], mx[index + 3], mx[index + 6]];
      if (a + b > c && a + c > b && b + c > a) {
        valid += 1;
      }
    }
  }
  return valid;
};

const task = new Task(2016, 3, part1, part2, {
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
