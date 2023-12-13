import Task, { TaskPartSolution } from "../utils/task.js";

const checkMirror = (row: string, n: number): boolean => {
  for (let i = 0; i < n; i++) {
    const l = row[n - i - 1];
    const r = row[n + i];
    if (l == null || r == null) return true;
    if (l !== r) return false;
  }
  return true;
};

const rowAxis = (row: string, ignore?: number): number[] => {
  const res = [];
  for (let i = 1; i < row.length; i++) {
    if (i !== ignore && checkMirror(row, i)) {
      res.push(i);
    }
  }
  return res;
};

const groupAxis = (g: string[], ignore?: number): number | undefined => {
  return g.map((r) => rowAxis(r, ignore)).reduce((acc, s) => acc.filter((n) => s.includes(n)))[0];
};

const transpose = (g: string[]): string[] => {
  let cols: string[] = new Array(g[0].length).fill("");
  return cols.map((c, i) => g.map((r) => r[i]).join(""));
};

const groupNumber = (g: string, ignore?: number): number | undefined => {
  const rows = g.split("\n");
  const r = groupAxis(rows, ignore && ignore < 100 ? ignore : undefined);
  if (r !== undefined) return r;

  const c = groupAxis(transpose(rows), ignore && ignore >= 100 ? ignore / 100 : undefined);
  if (c !== undefined) return c * 100;

  return undefined;
};

const part1: TaskPartSolution = (input) => {
  const groups = input.split("\n\n");
  return groups.map((g) => groupNumber(g)!).reduce((acc, n) => acc + n);
};

const groupNumberSmudge = (g: string): number => {
  const rows = g.split("\n");

  const baseNum = groupNumber(g);

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[0].length; x++) {
      const newRows = rows
        .map((r, ry) =>
          r
            .split("")
            .map((c, cx) => (ry === y && cx === x ? (c === "#" ? "." : "#") : c))
            .join("")
        )
        .join("\n");
      const newNum = groupNumber(newRows, baseNum);
      if (newNum !== undefined) {
        return newNum;
      }
    }
  }

  return NaN;
};

const part2: TaskPartSolution = (input) => {
  const groups = input.split("\n\n");
  return groups.map(groupNumberSmudge).reduce((acc, n) => acc + n);
};

const task = new Task(2023, 13, part1, part2, {
  part1: {
    input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
    result: "405",
  },
  part2: {
    input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
    result: "400",
  },
});

export default task;

// start 6:00; end ~7:15
