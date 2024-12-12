import Task, { TaskPartSolution } from "../utils/task.js";

interface Point {
  x: number;
  y: number;
}
interface Area {
  letter: string;
  points: Point[];
}

const neighbors = (x: number, y: number) => [
  { x, y: y - 1 },
  { x: x + 1, y },
  { x, y: y + 1 },
  { x: x - 1, y },
];

const floodFill = (map: string[][], x: number, y: number) => {
  const c = map[y][x];
  const checked = new Set<string>();
  const area: Area = { letter: c, points: [] };
  const stack: Point[] = [{ x, y }];
  checked.add(`${x},${y}`);
  while (stack.length > 0) {
    const point = stack.pop();
    if (!point) {
      break;
    }
    if (map[point.y][point.x] === c) {
      area.points.push(point);

      if (point.x > 0) {
        if (!checked.has(`${point.x - 1},${point.y}`)) {
          stack.push({ x: point.x - 1, y: point.y });
          checked.add(`${point.x - 1},${point.y}`);
        }
      }
      if (point.x < map[0].length - 1) {
        if (!checked.has(`${point.x + 1},${point.y}`)) {
          stack.push({ x: point.x + 1, y: point.y });
          checked.add(`${point.x + 1},${point.y}`);
        }
      }
      if (point.y > 0) {
        if (!checked.has(`${point.x},${point.y - 1}`)) {
          stack.push({ x: point.x, y: point.y - 1 });
          checked.add(`${point.x},${point.y - 1}`);
        }
      }
      if (point.y < map.length - 1) {
        if (!checked.has(`${point.x},${point.y + 1}`)) {
          stack.push({ x: point.x, y: point.y + 1 });
          checked.add(`${point.x},${point.y + 1}`);
        }
      }
    }
  }
  return area;
};

const calcAreaPrice = (area: Area) => {
  const pts = new Set(area.points.map((p) => `${p.x},${p.y}`));
  // console.log(area.letter, pts, area.points);
  const P = area.points.reduce((p, point) => {
    neighbors(point.x, point.y).forEach((n) => {
      if (!pts.has(`${n.x},${n.y}`)) {
        p++;
      }
    });
    return p;
  }, 0);
  const A = area.points.length;
  // console.log(A, P);
  return A * P;
};

const parseAreas = (input: string): Area[] => {
  const checked = new Set<string>();
  const areas: Area[] = [];

  const map = input.split("\n").map((line) => line.split(""));
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const key = `${x},${y}`;
      if (!checked.has(key)) {
        checked.add(key);
        const area = floodFill(map, x, y);
        areas.push(area);
        area.points.forEach((p) => checked.add(`${p.x},${p.y}`));
      }
    }
  }
  return areas;
};

const part1: TaskPartSolution = (input) => {
  const areas = parseAreas(input);
  return areas.reduce((tp, area) => {
    const p = calcAreaPrice(area);
    // console.log(area.letter, p);
    return tp + p;
  }, 0);
};

interface Edge {
  a: string;
  start: number;
  end: number;
}

const mergeEdges = (edgesIn: Edge[]): Edge[] => {
  const edges = [...edgesIn];
  let merged = true;
  while (merged) {
    merged = false;

    edges.forEach((e) => {
      // start neighbor
      const sNeighbor = edges.find((ne) => ne.a === e.a && ne.end === e.start - 1);
      if (sNeighbor) {
        e.start = sNeighbor.start;
        edges.splice(edges.indexOf(sNeighbor), 1);
        merged = true;
      }
      // end neighbor
      const eNeighbor = edges.find((ne) => ne.a === e.a && ne.start === e.end + 1);
      if (eNeighbor) {
        e.end = eNeighbor.end;
        edges.splice(edges.indexOf(eNeighbor), 1);
        merged = true;
      }
    });
  }
  return edges;
};

const calcAreaPrice2 = (area: Area) => {
  const pts = new Set(area.points.map((p) => `${p.x},${p.y}`));

  const verticalEdges: Edge[] = [];
  const horizontalEdges: Edge[] = [];

  area.points.forEach((point) => {
    neighbors(point.x, point.y).forEach((n) => {
      if (!pts.has(`${n.x},${n.y}`)) {
        if (point.x === n.x) {
          verticalEdges.push({ a: `${point.y}_${n.y}`, start: point.x, end: point.x });
        } else {
          horizontalEdges.push({ a: `${point.x}_${n.x}`, start: point.y, end: point.y });
        }
      }
    });
  });

  // console.log(area.letter, verticalEdges);
  const mergedVertical = mergeEdges(verticalEdges);
  // console.log(area.letter, mergedVertical);
  // console.log(area.letter, horizontalEdges);
  const mergedHorizontal = mergeEdges(horizontalEdges);
  // console.log(area.letter, mergedHorizontal);

  // console.log("@@@", area.letter, mergedHorizontal, mergedVertical);
  const A = area.points.length;
  const P = mergedHorizontal.length + mergedVertical.length;
  // console.log(area.letter, A, P);
  return A * P;
};

const part2: TaskPartSolution = (input) => {
  const areas = parseAreas(input);
  return areas.reduce((tp, area) => {
    const p = calcAreaPrice2(area);
    // console.log(area.letter, p);
    return tp + p;
  }, 0);
};

const task = new Task(2024, 12, part1, part2, {
  part1: {
    input: `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`,
    result: "1930",
  },
  part2: {
    input: `AAAAAA
AAABBA
AAABBA
ABBAAA
ABBAAA
AAAAAA`,
    result: "368",
  },
});

export default task;

// 887168 - low
