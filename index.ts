import dotenv from "dotenv";
import Task from "./src/utils/task";
import fs from "fs";
dotenv.config();

const invalidTarget = (t?: string) => {
  console.log(`Missing / invalid task identifier${t ? ` (${t})` : ""}
  Use format YYYY-DD-P where:
    YYYY - Year, optional. If omitted, current year will be used.
    DD   - Day, required. Uses two digit format (ie. 04)
    P    - Task part, optional. If ommited, both parts will be run.
  `);
  process.exit(1);
};

async function main() {
  const target = process.argv[2];
  if (target == null) {
    return invalidTarget();
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

  console.log(`Running day #${day}!`);

  if (!fs.existsSync(`./src/${year}/${day}.ts`)) {
    const template = fs.readFileSync(`./src/utils/_template.ts.txt`).toString();
    const taskFileContent = template
      .replaceAll("%YEAR%", Number(year).toString())
      .replaceAll("%DAY%", Number(day).toString());
    fs.writeFileSync(`./src/${year}/${day}.ts`, taskFileContent);
  }

  const task = (await import(`./src/${year}/${day}.js`)).default as Task;
  const results = await task.exec(part);

  console.log(results);
}

main();
