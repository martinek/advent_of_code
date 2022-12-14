import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const pts = {
    X: 1,
    Y: 2,
    Z: 3,
  };

  const draw = {
    A: "X",
    B: "Y",
    C: "Z",
  };

  const win = {
    A: "Y",
    B: "Z",
    C: "X",
  };

  const res = input
    .split("\n")
    .map((row) => {
      if (row.trim() === "") return 0;
      const [a, b] = row.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"];
      const signPoints = pts[b];
      const winPoints = draw[a] === b ? 3 : win[a] === b ? 6 : 0;
      // console.log(a, b, signPoints, winPoints);
      return signPoints + winPoints;
    })
    .reduce((acc, row) => acc + row, 0);

  return res.toString();
};

const part2: TaskPartSolution = (input) => {
  type TOther = "A" | "B" | "C";

  const pts = {
    A: 1,
    B: 2,
    C: 3,
  };

  const draw = {
    A: "A",
    B: "B",
    C: "C",
  };

  const win = {
    A: "B",
    B: "C",
    C: "A",
  };

  const lose = {
    A: "C",
    B: "A",
    C: "B",
  };

  const total = input
    .split("\n")
    .map((row) => {
      if (row.trim() === "") return 0;
      const [a, b] = row.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"];
      let bSign: TOther;
      let winPoints: number;
      switch (b) {
        case "X":
          bSign = lose[a] as TOther;
          winPoints = 0;
          break;
        case "Y":
          bSign = draw[a] as TOther;
          winPoints = 3;
          break;
        case "Z":
          bSign = win[a] as TOther;
          winPoints = 6;
          break;
      }
      const signPoints = pts[bSign];
      return signPoints + winPoints;
    })
    .reduce((acc, row) => acc + row, 0);

  return total.toString();
};

const task = new Task(2022, 2, part1, part2);

export default task;
