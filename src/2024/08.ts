import { gcd2 } from "../utils/helpers.js";
import { ill } from "../utils/illustrator.js";
import Task, { TaskPartSolution } from "../utils/task.js";

interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

interface Input {
  antenas: Record<string, Point[]>;
  size: { width: number; height: number };
}

const parseInput = (input: string): Input => {
  const res: Input = { antenas: {}, size: { width: 0, height: 0 } };
  input.split("\n").map((line, y) =>
    line.split("").map((cell, x) => {
      res.size.width = Math.max(res.size.width, x + 1);
      res.size.height = Math.max(res.size.height, y + 1);
      if (cell === ".") return;
      res.antenas[cell] = res.antenas[cell] || [];
      res.antenas[cell].push({ x, y });
    })
  );
  return res;
};

const antinodes = (a: Point, b: Point, size: Size): Point[] => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const res: Point[] = [
    { x: a.x + dx, y: a.y + dy },
    { x: b.x - dx, y: b.y - dy },
  ];
  // console.log("AN", a, b, res);
  return res.filter((p) => p.x >= 0 && p.x < size.width && p.y >= 0 && p.y < size.height);
};
// Leaving my failed attempts here for future generations :)
// const antinodes2 = (a: Point, b: Point, size: Size): Point[] => {
//   const l = a.x < b.x ? a : b;
//   const r = l === a ? b : a;

//   // Special case for vertical line
//   if (l.x === r.x) {
//     const res: Point[] = [];
//     for (let y = 0; y < size.height; y++) {
//       res.push({ x: l.x, y });
//     }
//     return res;
//   }

//   const A = Decimal.div(l.y - r.y, l.x - r.x);
//   const B = Decimal.sub(l.y, A.mul(l.x));
//   console.log({ a, b, A, B });
//   const res: Point[] = [];
//   for (let x = 0; x < size.width; x++) {
//     let y = A.mul(new Decimal(x)).add(B);
//     console.log(x, y);
//     if (y.isInt() && y.greaterThanOrEqualTo(0) && y.lessThan(size.height)) {
//       res.push({ x, y: y.toNumber() });
//     }
//   }
//   // console.log("AN2", a, b, res);
//   return res;
// };
// const antinodes2 = (a: Point, b: Point, size: Size): Point[] => {
//   const l = a.x < b.x ? a : b;
//   const r = l === a ? b : a;
//   const dx = r.x - l.x;
//   const dy = r.y - l.y;
//   const res: Point[] = [];
//   for (let x = 0; x <= size.width; x++) {
//     if ((x - l.x) % dx !== 0) continue;
//     const a = (x - l.x) / dx;
//     const y = l.y + a * dy;
//     if (y % 1 === 0 && y >= 0 && y < size.height) {
//       res.push({ x, y });
//     }
//   }
//   // console.log("AN2", a, b, res);
//   return res;
// };
const antinodes2 = (a: Point, b: Point, size: Size): Point[] => {
  // Special case for vertical line
  if (a.x === b.x) {
    const res: Point[] = [];
    for (let y = 0; y < size.height; y++) {
      res.push({ x: a.x, y });
    }
    return res;
  }

  const n = gcd2(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  const dx = (a.x - b.x) / n;
  const dy = (a.y - b.y) / n;

  const res: Point[] = [];

  for (let x = 0; x < size.width; x++) {
    if ((x - a.x) % dx !== 0) continue;
    const y = a.y + ((x - a.x) / dx) * dy;
    if (y % 1 === 0 && y >= 0 && y < size.height) {
      res.push({ x, y });
    }
  }
  return res;
};

const printPoints = (pts: Point[], highlight: Point[], size: Size) => {
  const res = Array.from({ length: size.height }, () => Array.from({ length: size.width }, () => "."));
  pts.forEach((p) => {
    res[p.y][p.x] = "#";
    if (highlight.some((h) => h.x === p.x && h.y === p.y)) {
      res[p.y][p.x] = "X";
    }
  });
  ill.log(res.map((line) => line.join("")).join("\n"));
};

const part1: TaskPartSolution = (input) => {
  const { antenas, size } = parseInput(input);
  // console.log(size);
  const ans = new Set<string>();
  Object.entries(antenas).forEach(([name, points]) => {
    points.forEach((a) => {
      points.forEach((b) => {
        if (a === b) return;
        const nodes = antinodes(a, b, size);
        nodes.forEach((p) => {
          // console.log(name, a, b, p);
          ans.add(`${p.x},${p.y}`);
        });
      });
    });
  });
  // console.log(ans);
  return ans.size;
};

const part2: TaskPartSolution = (input) => {
  const { antenas, size } = parseInput(input);
  console.log(size, antenas);
  const ans = new Set<string>();
  Object.entries(antenas).forEach(([name, points]) => {
    points.forEach((a) => {
      points.forEach((b) => {
        if (a === b) return;
        const nodes = antinodes2(a, b, size);
        // console.log(name, a, b, nodes);
        nodes.forEach((p) => {
          ans.add(`${p.x},${p.y}`);
        });
        // printPoints(nodes, [a, b], size);
        // pause();
      });
    });
  });
  // console.log(ans);
  return ans.size;
};

const task = new Task(2024, 8, part1, part2, {
  part1: {
    input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
    result: "14",
  },
  part2: {
    input: `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`,
    result: "34",
  },
});

export default task;
