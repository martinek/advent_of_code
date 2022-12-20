import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`;

interface Cost {
  ore: number;
  clay: number;
  obsidian: number;
}

type RobotType = "ore" | "clay" | "obs" | "geo";

interface State {
  timeLeft: number;
  oreRobots: number;
  clayRobots: number;
  obsidianRobots: number;
  geodeRobots: number;
  ore: number;
  clay: number;
  obsidian: number;
  geode: number;
  nextRobot: RobotType;
}

const addResources = (state: State, time = 1): State => ({
  ...state,
  ore: state.ore + state.oreRobots * time,
  clay: state.clay + state.clayRobots * time,
  obsidian: state.obsidian + state.obsidianRobots * time,
  geode: state.geode + state.geodeRobots * time,
  timeLeft: state.timeLeft - time,
});

const applyBp = (state: State, bp: Blueprint, build: RobotType): State => {
  switch (build) {
    case "ore":
      return { ...state, oreRobots: state.oreRobots + 1, ore: state.ore - bp.oreCost.ore };
    case "clay":
      return { ...state, clayRobots: state.clayRobots + 1, ore: state.ore - bp.clayCost.ore };
    case "obs":
      return {
        ...state,
        obsidianRobots: state.obsidianRobots + 1,
        ore: state.ore - bp.obsidianCost.ore,
        clay: state.clay - bp.obsidianCost.clay,
      };
    case "geo":
      return {
        ...state,
        geodeRobots: state.geodeRobots + 1,
        ore: state.ore - bp.geodeCost.ore,
        obsidian: state.obsidian - bp.geodeCost.obsidian,
      };
  }
};

const validateState = (state: State, bp: Blueprint, currentBest: number): boolean => {
  if (state.timeLeft <= 0) return false; // time is up
  // next robot would be over the "cap" (no need to have more then X robots, if we can use at most X in one step)
  switch (state.nextRobot) {
    case "ore":
      if (state.oreRobots >= bp.maxRobots.ore) return false;
    case "clay":
      if (state.clayRobots >= bp.maxRobots.clay) return false;
    case "obs":
      if (state.obsidianRobots >= bp.maxRobots.obs) return false;
  }
  // we need clay robots for obs robot
  if (state.nextRobot === "obs" && state.clayRobots === 0) return false;
  // we need obs robots for geo robot
  if (state.nextRobot === "geo" && state.obsidianRobots === 0) return false;

  const possibleMax = state.geode + state.geodeRobots * state.timeLeft + (state.timeLeft * state.timeLeft) / 2;
  if (possibleMax < currentBest) return false;

  return true;
};

const stateStr = (state: State) =>
  `${state.timeLeft} - ${state.ore}(${state.oreRobots}) ${state.clay}(${state.clayRobots}) ${state.obsidian}(${state.obsidianRobots}) ${state.geode}(${state.geodeRobots}) | ${state.nextRobot}`;

const nextStates = (state: State, bp: Blueprint, maxRef: { max: number }): State[] => {
  // console.log("[nextStates] state", stateStr(state));
  if (state.timeLeft <= 0) return [];

  const baseState = addResources(state);
  if (maxRef.max < baseState.geode) {
    console.log("NEW MAX", maxRef.max, stateStr(baseState));
    maxRef.max = baseState.geode;
  }
  let nextState: State;

  switch (state.nextRobot) {
    case "ore": {
      if (bp.oreCost.ore <= state.ore) {
        nextState = applyBp(baseState, bp, "ore");
        break;
      } else {
        return [baseState];
      }
    }
    case "clay": {
      if (bp.clayCost.ore <= state.ore) {
        nextState = applyBp(baseState, bp, "clay");
        break;
      } else {
        return [baseState];
      }
    }
    case "obs": {
      if (bp.obsidianCost.ore <= state.ore && bp.obsidianCost.clay <= state.clay) {
        nextState = applyBp(baseState, bp, "obs");
        break;
      } else {
        return [baseState];
      }
    }
    case "geo": {
      if (bp.geodeCost.ore <= state.ore && bp.geodeCost.obsidian <= state.obsidian) {
        nextState = applyBp(baseState, bp, "geo");
        if (nextState.obsidianRobots >= bp.geodeCost.obsidian && nextState.oreRobots >= bp.geodeCost.ore) {
          return [{ ...nextState, nextRobot: "geo" as RobotType }];
        }
        break;
      } else {
        return [baseState];
      }
    }
  }

  // console.log("[nextStates] nextState", stateStr(nextState));

  // Return "time-shifted" states to when the next robot will be built
  // return (["ore", "clay", "obs", "geo"] as RobotType[])
  //   .map((nextRobot) => {
  //     let nextReadyIn: number;
  //     switch (nextRobot) {
  //       case "ore":
  //         nextReadyIn = Math.ceil(bp.oreCost.ore / nextState.oreRobots);
  //         break;
  //       case "clay":
  //         nextReadyIn = Math.ceil(bp.clayCost.ore / nextState.oreRobots);
  //         break;
  //       case "obs":
  //         nextReadyIn = Math.max(
  //           Math.ceil(bp.obsidianCost.ore / nextState.oreRobots),
  //           Math.ceil(bp.obsidianCost.clay / nextState.clayRobots)
  //         );
  //         break;
  //       case "geo":
  //         nextReadyIn = Math.max(
  //           Math.ceil(bp.geodeCost.ore / nextState.oreRobots),
  //           Math.ceil(bp.geodeCost.obsidian / nextState.obsidianRobots)
  //         );
  //         break;
  //     }
  //     return { ...addResources(nextState, nextReadyIn - 1), nextRobot };
  //   })
  //   .filter((s) => validateState(s, bp, maxRef.max));

  return [
    { ...nextState, nextRobot: "ore" as RobotType },
    { ...nextState, nextRobot: "clay" as RobotType },
    { ...nextState, nextRobot: "obs" as RobotType },
    { ...nextState, nextRobot: "geo" as RobotType },
  ].filter((s) => validateState(s, bp, maxRef.max));
};

class Blueprint {
  id: number;
  oreCost: Cost;
  clayCost: Cost;
  obsidianCost: Cost;
  geodeCost: Cost;

  maxRobots: { [key in RobotType]: number };

  constructor(i: string) {
    const matches = i.match(
      /^[^\d]+(\d+):[^\d]+(\d+) ore[^\d]+(\d+) ore[^\d]+(\d+) ore[^\d]+(\d+) clay[^\d]+(\d+) ore[^\d]+(\d+) obsidian.*$/
    );
    if (!matches) throw new Error(`Error parsing input: ${i}`);
    const values = matches.map(Number);
    this.id = values[1];
    this.oreCost = { ore: values[2], clay: 0, obsidian: 0 };
    this.clayCost = { ore: values[3], clay: 0, obsidian: 0 };
    this.obsidianCost = { ore: values[4], clay: values[5], obsidian: 0 };
    this.geodeCost = { ore: values[6], clay: 0, obsidian: values[7] };

    this.maxRobots = {
      ore: Math.max(values[2], values[3], values[4], values[6]),
      clay: values[5],
      obs: values[7],
      geo: Infinity,
    };
  }

  findMax(time: number) {
    const states: State[] = [
      {
        clay: 0,
        clayRobots: 0,
        geode: 0,
        geodeRobots: 0,
        obsidian: 0,
        obsidianRobots: 0,
        ore: 0,
        oreRobots: 1,
        nextRobot: "ore",
        timeLeft: time,
      },
      {
        clay: 0,
        clayRobots: 0,
        geode: 0,
        geodeRobots: 0,
        obsidian: 0,
        obsidianRobots: 0,
        ore: 0,
        oreRobots: 1,
        nextRobot: "clay",
        timeLeft: time,
      },
    ];

    const max = { max: 0 };
    const visitedStates: { [time: number]: { [stateKey: string]: number } } = {};
    for (let i = 0; i <= time; i++) {
      visitedStates[i] = {};
    }

    let i = 0;
    const start = performance.now();

    while (states.length > 0) {
      i++;
      const state = states.pop()!;

      // if (state.geode > maxGeodeCount) {
      //   console.log("NEW MAX", state.geode, states.length);
      //   maxGeodeCount = state.geode;
      // }
      if (i % 1000000 === 0) {
        const time = performance.now() - start;
        const perMS = i / time;
        // console.log(i, ":", states.length, Object.keys(visitedStates[state.timeLeft]).length);
        console.log(`[${time}]`, i, ":", states.length, `${(perMS * 1000).toFixed(2)}/s`);
      }
      states.push(...nextStates(state, this, max));
    }

    console.log(`FINISHED BP #${this.id}: ${max.max} in ${i} checks`);
    return max.max;
  }
}

const parseInput = (i: string): Blueprint[] => {
  return i.split("\n").map((row) => new Blueprint(row));
};

const part1: TaskPartSolution = (input) => {
  const bpts = parseInput(input);
  const time = 24;
  const qualities = bpts.map((bpt) => bpt.id * bpt.findMax(time));

  console.log(qualities);

  return qualities.reduce((acc, n) => acc + n, 0);
};

const part2: TaskPartSolution = (input) => {
  const bpts = parseInput(input).slice(0, 3);
  const time = 32;
  const maxes = bpts.map((bpt) => bpt.findMax(time));

  console.log(maxes);

  return maxes.reduce((acc, n) => acc * n, 1);
};

const task = new Task(2022, 19, part1, part2);

export default task;
