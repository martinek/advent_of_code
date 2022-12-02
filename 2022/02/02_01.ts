import { getInput } from "../utils/input";

const input = getInput(__dirname).split("\n");

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

const total = input
  .map((row) => {
    if (row.trim() === "") return 0;
    const [a, b] = row.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"];
    const signPoints = pts[b];
    const winPoints = draw[a] === b ? 3 : win[a] === b ? 6 : 0;
    console.log(a, b, signPoints, winPoints);
    return signPoints + winPoints;
  })
  .reduce((acc, row) => acc + row, 0);

console.log(total);
