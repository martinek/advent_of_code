import { getInput } from "../utils/input";

const input = getInput(__dirname).split("\n");

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

console.log(total);
