import Task, { TaskPartSolution } from "../utils/task.js";

const part1: TaskPartSolution = (input) => {
  const points = input.split("\n").map((line) => line.split(",").map(Number));

  let max = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const area = (Math.abs(points[i][0] - points[j][0]) + 1) * (Math.abs(points[i][1] - points[j][1]) + 1);
      if (area > max) {
        max = area;
        // console.log(`New max area ${max} between points ${points[i]} and ${points[j]}`);
      }
    }
  }

  return max;
};
const pointInPath = (point: Point, path: Edge[]) => {
  let c = false;
  const [x, y] = point;
  for (let i = 0; i < path.length; i++) {
    const [p1, p2] = path[i];
    const [ax, ay] = p1;
    const [bx, by] = p2;
    if (ax === x && ay === y) {
      return true; // corner
    }
    if (ay > y !== by > y) {
      const slope = (x - ax) * (by - ay) - (bx - ax) * (y - ay);
      if (slope === 0) {
        return true; // edge
      }
      if (slope < 0 != by < ay) {
        c = !c;
      }
    }
  }
  return c;
};
type Point = [number, number];
type Edge = [Point, Point];
const eq = (p1: Point, p2: Point) => p1[0] === p2[0] && p1[1] === p2[1];
const CCW = (p1: Point, p2: Point, p3: Point) => {
  return (p3[1] - p1[1]) * (p2[0] - p1[0]) > (p2[1] - p1[1]) * (p3[0] - p1[0]);
};
const isIntersecting = (p1: Point, p2: Point, p3: Point, p4: Point) => {
  return CCW(p1, p3, p4) != CCW(p2, p3, p4) && CCW(p1, p2, p3) != CCW(p1, p2, p4);
};
const isPointOnSegment = (p: Point, segStart: Point, segEnd: Point) => {
  const [x, y] = p;
  if (segStart[0] === segEnd[0]) {
    // vertical segment
    return x === segStart[0] && y >= Math.min(segStart[1], segEnd[1]) && y <= Math.max(segStart[1], segEnd[1]);
  } else {
    // horizontal segment
    return y === segStart[1] && x >= Math.min(segStart[0], segEnd[0]) && x <= Math.max(segStart[0], segEnd[0]);
  }
};
const isValidArea = (pointA: Point, pointB: Point, edges: Edge[]) => {
  const areaPath: Point[] = [
    [Math.min(pointA[0], pointB[0]), Math.min(pointA[1], pointB[1])],
    [Math.max(pointA[0], pointB[0]), Math.min(pointA[1], pointB[1])],
    [Math.max(pointA[0], pointB[0]), Math.max(pointA[1], pointB[1])],
    [Math.min(pointA[0], pointB[0]), Math.max(pointA[1], pointB[1])],
  ];

  // Check every area edge against every polygon edge
  for (let i = 0; i < areaPath.length; i++) {
    const a = areaPath[i];
    const b = areaPath[(i + 1) % areaPath.length];

    for (const [c, d] of edges) {
      if (eq(a, c) || eq(a, d) || eq(b, c) || eq(b, d)) {
        continue; // skip shared points
      }
      if (
        isPointOnSegment(a, c, d) ||
        isPointOnSegment(b, c, d) ||
        isPointOnSegment(c, a, b) ||
        isPointOnSegment(d, a, b)
      ) {
        // console.log(`Area edge ${a} => ${b} touches polygon edge ${c} => ${d}`);
        continue; // skip touching edges
      }
      if (isIntersecting(a, b, c, d)) {
        // console.log(`Area edge ${a} => ${b} intersects polygon edge ${c} => ${d}`);
        return false;
      }
    }
  }

  for (const point of areaPath) {
    if (!pointInPath(point, edges)) {
      // console.log(`Area point ${point} is outside the polygon`);
      return false;
    }
    // console.log(`Area point ${point} is inside the polygon`);
  }

  return true;
};
const part2: TaskPartSolution = (input) => {
  const points = input.split("\n").map((line) => line.split(",").map(Number) as Point);
  const edges = points.reduce((acc, p) => {
    const next = points[(points.indexOf(p) + 1) % points.length];
    acc.push([p, next]);
    return acc;
  }, [] as Edge[]);

  let max = 0;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const area = (Math.abs(points[i][0] - points[j][0]) + 1) * (Math.abs(points[i][1] - points[j][1]) + 1);
      if (area <= max) {
        continue;
      }
      // console.log(`Checking area ${area} between points ${points[i]} and ${points[j]}`);
      if (!isValidArea(points[i], points[j], edges)) {
        // console.log(`Invalid area between points ${points[i]} and ${points[j]}\n`);
        continue;
      }
      max = area;
      // console.log(`New max area ${max} between points ${points[i]} and ${points[j]}`);
    }
  }

  return max;
};

const task = new Task(2025, 9, part1, part2, {
  part1: {
    input: `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
    result: "50",
  },
  part2: {
    input: `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
    result: "24",
  },
});

export default task;

// 591354828 low
// 690695396 low
// 1574717268
