import Task, { TaskPartSolution } from "../utils/task.js";

interface Reindeer {
  name: string;
  speed: number;
  flyTime: number;
  restTime: number;
}

const parseInput = (input: string): Reindeer[] => {
  const lines = input.trim().split("\n");
  const reindeers: Reindeer[] = lines.map((r) => {
    const [name, _1, _2, speed, _3, _4, flyTime, _5, _6, _7, _8, _9, _10, restTime] = r.split(" ");
    return {
      name,
      speed: Number(speed),
      flyTime: Number(flyTime),
      restTime: Number(restTime),
    };
  });
  return reindeers;
};

const part1: TaskPartSolution = (input) => {
  const reindeers = parseInput(input);
  const raceTime = 2503;
  const distances = reindeers.map((r) => {
    const cycleTime = r.flyTime + r.restTime;
    const cycles = Math.floor(raceTime / cycleTime);
    const remaining = raceTime % cycleTime;
    const flyTime = Math.min(r.flyTime, remaining);
    const distance = cycles * r.speed * r.flyTime + flyTime * r.speed;
    return distance;
  });
  return Math.max(...distances).toString();
};
const part2: TaskPartSolution = (input) => {
  const reindeers = parseInput(input);
  const raceTime = 2503;
  const scores = new Array(reindeers.length).fill(0);
  const distances = new Array(reindeers.length).fill(0);
  for (let t = 1; t <= raceTime; t++) {
    reindeers.forEach((r, i) => {
      const cycleTime = r.flyTime + r.restTime;
      const cycles = Math.floor(t / cycleTime);
      const remaining = t % cycleTime;
      const flyTime = Math.min(r.flyTime, remaining);
      distances[i] = cycles * r.speed * r.flyTime + flyTime * r.speed;
    });
    const maxDistance = Math.max(...distances);
    distances.forEach((d, i) => {
      if (d === maxDistance) {
        scores[i]++;
      }
    });
  }
  return Math.max(...scores).toString();
};

const task = new Task(2015, 14, part1, part2, {
  part1: {
    input: ``,
    result: "",
  },
  part2: {
    input: ``,
    result: "",
  },
});

export default task;
