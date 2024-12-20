import fs from "fs";

const stars = {
  // Y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5]
  2024: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  2023: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  2022: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 2, 0, 1],
  2021: [2, 2, 2, 2],
  2016: [2, 2, 2, 1, 0, 2],
  2015: [2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 2, 0, 0, 0, 2],
};

const taskPath = (year: number, day: number) => `src/${year}/${(day + 1).toString().padStart(2, "0")}.ts`;

const star = (year: number, day: number, count: number | undefined) => {
  const d = (day + 1).toString().padStart(2, "0");
  switch (count) {
    case 0:
      return `![Day](https://badgen.net/badge/${d}/%E2%98%86%E2%98%86/gray)`;
    case 1:
      return `[![Day](https://badgen.net/badge/${d}/%E2%98%85%E2%98%86/yellow)](${taskPath(year, day)})`;
    case 2:
      return `[![Day](https://badgen.net/badge/${d}/%E2%98%85%E2%98%85/green)](${taskPath(year, day)})`;
    default:
      return `![Day](https://badgen.net/badge/${d}/%E2%98%86%E2%98%86/gray)`;
  }
};

const updateReadme = async () => {
  const content = fs.readFileSync("./README.md").toString();

  const starsContent = Object.entries(stars)
    .sort(([y1], [y2]) => Number(y2) - Number(y1))
    .map(([y, stars]) => {
      const year = Number(y);
      const total = stars.reduce((acc, count) => acc + count, 0);
      return (
        "## " +
        `${year}: ${total} ★` +
        "\n\n" +
        stars.map((count, day) => star(year, day, count) + ((day + 1) % 8 === 0 ? "  " : "") + "\n").join("")
      );
    })
    .join("\n\n");

  const newContent = content.replace(
    /<!-- stars -->[.\s\S]*<!-- \/stars -->/m,
    `<!-- stars -->\n\n${starsContent}\n\n<!-- /stars -->`
  );

  fs.writeFileSync("./README.md", newContent);
};

updateReadme();
