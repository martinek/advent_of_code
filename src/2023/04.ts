import Task, { TaskPartSolution } from "../utils/task.js";

interface Card {
  id: number;
  numbers: Set<number>;
  winning: Set<number>;
  points: number;
  matches: number;
  cardCount: number;
}

const cardMatches = (card: Card): number => {
  let res = 0;

  card.winning.forEach((n) => {
    if (card.numbers.has(n)) {
      res += 1;
    }
  });

  return res;
};
const cardPoints = (card: Card): number => {
  let res = 0;

  card.winning.forEach((n) => {
    if (card.numbers.has(n)) {
      if (res === 0) res = 1;
      else res = res * 2;
    }
  });

  return res;
};

const parseCards = (input: string): Card[] => {
  return input.split("\n").map((row) => {
    const [card, rest] = row.split(": ");
    const [winning, numbers] = rest.split(" | ").map((pt) => {
      const nums = pt
        .trim()
        .split(/\W+/)
        .map((s) => Number(s));
      return new Set(nums);
    });
    const c: Card = {
      id: Number(card.slice(5).trim()) - 1,
      numbers,
      winning,
      matches: 0,
      points: 0,
      cardCount: -1,
    };
    c.matches = cardMatches(c);
    c.points = cardPoints(c);
    return c;
  });
};

const getCardCount = (cards: Card[], card: Card): number => {
  if (card.cardCount === -1) {
    if (card.matches === 0) {
      card.cardCount = 1;
    } else {
      const copies = cards.slice(card.id + 1, card.id + 1 + card.matches);
      // console.log(
      //   "copies",
      //   copies.map((c) => c.id)
      // );
      card.cardCount = 1 + copies.reduce((acc, c) => acc + getCardCount(cards, c), 0);
      // console.log(card.cardCount);
    }
  }

  return card.cardCount;
};

const part1: TaskPartSolution = (input) => {
  const cards = parseCards(input);
  return cards.reduce((acc, n) => acc + n.points, 0);
};
const part2: TaskPartSolution = (input) => {
  const cards = parseCards(input);

  return (
    cards
      // .filter((c) => c.matches > 0)
      .map((c) => {
        getCardCount(cards, c);
        // console.log(c);
        // console.log(c.id, c.cardCount);
        return c;
      })
      .reduce((acc, c) => acc + c.cardCount, 0)
  );
};

const task = new Task(2023, 4, part1, part2, {
  part1: {
    input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
    result: "13",
  },
  part2: {
    input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
    result: "30",
  },
});

export default task;
