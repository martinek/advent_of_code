import { COLOR, isPresent } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

type Cell = "." | "\\" | "|" | "/" | "-";
type Grid = Cell[][];
type Pos = { x: number; y: number };
type Heading = "up" | "right" | "down" | "left" | null;
type BeamPos = { heading: Heading; pos: Pos };
type Beam = { pos: BeamPos };
type History = Set<string>;

const posKey = (pos: BeamPos): string => `${pos.heading}_${pos.pos.x}_${pos.pos.y}`;

const offset = (pos: Pos, heading: Heading): Pos => {
  switch (heading) {
    case "up":
      return { x: pos.x, y: pos.y - 1 };
    case "down":
      return { x: pos.x, y: pos.y + 1 };
    case "left":
      return { x: pos.x - 1, y: pos.y };
    case "right":
      return { x: pos.x + 1, y: pos.y };
    case null:
      return pos;
  }
};

const turn = (char: "/" | "\\", heading: Heading): Heading => {
  switch (heading) {
    case "down":
      return char === "/" ? "left" : "right";
    case "up":
      return char === "/" ? "right" : "left";
    case "left":
      return char === "/" ? "down" : "up";
    case "right":
      return char === "/" ? "up" : "down";
  }
  throw new Error(`Error in turn: ${heading}, ${char}. This should not happen!!!`);
};

const parseGrid = (input: string): Grid => {
  return input.split("\n").map((row) => row.split("") as Cell[]);
};

const printGrid = (grid: Grid, beams: Beam[], history: History) => {
  const hSym = { up: "^", right: ">", down: "v", left: "<" };
  console.log(
    grid
      .map((r, y) =>
        r
          .map((c, x) => {
            if (c !== ".") return `${COLOR.FgCyan}${c}${COLOR.Reset}`;

            const cbeam = beams.filter((b) => b.pos.pos.x === x && b.pos.pos.y === y);
            if (cbeam.length === 1 && cbeam[0].pos.heading) return hSym[cbeam[0].pos.heading];
            if (cbeam.length > 1) cbeam.length;

            const key = `${x}_${y}`;

            const d = (["up", "right", "down", "left"] as Array<keyof typeof hSym>)
              .map((d) => {
                const h = history.has(`${d}_${key}`);
                if (h) return hSym[d];
                // if (h) return "#";
              })
              .filter(isPresent);

            if (d.length === 1) return d[0];
            if (d.length > 1) return "+";
            // if (d.length > 1) return "#";

            // return "";
            // if (c === ".") return " ";
            return c;
          })
          .join("")
      )
      .join("\n")
  );
};

const countGrid = (history: History) => {
  const coverage = new Set<string>();
  history.forEach((p) => {
    coverage.add(p.split("_").slice(1).join("_"));
  });
  return coverage.size;
};

const revHeading = (h: Heading): Heading => {
  switch (h) {
    case "down":
      return "up";
    case "up":
      return "down";
    case "left":
      return "right";
    case "right":
      return "left";
  }
  throw new Error(`unknown heading ${h}`);
};

const step = (grid: Grid, beams: Beam[], history: History): Beam[] => {
  return beams.flatMap((b) => {
    if (b.pos.heading == null) return b;

    const newPos = offset(b.pos.pos, b.pos.heading);

    if (newPos.x < 0 || newPos.x > grid[0].length - 1 || newPos.y < 0 || newPos.y > grid.length - 1) {
      // hit wall (went out of bounds)
      b.pos = { ...b.pos, heading: null };
      // history.add(posKey(b.pos));
      return b;
    }

    const newKey = posKey({ pos: newPos, heading: b.pos.heading });

    if (history.has(newKey)) {
      // || history.has(posKey({ pos: newPos, heading: revHeading(b.pos.heading) }))) {
      // already been here
      b.pos = { ...b.pos, heading: null };
      return b;
    }

    const c = grid[newPos.y][newPos.x];
    if (c === ".") {
      b.pos = { heading: b.pos.heading, pos: newPos };
      history.add(posKey(b.pos));
      return b;
    }

    if (c === "-") {
      if (b.pos.heading === "left" || b.pos.heading === "right") {
        // continue
        b.pos = { heading: b.pos.heading, pos: newPos };
        history.add(posKey(b.pos));
        return b;
      } else {
        // Split horizontally
        const lBeam: Beam = { pos: { heading: "left", pos: newPos } };
        history.add(posKey(lBeam.pos));
        const rBeam: Beam = { pos: { heading: "right", pos: newPos } };
        history.add(posKey(rBeam.pos));
        return [lBeam, rBeam];
      }
    }

    if (c === "|") {
      if (b.pos.heading === "up" || b.pos.heading === "down") {
        // continue
        b.pos = { heading: b.pos.heading, pos: newPos };
        history.add(posKey(b.pos));
        return b;
      } else {
        // Split vertically
        const tBeam: Beam = { pos: { heading: "up", pos: newPos } };
        history.add(posKey(tBeam.pos));
        const bBeam: Beam = { pos: { heading: "down", pos: newPos } };
        history.add(posKey(bBeam.pos));
        return [tBeam, bBeam];
      }
    }

    if (c === "/" || c === "\\") {
      history.add(posKey({ heading: b.pos.heading, pos: newPos }));
      b.pos = { heading: turn(c, b.pos.heading), pos: newPos };
      return b;
    }

    // Should not happen
    throw new Error("Error in step");
  });
};

const part1: TaskPartSolution = (input) => {
  const grid = parseGrid(input);

  let beams: Beam[] = [{ pos: { heading: "right", pos: { x: -1, y: 0 } } }];
  const history: History = new Set();

  let i = 0;
  while (beams.some((b) => b.pos.heading !== null)) {
    beams = step(grid, beams, history);
    // console.log(`===== ${i} =====`);
    // printGrid(grid, beams);
    i++;
    if (i % 10 === 0) {
      // console.log(`===== ${i} =====`);
      // printGrid(grid, beams, history);
      // break;
    }
  }

  // console.log(`===== ${i} =====`);
  // printGrid(grid, beams, history);

  return countGrid(history);
};
const part2: TaskPartSolution = (input) => {
  const grid = parseGrid(input);

  const starts: Beam[] = [];
  for (let y = 0; y < grid.length; y++) {
    starts.push({ pos: { heading: "right", pos: { x: -1, y } } });
    starts.push({ pos: { heading: "left", pos: { x: grid[0].length, y } } });
  }

  for (let x = 0; x < grid[0].length; x++) {
    starts.push({ pos: { heading: "down", pos: { x, y: -1 } } });
    starts.push({ pos: { heading: "up", pos: { x, y: grid.length } } });
  }

  const resses = starts.map((s) => {
    let beams: Beam[] = [s];
    const history: History = new Set();

    let i = 0;
    while (beams.some((b) => b.pos.heading !== null)) {
      beams = step(grid, beams, history);
      // console.log(`===== ${i} =====`);
      // printGrid(grid, beams);
      i++;
      if (i % 10 === 0) {
        // console.log(`===== ${i} =====`);
        // printGrid(grid, beams, history);
        // break;
      }
    }

    return countGrid(history);
  });

  return Math.max(...resses);
};

const task = new Task(2023, 16, part1, part2, {
  part1: {
    input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
    result: "46",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;

// 5504 low; 6000 low
