import Task, { TaskPartSolution } from "../utils/task.js";

const check = (prod: number, pts: number[], operators: string[]) => {
  if (pts.length === 1) {
    return pts[0] === prod;
  }
  if (pts[0] > prod) {
    // fast fail
    return false;
  }

  return operators.some((operator): boolean => {
    const [a, b, ...rest] = pts;
    let n = 0;
    switch (operator) {
      case "+":
        n = a + b;
        break;
      case "*":
        n = a * b;
        break;
      case "||":
        n = Number(String(a) + String(b));
        break;
    }
    return check(prod, [n, ...rest], operators);
  });
};

const part1: TaskPartSolution = (input) => {
  const operators = ["+", "*"];
  return input.split("\n").reduce((acc, line) => {
    const [prodString, ptsString] = line.split(": ");
    const prod = Number(prodString);
    const pts = ptsString.split(" ").map(Number);

    if (check(prod, pts, operators)) {
      return acc + prod;
    }

    return acc;
  }, 0);
};
const part2: TaskPartSolution = (input) => {
  const operators = ["+", "*", "||"];
  return input.split("\n").reduce((acc, line) => {
    const [prodString, ptsString] = line.split(": ");
    const prod = Number(prodString);
    const pts = ptsString.split(" ").map(Number);

    if (check(prod, pts, operators)) {
      return acc + prod;
    }

    return acc;
  }, 0);
};

const task = new Task(2024, 7, part1, part2, {
  part1: {
    input: `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`,
    result: "3749",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;
