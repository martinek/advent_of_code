import Task, { TaskPartSolution } from "../utils/task.js";

const sampleInput = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

class Board {
  private cells: string[];
  private marks: boolean[];
  wins: boolean;
  private size = 5;

  constructor(cells: string) {
    this.cells = cells
      .split("\n")
      .map((r) => r.trim().split(/\W+/))
      .flat();
    this.marks = new Array(this.cells.length).fill(false);
    this.wins = false;
  }

  play(n: string) {
    for (const cell of this.cells) {
      if (cell === n) {
        const i = this.cells.indexOf(cell);
        this.marks[i] = true;
        this.wins = this.checkWins(i);
        break;
      }
    }
  }

  private checkWins(i: number) {
    const row = Math.floor(i / this.size);
    const hasRow = this.marks.slice(row * this.size, (row + 1) * this.size).reduce((acc, i) => acc && i, true);
    if (hasRow) return true;

    const col = Math.floor(i % this.size);
    const hasCol = new Array(this.size)
      .fill(false)
      .map((_, n) => this.marks[n * this.size + col])
      .reduce((acc, i) => acc && i, true);
    if (hasCol) return true;

    return false;
  }

  score(n: number) {
    return this.marks.map((n, i) => (n ? 0 : Number(this.cells[i]))).reduce((acc, i) => acc + i, 0) * n;
  }

  print() {
    console.log(this.cells);
    let str = "";
    for (let n = 0; n < this.marks.length; n++) {
      str += this.marks[n] ? "X" : "_";
      str += " ";
      if (n % 5 === 4) {
        str += "\n\n";
      }
    }
    console.log(str);
  }
}

const part1: TaskPartSolution = (input) => {
  const [order, ...boardsData] = input.split("\n\n");

  const boards = boardsData.map((b) => new Board(b));

  const letters = order.split(",");

  let score: number | undefined;
  out: for (const letter of letters) {
    for (const board of boards) {
      board.play(letter);
      if (board.wins) {
        score = board.score(Number(letter));
        break out;
      }
    }
  }

  return score?.toString() ?? "";
};

const part2: TaskPartSolution = (input) => {
  const [order, ...boardsData] = input.split("\n\n");

  let boards = boardsData.map((b) => new Board(b));
  const letters = order.split(",");

  let pendingBoards = boards.length;
  let score: number | undefined;
  for (const letter of letters) {
    for (const board of boards) {
      board.play(letter);
      if (board.wins) {
        pendingBoards -= 1;
        if (pendingBoards === 0) {
          score = board.score(Number(letter));
        }
      }
    }
    boards = boards.filter((b) => !b.wins);
  }

  return score?.toString() ?? "";
};

const task = new Task(2021, 4, part1, part2);

export default task;
