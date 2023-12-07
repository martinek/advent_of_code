import Task, { TaskPartSolution } from "../utils/task.js";

interface Hand {
  cards: string;
  bid: number;
  level: number;
}

const parseHands = (input: string): Hand[] => {
  return input
    .split("\n")
    .map((r) => r.split(/\W+/))
    .map(([cards, bidString]): Hand => ({ cards, bid: Number(bidString), level: -1 }));
};

/*
7 - Five of a kind, where all five cards have the same label: AAAAA
6 - Four of a kind, where four cards have the same label and one card has a different label: AA8AA
5 - Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
4 - Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
3 - Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
2 - One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
1 - High card, where all cards' labels are distinct: 23456
*/
const cardsLevel = (cards: string, withJokers?: boolean): number => {
  let nums = Object.entries(
    cards.split("").reduce<Record<string, number>>((acc, c) => {
      acc[c] = acc[c] ?? 0;
      acc[c] += 1;
      return acc;
    }, {})
  );

  nums.sort((a, b) => a[1] - b[1]).reverse();

  if (withJokers) {
    const jokerCount = nums.find((n) => n[0] === "J")?.[1] ?? 0;
    // Just add jokers to the largest number, if that is not jokes themselves
    if (jokerCount > 0) {
      // remove jokers
      nums = nums.filter((n) => n[0] !== "J");

      if (nums.length === 0) {
        // All items were jokers, just add back 5 of aces
        nums = [["A", 5]];
      } else {
        nums[0][1] += jokerCount;
      }
    }
  }

  nums.sort((a, b) => a[1] - b[1]).reverse();
  const counts = nums.map((n) => n[1]);

  let level = 1;
  if (counts[0] === 5) level = 7; // 5 same
  else if (counts[0] === 4) level = 6; // 4 same
  else if (counts[0] === 3 && counts[1] === 2) level = 5; // fullhouse
  else if (counts[0] === 3) level = 4; // 3 same
  else if (counts[0] === 2 && counts[1] === 2) level = 3; // 2+2 same
  else if (counts[0] === 2) level = 2; // 2 same
  return level;
};

const chars = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"].reverse();
const charRank = chars.reduce<Record<string, number>>((acc, c, i) => {
  acc[c] = i;
  return acc;
}, {});
const charsJoker = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"].reverse();
const charRankJoker = charsJoker.reduce<Record<string, number>>((acc, c, i) => {
  acc[c] = i;
  return acc;
}, {});
const compareCards = (a: Hand, b: Hand, withJokers?: boolean): number => {
  for (let i = 0; i < a.cards.length; i++) {
    if (a.cards[i] === b.cards[i]) continue;
    if (withJokers) {
      return charRankJoker[a.cards[i]] - charRankJoker[b.cards[i]];
    } else {
      return charRank[a.cards[i]] - charRank[b.cards[i]];
    }
  }
  return 0;
};

const compareHands = (a: Hand, b: Hand): number => {
  if (a.level === b.level) {
    return compareCards(a, b);
  }
  return a.level - b.level;
};

const compareHandsWithJokers = (a: Hand, b: Hand): number => {
  if (a.level === b.level) {
    return compareCards(a, b, true);
  }
  return a.level - b.level;
};

const part1: TaskPartSolution = (input) => {
  const hands = parseHands(input);
  hands.forEach((h) => (h.level = cardsLevel(h.cards)));
  hands.sort(compareHands);
  // console.log(hands);
  const res = hands.reduce((acc, h, i) => {
    const rank = i + 1;
    // console.log(h.cards, h.bid, rank);
    return acc + h.bid * rank;
  }, 0);

  return res;
};
const part2: TaskPartSolution = (input) => {
  const hands = parseHands(input);
  hands.forEach((h) => (h.level = cardsLevel(h.cards, true)));
  hands.sort(compareHandsWithJokers);

  // console.log(hands);

  const res = hands.reduce((acc, h, i) => {
    const rank = i + 1;
    // console.log(h.cards, h.bid, rank);
    return acc + h.bid * rank;
  }, 0);

  return res;
};

const task = new Task(2023, 7, part1, part2, {
  part1: {
    input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
    result: "6440",
  },
  part2: {
    input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
    result: "5905",
  },
});

export default task;

// start ~6:40, end 7:27
