import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

interface Point {
  x: number;
  y: number;
}

class Line {
  points: Point[];
  constructor(a: Point, b: Point) {
    this.points = [];

    if (a.x === b.x) {
      const minY = Math.min(a.y, b.y);
      const maxY = Math.max(a.y, b.y);
      for (let y = minY; y <= maxY; y++) {
        this.points.push({ x: a.x, y });
      }
    } else {
      const minX = Math.min(a.x, b.x);
      const maxX = Math.max(a.x, b.x);
      for (let x = minX; x <= maxX; x++) {
        this.points.push({ x, y: a.y });
      }
    }
  }
}

const str = (pt: Point) => `${pt.x}_${pt.y}`;

class Grid {
  rocks: Point[];
  bottom: number;
  sand: Point[];

  constructor(input: string) {
    this.rocks = input
      .split("\n")
      .map((r) => r.split(" -> "))
      .flatMap((row) => {
        const wps: Point[] = row.map((p) => p.split(",")).map(([x, y]) => ({ x: Number(x), y: Number(y) }));
        let res: Point[] = [];
        let current = wps.shift()!;
        res.push(current);
        while (wps.length > 0) {
          const next = wps.shift()!;
          const line = new Line(current, next);
          res.push(...line.points.filter((pt) => !(pt.x === current.x && pt.y === current.y)));
          current = next;
        }
        return res;
      });
    this.bottom = Math.max(...this.rocks.map((r) => r.y));
    this.sand = [];
  }

  fill(pt: Point, hasFloor = false) {
    const filled = new Set(this.rocks.map(str));
    const floor = hasFloor ? this.bottom + 2 : Infinity;

    let newPt: Point | undefined;
    do {
      newPt = this.add(filled, pt, floor);
      if (newPt) {
        if (filled.has(str(newPt))) break; // if added is already present, we are filled up
        filled.add(str(newPt));
        this.sand.push(newPt);
      }
    } while (newPt != undefined);
  }

  private add(filled: Set<string>, pt: Point, floor: number): Point | undefined {
    let currentPos = pt;
    const bottom = floor === Infinity ? this.bottom : floor;
    // this should never be hit
    while (currentPos.y < bottom) {
      let nextPos = { ...currentPos, y: currentPos.y + 1 }; // down
      if (!filled.has(str(nextPos)) && nextPos.y < floor) {
        currentPos = nextPos;
        continue;
      }
      nextPos = { x: currentPos.x - 1, y: currentPos.y + 1 }; // down left
      if (!filled.has(str(nextPos)) && nextPos.y < floor) {
        currentPos = nextPos;
        continue;
      }
      nextPos = { x: currentPos.x + 1, y: currentPos.y + 1 }; // down right
      if (!filled.has(str(nextPos)) && nextPos.y < floor) {
        currentPos = nextPos;
        continue;
      }
      return currentPos;
    }
    return undefined;
  }

  print() {
    const allPts = [...this.rocks, ...this.sand];
    const xs = allPts.map((pt) => pt.x);
    const ys = allPts.map((pt) => pt.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const rocksSet = new Set(this.rocks.map(str));
    const sandSet = new Set(this.sand.map(str));

    let res = "";
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const pt = str({ x, y });
        res += rocksSet.has(pt) ? "#" : sandSet.has(pt) ? "o" : ".";
      }
      res += "\n";
    }
    console.log(res);
  }
}

const part1: TaskPartSolution = (input) => {
  const grid = new Grid(input);
  grid.fill({ x: 500, y: 0 });
  // grid.print();
  return grid.sand.length;
};
const part2: TaskPartSolution = (input) => {
  const grid = new Grid(input);
  grid.fill({ x: 500, y: 0 }, true);
  // grid.print();
  return grid.sand.length;
};

const task = new Task(2022, 14, part1, part2);

export default task;
