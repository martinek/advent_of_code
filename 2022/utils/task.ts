import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export type TaskPartSolution = (input: string) => string;

class Task {
  day: number;
  partOne: TaskPartSolution | undefined;
  partTwo: TaskPartSolution | undefined;

  constructor(day: number, partOne?: TaskPartSolution | undefined, partTwo?: TaskPartSolution | undefined) {
    this.day = day;
    this.partOne = partOne;
    this.partTwo = partTwo;
  }

  async exec(part: string | undefined): Promise<[string | undefined, string | undefined]> {
    const input = await this.loadInput();

    const partOneResult = part === undefined || part === "1" ? this.partOne?.(input) : "-";
    const partTwoResult = part === undefined || part === "2" ? this.partTwo?.(input) : "-";

    return [partOneResult, partTwoResult];
  }

  private async fetchInput() {
    const url = `https://adventofcode.com/2022/day/${this.day}/input`;
    const USER_AGENT = process.env["USER_AGENT"];
    const SESSION = process.env["SESSION"];

    if (USER_AGENT == null || SESSION == null) {
      console.error("Missing USER_AGENT or SESSION env variable");
      process.exit(1);
    }

    const headers = {
      "user-agent": USER_AGENT,
      cookie: `session=${SESSION}`,
    };

    const result = await fetch(url, { headers });
    if (result.status !== 200) {
      console.error("Could not load input:", await result.text());
      process.exit(1);
    }

    return await result.text();
  }

  private async loadInput() {
    const cachePath = path.dirname("") + "/.cache";
    if (!fs.existsSync(cachePath)) {
      console.log("Creating input cache");
      fs.mkdirSync(cachePath);
    }

    const inputPath = cachePath + `/${this.day}_input.txt`;
    if (!fs.existsSync(inputPath)) {
      const input = await this.fetchInput();
      fs.writeFileSync(inputPath, input);
    }

    return fs.readFileSync(inputPath).toString();
  }
}

export default Task;
