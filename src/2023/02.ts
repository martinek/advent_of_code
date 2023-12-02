import Task, { TaskPartSolution } from "../utils/task.js";

type GameSet = Record<string, number>;

const parseGames = (input: string, query?: GameSet) => {
  return input.split("\n").map((row) => {
    const [gameText, statsText] = row.split(": ");
    const gameId = Number(gameText.slice(5));
    const minSet: GameSet = {};
    const sets = statsText.split("; ").map((set) => {
      return set.split(", ").reduce<GameSet>((acc, item) => {
        const [count, color] = item.split(" ");
        acc[color] = Number(count);
        if (minSet[color] == null || minSet[color] < acc[color]) {
          minSet[color] = acc[color];
        }
        return acc;
      }, {});
    });
    const possibleSets = query
      ? sets.filter((set) => {
          for (const color in set) {
            if (query[color] < set[color]) return false;
          }
          return true;
        })
      : [];

    const power = setPower(minSet);
    return { gameId, sets, possibleSets, minSet, power: setPower(minSet) };
  });
};

const setPower = (set: GameSet): number => {
  return Object.values(set).reduce((acc, n) => acc * n, 1);
};

const part1: TaskPartSolution = (input) => {
  const query: GameSet = {
    red: 12,
    green: 13,
    blue: 14,
  };
  const games = parseGames(input, query);
  const possibleGames = games.filter((g) => g.sets.length === g.possibleSets.length);
  return possibleGames.reduce((acc, { gameId }) => acc + gameId, 0);
};
const part2: TaskPartSolution = (input) => {
  const games = parseGames(input);
  return games.reduce((acc, { power }) => acc + power, 0);
};

const task = new Task(2023, 2, part1, part2, {
  part1: {
    input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
    result: "8",
  },
  part2: {
    input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
    result: "2286",
  },
});

export default task;
