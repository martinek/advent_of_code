import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5`;

type Coord = [number, number, number];

const parseInput = (i: string): Coord[] => i.split("\n").map((r) => r.split(",").map(Number) as Coord);

const touches = (c1: Coord, c2: Coord) => {
  const [x1, y1, z1] = c1;
  const [x2, y2, z2] = c2;

  return (
    (x1 === x2 && y1 === y2 && (z1 === z2 + 1 || z1 === z2 - 1)) ||
    (x1 === x2 && z1 === z2 && (y1 === y2 + 1 || y1 === y2 - 1)) ||
    (y1 === y2 && z1 === z2 && (x1 === x2 + 1 || x1 === x2 - 1))
  );
};

class Shape {
  coords: Coord[];
  constructor(coords: Coord[]) {
    this.coords = [...coords];
  }

  touches(c1: Coord): boolean {
    return this.touchingFaces(c1).length > 0;
  }

  touchingFaces(c1: Coord): Coord[] {
    return this.coords.filter((c2) => touches(c1, c2));
  }

  faces() {
    if (this.coords.length === 1) {
      return 6;
    }

    let count = 0;
    for (const c of this.coords) {
      count += 6 - this.coords.filter((c2) => touches(c, c2)).length;
    }
    return count;
  }

  bounds() {
    const bounds: [Coord, Coord] = [
      [Infinity, Infinity, Infinity],
      [0, 0, 0],
    ];
    this.coords.forEach(([x, y, z]) => {
      bounds[0][0] = Math.min(bounds[0][0], x);
      bounds[0][1] = Math.min(bounds[0][1], y);
      bounds[0][2] = Math.min(bounds[0][2], z);
      bounds[1][0] = Math.max(bounds[1][0], x);
      bounds[1][1] = Math.max(bounds[1][1], y);
      bounds[1][2] = Math.max(bounds[1][2], z);
    });
    return bounds;
  }

  outsideFaces() {
    if (this.coords.length <= 6) return this.faces();

    const bounds = this.bounds();
    const coordsSet = new Set(this.coords.map((c) => `${c[0]}_${c[1]}_${c[2]}`));
    const emptyCoords: Coord[] = [];
    for (let x = bounds[0][0] - 1; x <= bounds[1][0] + 1; x++) {
      for (let y = bounds[0][1] - 1; y <= bounds[1][1] + 1; y++) {
        for (let z = bounds[0][2] - 1; z <= bounds[1][2] + 1; z++) {
          if (!coordsSet.has(`${x}_${y}_${z}`)) {
            emptyCoords.push([x, y, z]);
          }
        }
      }
    }

    const emptyShapes = buildShapes(emptyCoords);

    // for (const s of emptyShapes) {
    //   console.log("empty", s.toString());
    // }

    const airShape = emptyShapes.find((s) => s.bounds()[0][0] < bounds[0][0])!;
    // console.log("air", airShape.toString());

    let count = 0;
    for (const c of this.coords) {
      const touchingAir = airShape.touchingFaces(c);
      count += touchingAir.length;
    }
    return count;
  }

  toString() {
    return `bounds=${this.bounds()
      .map(([x, y, z]) => `[ ${x}, ${y}, ${z} ]`)
      .join(" x ")} count=${this.coords.length}`;
  }
}

const buildShapes = (coords: Coord[]): Shape[] => {
  const shapes: Shape[] = [];

  for (const coord of coords) {
    const touchingShapes = shapes.filter((s) => s.touches(coord));
    if (touchingShapes.length === 0) {
      shapes.push(new Shape([coord]));
    } else if (touchingShapes.length === 1) {
      touchingShapes[0].coords.push(coord);
    } else {
      // More then one, join the shapes to single shape
      const [master, ...other] = touchingShapes;
      master.coords.push(coord);
      for (const shape of other) {
        master.coords.push(...shape.coords);
        shapes.splice(shapes.indexOf(shape), 1);
      }
    }
  }

  return shapes;
};

const part1: TaskPartSolution = (input) => {
  const coords = parseInput(input);
  const shape = new Shape(coords);
  return shape.faces();
};

const part2: TaskPartSolution = (input) => {
  const coords = parseInput(input);
  const shape = new Shape(coords);
  return shape.outsideFaces();
};

const task = new Task(2022, 18, part1, part2);

export default task;
