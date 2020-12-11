// --- Day 11: Seating System ---
// Your plane lands with plenty of time to spare. The final leg of your journey is a ferry that goes directly to the tropical island where you can finally start your vacation. As you reach the waiting area to board the ferry, you realize you're so early, nobody else has even arrived yet!

// By modeling the process people use to choose (or abandon) their seat in the waiting area, you're pretty sure you can predict the best place to sit. You make a quick map of the seat layout (your puzzle input).

// The seat layout fits neatly on a grid. Each position is either floor (.), an empty seat (L), or an occupied seat (#). For example, the initial seat layout might look like this:

// L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL
// Now, you just need to model the people who will be arriving shortly. Fortunately, people are entirely predictable and always follow a simple set of rules. All decisions are based on the number of occupied seats adjacent to a given seat (one of the eight positions immediately up, down, left, right, or diagonal from the seat). The following rules are applied to every seat simultaneously:

// If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
// If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
// Otherwise, the seat's state does not change.
// Floor (.) never changes; seats don't move, and nobody sits on the floor.

// After one round of these rules, every seat in the example layout becomes occupied:

// #.##.##.##
// #######.##
// #.#.#..#..
// ####.##.##
// #.##.##.##
// #.#####.##
// ..#.#.....
// ##########
// #.######.#
// #.#####.##
// After a second round, the seats with four or more occupied adjacent seats become empty again:

// #.LL.L#.##
// #LLLLLL.L#
// L.L.L..L..
// #LLL.LL.L#
// #.LL.LL.LL
// #.LLLL#.##
// ..L.L.....
// #LLLLLLLL#
// #.LLLLLL.L
// #.#LLLL.##
// This process continues for three more rounds:

// #.##.L#.##
// #L###LL.L#
// L.#.#..#..
// #L##.##.L#
// #.##.LL.LL
// #.###L#.##
// ..#.#.....
// #L######L#
// #.LL###L.L
// #.#L###.##
// #.#L.L#.##
// #LLL#LL.L#
// L.L.L..#..
// #LLL.##.L#
// #.LL.LL.LL
// #.LL#L#.##
// ..L.L.....
// #L#LLLL#L#
// #.LLLLLL.L
// #.#L#L#.##
// #.#L.L#.##
// #LLL#LL.L#
// L.#.L..#..
// #L##.##.L#
// #.#L.LL.LL
// #.#L#L#.##
// ..L.L.....
// #L#L##L#L#
// #.LLLLLL.L
// #.#L#L#.##
// At this point, something interesting happens: the chaos stabilizes and further applications of these rules cause no seats to change state! Once people stop moving around, you count 37 occupied seats.

// Simulate your seating area by applying the seating rules repeatedly until no seats change state. How many seats end up occupied?
let fs = require("fs");
let inputText = fs.readFileSync("day-11-input.txt", "utf8");
let lines = inputText.split("\n");
let seatMatrix = lines.map((e) => e.split(""));

const ROWS = seatMatrix.length;
const COLUMNS = seatMatrix[0].length;

const isOccupied = (i, j, matrix) => {
  if (i < 0 || i >= ROWS || j < 0 || j >= COLUMNS) {
    return false;
  }

  if (matrix[i][j] === "." || matrix[i][j] === "L") {
    return false;
  }

  return true;
};

const isEmptySeat = (i, j, matrix) => matrix[i][j] === "L";
const isOccupiedSeat = (i, j, matrix) => matrix[i][j] === "#";
const isFloor = (i, j, matrix) => matrix[i][j] === ".";

const hasMoreThanNOccupiedSeats = (i, j, matrix, n) => {
  const l = { i: i - 1, j };
  const r = { i: i + 1, j };
  const u = { i, j: j - 1 };
  const d = { i, j: j + 1 };

  const lu = { i: i - 1, j: j - 1 };
  const ld = { i: i - 1, j: j + 1 };
  const ru = { i: i + 1, j: j - 1 };
  const rd = { i: i + 1, j: j + 1 };

  const allAddyacents = [l, r, u, d, lu, ld, ru, rd];

  let seatsOccupied = 0;

  for (let ady of allAddyacents) {
    if (isOccupied(ady.i, ady.j, matrix)) {
      seatsOccupied++;
    }
  }

  return seatsOccupied >= n;
};

const dontHaveOccupiedAdyacents = (i, j, matrix) => {
  const l = { i: i - 1, j };
  const r = { i: i + 1, j };
  const u = { i, j: j - 1 };
  const d = { i, j: j + 1 };

  const lu = { i: i - 1, j: j - 1 };
  const ld = { i: i - 1, j: j + 1 };
  const ru = { i: i + 1, j: j - 1 };
  const rd = { i: i + 1, j: j + 1 };

  return (
    !isOccupied(l.i, l.j, matrix) &&
    !isOccupied(r.i, r.j, matrix) &&
    !isOccupied(u.i, u.j, matrix) &&
    !isOccupied(d.i, d.j, matrix) &&
    !isOccupied(lu.i, lu.j, matrix) &&
    !isOccupied(ld.i, ld.j, matrix) &&
    !isOccupied(ru.i, ru.j, matrix) &&
    !isOccupied(rd.i, rd.j, matrix)
  );
};

const isEquals = (matrixA, matrixB) => {
  for (let i = 0; i < matrixA.length; i++) {
    for (let j = 0; j < matrixA[0].length; j++) {
      if (matrixA[i][j] !== matrixB[i][j]) {
        return false;
      }
    }
  }
  return true;
};

const partOne = () => {
  const doSeat = (prevMatrix) => {
    let currentMatrix = prevMatrix.map((e) => e.slice());

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        if (
          isEmptySeat(i, j, prevMatrix) &&
          dontHaveOccupiedAdyacents(i, j, prevMatrix)
        ) {
          currentMatrix[i][j] = "#";
        } else if (
          isOccupiedSeat(i, j, prevMatrix) &&
          hasMoreThanNOccupiedSeats(i, j, prevMatrix, 4)
        ) {
          currentMatrix[i][j] = "L";
        }
      }
    }

    if (!isEquals(currentMatrix, prevMatrix)) {
      return doSeat(currentMatrix);
    }

    return currentMatrix;
  };

  const finalMatrix = doSeat(seatMatrix);

  let occupiedSeats = 0;
  finalMatrix.forEach((array) =>
    array.forEach((e) => {
      if (e === "#") occupiedSeats++;
    })
  );

  return occupiedSeats;
};

console.log("Part one:", partOne());

// --- Part Two ---
// As soon as people start to arrive, you realize your mistake. People don't just care about adjacent seats - they care about the first seat they can see in each of those eight directions!

// Now, instead of considering just the eight immediately adjacent seats, consider the first seat in each of those eight directions. For example, the empty seat below would see eight occupied seats:

// .......#.
// ...#.....
// .#.......
// .........
// ..#L....#
// ....#....
// .........
// #........
// ...#.....
// The leftmost empty seat below would only see one empty seat, but cannot see any of the occupied ones:

// .............
// .L.L.#.#.#.#.
// .............
// The empty seat below would see no occupied seats:

// .##.##.
// #.#.#.#
// ##...##
// ...L...
// ##...##
// #.#.#.#
// .##.##.
// Also, people seem to be more tolerant than you expected: it now takes five or more visible occupied seats for an occupied seat to become empty (rather than four or more from the previous rules). The other rules still apply: empty seats that see no occupied seats become occupied, seats matching no rule don't change, and floor never changes.

// Given the same starting layout as above, these new rules cause the seating area to shift around as follows:

// L.LL.LL.LL
// LLLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLLL
// L.LLLLLL.L
// L.LLLLL.LL
// #.##.##.##
// #######.##
// #.#.#..#..
// ####.##.##
// #.##.##.##
// #.#####.##
// ..#.#.....
// ##########
// #.######.#
// #.#####.##
// #.LL.LL.L#
// #LLLLLL.LL
// L.L.L..L..
// LLLL.LL.LL
// L.LL.LL.LL
// L.LLLLL.LL
// ..L.L.....
// LLLLLLLLL#
// #.LLLLLL.L
// #.LLLLL.L#
// #.L#.##.L#
// #L#####.LL
// L.#.#..#..
// ##L#.##.##
// #.##.#L.##
// #.#####.#L
// ..#.#.....
// LLL####LL#
// #.L#####.L
// #.L####.L#
// #.L#.L#.L#
// #LLLLLL.LL
// L.L.L..#..
// ##LL.LL.L#
// L.LL.LL.L#
// #.LLLLL.LL
// ..L.L.....
// LLLLLLLLL#
// #.LLLLL#.L
// #.L#LL#.L#
// #.L#.L#.L#
// #LLLLLL.LL
// L.L.L..#..
// ##L#.#L.L#
// L.L#.#L.L#
// #.L####.LL
// ..#.#.....
// LLL###LLL#
// #.LLLLL#.L
// #.L#LL#.L#
// #.L#.L#.L#
// #LLLLLL.LL
// L.L.L..#..
// ##L#.#L.L#
// L.L#.LL.L#
// #.LLLL#.LL
// ..#.L.....
// LLL###LLL#
// #.LLLLL#.L
// #.L#LL#.L#
// Again, at this point, people stop shifting around and the seating area reaches equilibrium. Once this occurs, you count 26 occupied seats.

// Given the new visibility method and the rule change for occupied seats becoming empty, once equilibrium is reached, how many seats end up occupied?

const isLineOccupied = (i, j, matrix, line) => {
  let lineOccupied = false;
  let continueSearch = true;
  let di = i,
    dj = j;

  while (continueSearch) {
    switch (line) {
      case "u":
        dj--;
        break;
      case "d":
        dj++;
        break;
      case "r":
        di++;
        break;
      case "l":
        di--;
        break;
      case "lu":
        di--;
        dj--;
        break;
      case "ld":
        di--;
        dj++;
        break;
      case "ru":
        di++;
        dj--;
        break;
      case "rd":
        di++;
        dj++;
        break;
    }

    if (di < 0 || di >= ROWS || dj < 0 || dj >= COLUMNS) {
      lineOccupied = false;
      continueSearch = false;
    } else if (matrix[di][dj] === "#") {
      lineOccupied = true;
      continueSearch = false;
    } else if (matrix[di][dj] === "L") {
      lineOccupied = false;
      continueSearch = false;
    }
  }

  return lineOccupied;
};

const hasMoreThanNVisibleOccupiedSeats = (i, j, matrix, n) => {
  const directions = ["u", "d", "r", "l", "lu", "ld", "ru", "rd"];
  let seatsOccupied = 0;
  for (let direction of directions) {
    if (isLineOccupied(i, j, matrix, direction)) {
      seatsOccupied++;
    }
  }

  return seatsOccupied >= n;
};

const dontHaveOccupiedVisibleAdyacents = (i, j, matrix) => {
  return (
    !isLineOccupied(i, j, matrix, "u") &&
    !isLineOccupied(i, j, matrix, "d") &&
    !isLineOccupied(i, j, matrix, "l") &&
    !isLineOccupied(i, j, matrix, "r") &&
    !isLineOccupied(i, j, matrix, "lu") &&
    !isLineOccupied(i, j, matrix, "ld") &&
    !isLineOccupied(i, j, matrix, "ru") &&
    !isLineOccupied(i, j, matrix, "rd")
  );
};

const partTwo = () => {
  const doSeat = (prevMatrix) => {
    let currentMatrix = prevMatrix.map((e) => e.slice());

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        if (
          isEmptySeat(i, j, prevMatrix) &&
          dontHaveOccupiedVisibleAdyacents(i, j, prevMatrix)
        ) {
          currentMatrix[i][j] = "#";
        } else if (
          isOccupiedSeat(i, j, prevMatrix) &&
          hasMoreThanNVisibleOccupiedSeats(i, j, prevMatrix, 5)
        ) {
          currentMatrix[i][j] = "L";
        }
      }
    }

    if (!isEquals(currentMatrix, prevMatrix)) {
      return doSeat(currentMatrix);
    }

    return currentMatrix;
  };

  const finalMatrix = doSeat(seatMatrix);

  let occupiedSeats = 0;
  finalMatrix.forEach((array) =>
    array.forEach((e) => {
      if (e === "#") occupiedSeats++;
    })
  );

  return occupiedSeats;
};

console.log("Part two:", partTwo());
