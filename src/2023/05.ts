import Task, { TaskPartSolution } from "../utils/task.js";

interface Transform {
  from: number;
  from_end: number;
  to: number;
  range: number;
}

const parseSeeds = (input: string): number[] => {
  return input.slice(7).split(" ").map(Number);
};

interface Seed {
  from: number;
  from_end: number;
  range: number;
}

const parseSeeds2 = (input: string): Seed[] => {
  let nums = input.slice(7).split(" ").map(Number);
  const seeds: Seed[] = [];
  while (nums.length > 0) {
    let [from, range, ...res] = nums;
    nums = res;
    seeds.push({ from, from_end: from + range, range });
  }
  return seeds;
};

const parseTransforms = (input: string): Transform[] => {
  const [_, ...transformInputs] = input.split("\n");
  return transformInputs
    .map((r) => {
      const [to, from, range] = r.split(" ").map(Number);
      return { from, from_end: from + range, to, range };
    })
    .sort((a, b) => a.from - b.from);
};

const part1: TaskPartSolution = (input) => {
  const [seedsInput, ...transformsInput] = input.split("\n\n");
  const seeds = parseSeeds(seedsInput);
  const transforms = transformsInput.map(parseTransforms);

  const res = seeds.map((seed) => {
    // console.log(`Transforming seed ${seed}`);
    return transforms.reduce((n, transform) => {
      const t = transform.find((t) => t.from <= n && t.from + t.range >= n);
      if (t != null) {
        const r = n + (t.to - t.from);
        // console.log(`change ${n} with`, t, `to ${r}`);
        return r;
      } else {
        // console.log(`keep ${n}`);
        return n;
      }
    }, seed);
  });

  return Math.min(...res);
};
const part2: TaskPartSolution = (input) => {
  const [seedsInput, ...transformsInput] = input.split("\n\n");
  const seeds = parseSeeds2(seedsInput);
  const transforms = transformsInput.map(parseTransforms);

  // console.log(transforms);

  const res = seeds.map((seed) => {
    // console.log("\n\n", { seed });
    return transforms.reduce(
      (ranges, transform) => {
        // find where ranges overlap with transforms and create new ranges
        const res = ranges.flatMap((range) => {
          // console.log("range", range);
          const relevantTransforms = transform.filter((t) => {
            // figure out transforms that are relevant for range
            return t.from <= range.from_end && range.from <= t.from_end;
          });
          // console.log("relevantTransforms", relevantTransforms);
          if (relevantTransforms.length === 0) {
            // shorthand, if there is no overlap, just return original
            return [range];
          }
          const remainingRange = { ...range };
          const newRanges: Seed[] = [];

          relevantTransforms.forEach((t) => {
            // add gap before this t
            if (remainingRange.from < t.from) {
              const from = range.from;
              const from_end = t.from - 1;
              newRanges.push({ from, from_end, range: from_end - from });
              remainingRange.from = t.from;
            }

            const from = remainingRange.from;
            const from_end = Math.min(remainingRange.from_end, t.from_end);
            const d = t.to - t.from;
            newRanges.push({
              from: from + d,
              from_end: from_end + d,
              range: from_end - from,
            });

            remainingRange.from = from_end;
          });

          return newRanges;
        });

        // console.log("newRanges", res);

        return res;
      },
      [seed]
    );
  });

  const min = Math.min(...res.flat().map((s) => s.from));
  return min;
};

const task = new Task(2023, 5, part1, part2, {
  part1: {
    input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
    result: "35",
  },
  part2: {
    input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
    result: "46",
  },
});

export default task;
