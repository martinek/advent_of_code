import { PROD, SUM } from "../utils/helpers.js";
import Task, { TaskPartSolution } from "../utils/task.js";

type Point = [number, number, number];
const key = (p: Point): string => p.join(",");

const parseInput = (input: string) => {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(",").map(Number) as Point);
};

const CACHE: Record<string, number> = {};
const distR = (a: Point, b: Point) => {
  const k = `${key(a)}|${key(b)}`;
  if (CACHE[k] !== undefined) {
    return CACHE[k];
  }
  const res = Math.sqrt(
    Math.pow(Math.abs(a[0] - b[0]), 2) + Math.pow(Math.abs(a[1] - b[1]), 2) + Math.pow(Math.abs(a[2] - b[2]), 2)
  );
  CACHE[k] = res;
  return res;
};

const part1: TaskPartSolution = (input) => {
  const used = new Set<string>();
  const CONNECTIONS = 1000;
  // const CONNECTIONS = 10;
  const points = parseInput(input);

  const distances: Record<string, number> = {};
  for (let i = 0; i < points.length; i++) {
    for (let j = i; j < points.length; j++) {
      if (i === j) continue;
      const dist = distR(points[i], points[j]);
      distances[`${key(points[i])}|${key(points[j])}`] = dist;
    }
  }
  const pendingPairs = Object.entries(distances).toSorted(([_, a], [__, b]) => a - b);

  const groups: Record<string, number> = {};

  for (let c = 0; c < CONNECTIONS; c++) {
    let pair: [Point, Point] | null = pendingPairs
      .shift()?.[0]
      .split("|")
      .map((p) => p.split(",").map(Number) as Point) as [Point, Point];

    if (!pair) {
      break;
    }

    // connect two points, then update groups
    const [a, b] = pair!;
    const groupA = groups[key(a)];
    const groupB = groups[key(b)];

    used.add(key(a) + "|" + key(b));

    if (groupA != undefined && groupA === groupB) continue; // skip if same group

    if (groupA === undefined && groupB === undefined) {
      // console.log("new group");
      const newGroup = (new Date().getTime() % 1_000) + Math.random(); // unique id
      groups[key(a)] = newGroup;
      groups[key(b)] = newGroup;
    } else if (groupA === undefined) {
      // console.log("adding to group B");
      groups[key(a)] = groupB;
    } else if (groupB === undefined) {
      // console.log("adding to group A");
      groups[key(b)] = groupA;
    } else {
      // console.log("merging groups");
      // merge groups
      for (const pKey in groups) {
        if (groups[pKey] === groupB) {
          groups[pKey] = groupA;
        }
      }
    }

    // console.log(groups);
  }

  const groupSizes = Object.values(groups).reduce((acc, group) => {
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  // console.log(groupSizes);
  const sortedSizes = Object.values(groupSizes).sort((a, b) => b - a);
  // console.log(sortedSizes);
  return PROD(sortedSizes.slice(0, 3));
};
const part2: TaskPartSolution = (input) => {
  const used = new Set<string>();
  const CONNECTIONS = 10;
  const points = parseInput(input);

  const distances: Record<string, [number, Point, Point]> = {};
  for (let i = 0; i < points.length; i++) {
    for (let j = i; j < points.length; j++) {
      if (i === j) continue;
      const dist = distR(points[i], points[j]);
      distances[`${key(points[i])}|${key(points[j])}`] = [dist, points[i], points[j]];
    }
  }
  const pendingPairs = Object.entries(distances).toSorted(([_, a], [__, b]) => a[0] - b[0]);

  const groups: Record<string, number> = {};

  for (let c = 0; ; c++) {
    let [_, a, b] = pendingPairs.shift()![1];

    // connect two points, then update groups
    const groupA = groups[key(a)];
    const groupB = groups[key(b)];

    used.add(key(a) + "|" + key(b));

    if (groupA != undefined && groupA === groupB) continue; // skip if same group

    if (groupA === undefined && groupB === undefined) {
      // console.log("new group");
      const newGroup = (new Date().getTime() % 1_000) + Math.random(); // unique id
      groups[key(a)] = newGroup;
      groups[key(b)] = newGroup;
    } else if (groupA === undefined) {
      // console.log("adding to group B");
      groups[key(a)] = groupB;
    } else if (groupB === undefined) {
      // console.log("adding to group A");
      groups[key(b)] = groupA;
    } else {
      // console.log("merging groups");
      // merge groups
      for (const pKey in groups) {
        if (groups[pKey] === groupB) {
          groups[pKey] = groupA;
        }
      }
    }

    if (Object.values(groups).length === points.length) {
      return a[0] * b[0];
    }
  }
};

const task = new Task(2025, 8, part1, part2, {
  part1: {
    input: `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
    result: "40",
  },
  part2: {
    input: `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
    result: "25272",
  },
});

export default task;
