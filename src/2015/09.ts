import Task, { TaskPartSolution } from "../utils/task.js";

const permutator = <T>(inputArr: T[]): T[][] => {
  const result: T[][] = [];

  const permute = (arr: T[], m: T[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
};

const part1: TaskPartSolution = (input) => {
  const distances = input
    .trim()
    .split("\n")
    .map((line) => {
      const [_, from, to, distance] = line.match(/(\w+) to (\w+) = (\d+)/) as RegExpMatchArray;
      return { from, to, distance: Number(distance) };
    });

  const cities = new Set(distances.flatMap((d) => [d.from, d.to]));
  const permutations = Array.from(permutator([...cities]));

  const shortestDistance = permutations.reduce((shortest, permutation) => {
    const distance = permutation.reduce((sum, city, i) => {
      if (i === 0) return sum;
      const prevCity = permutation[i - 1];
      const d = distances.find((d) => (d.from === city && d.to === prevCity) || (d.to === city && d.from === prevCity));
      if (!d) throw new Error(`No distance found between ${city} and ${prevCity}`);
      return sum + d.distance;
    }, 0);
    return Math.min(shortest, distance);
  }, Infinity);

  return shortestDistance.toString();
};
const part2: TaskPartSolution = (input) => {
  const distances = input
    .trim()
    .split("\n")
    .map((line) => {
      const [_, from, to, distance] = line.match(/(\w+) to (\w+) = (\d+)/) as RegExpMatchArray;
      return { from, to, distance: Number(distance) };
    });

  const cities = new Set(distances.flatMap((d) => [d.from, d.to]));
  const permutations = Array.from(permutator([...cities]));

  const longestDistance = permutations.reduce((longest, permutation) => {
    const distance = permutation.reduce((sum, city, i) => {
      if (i === 0) return sum;
      const prevCity = permutation[i - 1];
      const d = distances.find((d) => (d.from === city && d.to === prevCity) || (d.to === city && d.from === prevCity));
      if (!d) throw new Error(`No distance found between ${city} and ${prevCity}`);
      return sum + d.distance;
    }, 0);
    return Math.max(longest, distance);
  }, 0);

  return longestDistance.toString();
};

const task = new Task(2015, 9, part1, part2, {
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
