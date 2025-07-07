const http = require("http");

let selectedFigureSquare;
let selectedTransformFigure;

let moveTurn = "white";
const figuresTypes = ["bishop", "king", "queen", "pawn", "rook", "horse"];

const queenKingDirections = [
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];
const horseDirections = [
  { x: 2, y: 1 },
  { x: -2, y: 1 },
  { x: 1, y: 2 },
  { x: -1, y: 2 },
  { x: 2, y: -1 },
  { x: -2, y: -1 },
  { x: 1, y: -2 },
  { x: -1, y: -2 },
];
const bishopDirections = [
  { x: 1, y: 1 },
  { x: 1, y: -1 },
  { x: -1, y: 1 },
  { x: -1, y: -1 },
];
const rookDirections = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];
const blackPawnDirection = [{ x: 0, y: 1 }];
const whitePawnDirection = [{ x: 0, y: -1 }];

let virtualBoard = Array(8)
  .fill()
  .map(() => Array(8).fill(null));
let virtualActionBoard = Array(8)
  .fill()
  .map(() => Array(8).fill(null));

function fillVirtualBoard() {
  fillPawn();
  fillHorse();
  fillBishop();
  fillKing();
  fillQueen();
  fillRook();
}
fillVirtualBoard();

const server = http.createServer((req, res) => {
  if (req.url === "/board") {
    // Возвращаем virtualBoard в формате JSON
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Для кросс-доменных запросов
    res.end(JSON.stringify(virtualBoard));
  } else if (req.url.startsWith("/square")) {
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const x = parseInt(urlParams.searchParams.get("x"));
    const y = parseInt(urlParams.searchParams.get("y"));
    const coordObject = { x: x, y: y };
    if (virtualBoard[y][x]) {
      const moveSquaresResult = searchMoveAvailable(coordObject);
      const resultMassive = [coordObject, moveSquaresResult];
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify(resultMassive));
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify("void square"));
    }
  } else {
    // Стандартный ответ для других URL
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end(
      "Привет, это мой локальный сервер на Node.js! Для получения доски перейдите на /board"
    );
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}/`);
  console.log("Доска доступна по адресу http://localhost:3000/board");
});

function fillPawn() {
  for (let i = 0; i < 8; i++) {
    virtualBoard[1][i] = {
      color: "black",
      type: "pawn",
      isMove: false,
      phantom: false,
      opColor: "white",
    };
  }
  for (let i = 0; i < 8; i++) {
    virtualBoard[6][i] = {
      color: "white",
      type: "pawn",
      isMove: false,
      phantom: false,
      opColor: "black",
    };
  }
}

function fillHorse() {
  for (let i = 0; i < 8; i++) {
    if (i == 1 || i == 6) {
      virtualBoard[7][i] = {
        color: "white",
        type: "horse",
        isMove: false,
        phantom: false,
        opColor: "black",
      };
      virtualBoard[0][i] = {
        color: "black",
        type: "horse",
        isMove: false,
        phantom: false,
        opColor: "white",
      };
    }
  }
}

function fillBishop() {
  for (let i = 0; i < 8; i++) {
    if (i == 2 || i == 5) {
      virtualBoard[7][i] = {
        color: "white",
        type: "bishop",
        isMove: false,
        phantom: false,
        opColor: "black",
      };
      virtualBoard[0][i] = {
        color: "black",
        type: "bishop",
        isMove: false,
        phantom: false,
        opColor: "white",
      };
    }
  }
}

function fillKing() {
  virtualBoard[0][4] = {
    color: "black",
    type: "king",
    isMove: false,
    phantom: false,
    opColor: "white",
  };
  virtualBoard[7][4] = {
    color: "white",
    type: "king",
    isMove: false,
    phantom: false,
    opColor: "black",
  };
}

function fillQueen() {
  virtualBoard[0][3] = {
    color: "black",
    type: "queen",
    isMove: false,
    phantom: false,
    opColor: "white",
  };
  virtualBoard[7][3] = {
    color: "white",
    type: "queen",
    isMove: false,
    phantom: false,
    opColor: "black",
  };
}

function fillRook() {
  for (let i = 0; i < 8; i++) {
    if (i == 0 || i == 7) {
      virtualBoard[0][i] = {
        color: "black",
        type: "rook",
        isMove: false,
        phantom: false,
        opColor: "white",
      };
      virtualBoard[7][i] = {
        color: "white",
        type: "rook",
        isMove: false,
        phantom: false,
        opColor: "black",
      };
    }
  }
}

function canEat(square, attackerColor) {
  return square.color !== attackerColor;
}

function fillVirtualBoard() {
  fillPawn();
  fillHorse();
  fillBishop();
  fillKing();
  fillQueen();
  fillRook();
}

function searchMoveAvailable(coord) {
  const { x, y } = coord;
  const { color, type, isMove, opColor } = virtualBoard[y][x];
  let directions;
  let squares = [];
  directions =
    type == "king" || type == "queen"
      ? queenKingDirections
      : type == "bishop"
      ? bishopDirections
      : type == "rook"
      ? rookDirections
      : type == "horse"
      ? horseDirections
      : false;
  if (type == "pawn") {
    directions = color == "black" ? blackPawnDirection : whitePawnDirection;
  }
  directions.forEach((direction) => {
    let step = 1;

    while (true) {
      let newX = parseInt(x) + parseInt(direction.x * step);
      let newY = parseInt(y) + parseInt(direction.y * step);
      if (newY > 7 || newY < 0 || newX > 7 || newX < 0) {
        break;
      }

      let newRow = virtualBoard[newY];
      if (!newRow) break;

      let newSquare = newRow[newX];

      if (newSquare === null) {
        if (type == "king" || type == "horse") {
          if (
            type == "king" /*&&
            !isUnderAttack(opColor, { x: newX, y: newY }) &&
            nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")*/
          ) {
            squares.push({ x: newX, y: newY });
            virtualActionBoard[newY][newX] = "canMove";
            break;
          } else if (
            type == "horse" /* &&
            nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")*/
          ) {
            squares.push({ x: newX, y: newY });
            virtualActionBoard[newY][newX] = "canMove";
            break;
          } else {
            break;
          }
        } else if (type == "pawn") {
          const startRow = directions == blackPawnDirection ? 1 : 6;
          if (
            startRow == y &&
            step < 2 /* &&
            nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")*/
          ) {
            squares.push({ x: newX, y: newY });
            virtualActionBoard[newY][newX] = "canMove";
            step++;
          } else if (
            true
            /*nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")*/
          ) {
            squares.push({ x: newX, y: newY });
            virtualActionBoard[newY][newX] = "canMove";
            break;
          } else {
            break;
          }
        } else if (
          true
          /*nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")*/
        ) {
          squares.push({ x: newX, y: newY });
          virtualActionBoard[newY][newX] = "canMove";
          step++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
  });

  return squares;
}

fillVirtualBoard();

console.log(virtualBoard);
