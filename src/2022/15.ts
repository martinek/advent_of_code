import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

interface Point {
  x: number;
  y: number;
}

const parseInput = (input: string): [Point, Point, number][] =>
  input
    .split("\n")
    .map((r) => r.match(/Sensor at x=(\-?\d+), y=(\-?\d+): closest beacon is at x=(\-?\d+), y=(\-?\d+)/)!)
    .map(([_, x1, y1, x2, y2]) => {
      const sensor = { x: Number(x1), y: Number(y1) };
      const beacon = { x: Number(x2), y: Number(y2) };
      return [sensor, beacon, dist(sensor, beacon)];
    });

const str = (pt: Point) => `${pt.x}_${pt.y}`;
const dist = (pt: Point, pt1: Point) => Math.abs(pt.x - pt1.x) + Math.abs(pt.y - pt1.y);

const part1: TaskPartSolution = (input) => {
  const sensors = parseInput(input);
  console.log(sensors);

  const Y = 2000000;
  const empty = new Set<string>();
  sensors.forEach(([sensor, _beacon, d]) => {
    for (let x = sensor.x - d; x < sensor.x + d; x++) {
      const pt = { x, y: Y };
      if (dist(sensor, pt) <= d) {
        empty.add(str(pt));
      }
    }
  });

  const beacons = new Set(sensors.map(([_, beacon]) => str(beacon)));
  const tEmpty = Array.from(empty).filter((s) => !beacons.has(s));

  return tEmpty.length;
};

const part2: TaskPartSolution = (input) => {
  const sensors = parseInput(input);

  const MAX = 4000000;

  let target: Point | undefined = undefined;
  rows: for (let ty = 0; ty <= MAX; ty++) {
    const rowSens = sensors.filter(([{ y }, _, d]) => Math.abs(y - ty) <= d);

    const ranges = rowSens
      .map(([{ x, y }, _, d]) => {
        const dy = Math.abs(ty - y);
        const dx = d - dy;
        return [x - dx, x + dx];
      })
      .sort(([s1], [s2]) => s1 - s2);

    let max = 0;
    for (const [start, end] of ranges) {
      if (start > max + 1) {
        const x = max + 1;
        const y = ty;
        target = { x, y };
        break rows;
      }
      max = Math.max(max, end);
      if (end > MAX) {
        continue rows;
      }
    }
  }

  if (target === undefined) {
    console.log("not found");
    return;
  }

  console.log(target);
  const frequency = target.x * MAX + target.y;
  return frequency;
};

const task = new Task(2022, 15, part1, part2);

export default task;
