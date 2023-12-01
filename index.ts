import dotenv from "dotenv";
import Task from "./src/utils/task";
dotenv.config();

import { Command } from "commander";
import fs from "fs";

const program = new Command().argument("<string>", "task identifier in form of YYYY-DD or YYYY-DD-P");

const invalidTarget = (t?: string) => {
  console.log(`Missing / invalid task identifier${t ? ` (${t})` : ""}
  Use format YYYY-DD-P where:
    YYYY - Year, optional. If omitted, current year will be used.
    DD   - Day, required. Uses two digit format (ie. 04)
    P    - Task part, optional. If ommited, both parts will be run.
  `);
  process.exit(1);
};

interface Target {
  year: string;
  day: string;
  part?: string;
}

const parseTarget = (target?: string): Target => {
  if (target == null) {
    return invalidTarget(target);
  }

  let [year, day, part] = target.split("-");
  if (year.length === 2) {
    part = day;
    day = year;
    year = new Date().getFullYear().toString();
  }

  if (year.length !== 4 || day.length !== 2 || (part != null && part.length !== 1)) {
    return invalidTarget(`${year}-${day}-${part}`);
  }

  return { year, day, part };
};

const getTask = async (target: Target): Promise<Task> => {
  const { year, day } = target;
  if (!fs.existsSync(`./src/${year}/${day}.ts`)) {
    const template = fs.readFileSync(`./src/utils/_template.ts.txt`).toString();
    const taskFileContent = template
      .replaceAll("%YEAR%", Number(year).toString())
      .replaceAll("%DAY%", Number(day).toString());
    fs.writeFileSync(`./src/${year}/${day}.ts`, taskFileContent);
  }

  const task = (await import(`./src/${year}/${day}.js`)).default as Task;
  return task;
};

const resolveTask = async (): Promise<{ target: Target; task: Task }> => {
  const options = program.parse();
  const target = parseTarget(options.args[0]);
  const task = await getTask(target);
  return { target, task };
};

async function main() {
  const { target, task } = await resolveTask();
  console.log(`Running day #${target.day}!`);
  const results = await task.exec(target.part);
  console.log(results);
}

main();
