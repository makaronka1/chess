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
  //fillBishop();
  //fillHorse();
  fillKing();
  //fillPawn();
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
    if (virtualBoard[y][x] && virtualBoard[y][x].color == moveTurn) {
      const figure = virtualBoard[y][x];
      let resultMassive = [];
      let castlingSquares = [];
      clearVirtualActionBoard();
      selectedFigureSquare = coordObject;
      const moveSquares = searchMoveAvailable(coordObject);
      const eatSquares = searchEatAvailable(coordObject);
      if (figure.type == "king") {
        castlingSquares = isCastling(coordObject);
      }
      resultMassive = [coordObject, moveSquares, eatSquares, castlingSquares];
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify(resultMassive));
    } else {
      res.statusCode = 200;
      selectedFigureSquare = null;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify("void square или не цвет хода"));
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
            type == "king" &&
            !isUnderAttack(opColor, { x: newX, y: newY }) &&
            nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")
          ) {
            squares.push({ x: newX, y: newY });
            virtualActionBoard[newY][newX] = "canMove";
            break;
          } else if (
            type == "horse" &&
            nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")
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
            step < 2 &&
            nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")
          ) {
            squares.push({ x: newX, y: newY });
            virtualActionBoard[newY][newX] = "canMove";
            step++;
          } else if (
            nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")
          ) {
            squares.push({ x: newX, y: newY });
            virtualActionBoard[newY][newX] = "canMove";
            break;
          } else {
            break;
          }
        } else if (
          nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "move")
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

function canEat(square, attackerColor) {
  return square.color !== attackerColor;
}

function searchEatAvailable(coord) {
  const { x, y } = coord;
  console.log(coord);
  console.log(virtualBoard[y][x]);
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

      if (type == "pawn") {
        if (
          newRow[parseInt(newX) + 1] != null &&
          canEat(newRow[parseInt(newX) + 1], color) &&
          nextTurnSimulate({ x: x, y: y }, { x: newX + 1, y: newY }, "eat")
        ) {
          squares.push({ x: newX + 1, y: newY });
          virtualActionBoard[newY][newX + 1] = "canEat";
        }
        if (
          newRow[parseInt(newX) - 1] != null &&
          canEat(newRow[parseInt(newX) - 1], color) &&
          nextTurnSimulate({ x: x, y: y }, { x: newX - 1, y: newY }, "eat")
        ) {
          squares.push({ x: newX - 1, y: newY });
          virtualActionBoard[newY][newX - 1] = "canEat";
        }
        break;
      } else if (newSquare == null && type != "pawn") {
        if (type == "king" || type == "horse") {
          break;
        } else {
          step++;
        }
      } else if (
        newSquare != null &&
        type != "pawn" &&
        type != "king" &&
        canEat(newSquare, color) &&
        nextTurnSimulate({ x: x, y: y }, { x: newX, y: newY }, "eat")
      ) {
        squares.push({ x: newX, y: newY });
        virtualActionBoard[newY][newX] = "canEat";
        break;
      } else if (
        newSquare != null &&
        type == "king" &&
        canEat(newSquare, color) &&
        !isUnderAttack(opColor, { x: newX, y: newY })
      ) {
        squares.push({ x: newX, y: newY });
        virtualActionBoard[newY][newX] = "canEat";
        break;
      } else if (
        newSquare != null &&
        type != "pawn" &&
        !canEat(newSquare, color)
      ) {
        break;
      } else {
        break;
      }
    }
  });

  return squares;
}

function clearVirtualActionBoard() {
  for (let y = 0; y < virtualActionBoard.length; y++) {
    for (let x = 0; x < virtualActionBoard[y].length; x++) {
      if (virtualActionBoard[y][x]) {
        virtualActionBoard[y][x] = null;
      }
    }
  }
}

function isUnderAttack(color, square) {
  let isAttacked = false;
  let allAttackSquares = [];
  let allMoveSquares = [];
  let allProtectedSquares = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (virtualBoard[i][j]?.color == color) {
        const { color, type } = virtualBoard[i][j];
        let directions;
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
          directions =
            color == "black" ? blackPawnDirection : whitePawnDirection;
        }
        let x = j;
        let y = i;
        if (type != "pawn") {
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

              if (newSquare == null) {
                if (type == "king" || type == "horse") {
                  allMoveSquares.push({ x: newX, y: newY });
                  break;
                } else {
                  allMoveSquares.push({ x: newX, y: newY });
                  step++;
                }
              } else if (newSquare.phantom == true) {
                allMoveSquares.push({ x: newX, y: newY });
                step++;
              } else {
                virtualBoard[newY][newX].color == color
                  ? allProtectedSquares.push({ x: newX, y: newY })
                  : allAttackSquares.push({ x: newX, y: newY });
                break;
              }
            }
          });
        } else if (type == "pawn") {
          let step = 1;
          let newX = parseInt(x) + parseInt(directions[0].x * step);
          let newY = parseInt(y) + parseInt(directions[0].y * step);
          let newRow = virtualBoard[newY];

          if (newRow[parseInt(newX) + 1] != null) {
            allAttackSquares.push({ x: newX + 1, y: newY });
          }
          if (newRow[parseInt(newX) + 1] == null) {
            allProtectedSquares.push({ x: newX + 1, y: newY });
          }
          if (newRow[parseInt(newX) - 1] != null) {
            allAttackSquares.push({ x: newX - 1, y: newY });
          }
          if (newRow[parseInt(newX) - 1] == null) {
            allAttackSquares.push({ x: newX - 1, y: newY });
          }
        }
      }
    }
  }
  const resultMassive = allMoveSquares
    .concat(allProtectedSquares)
    .concat(allAttackSquares);
  for (let element of resultMassive) {
    if (JSON.stringify(element) == JSON.stringify(square)) {
      isAttacked = true;
    }
  }
  return isAttacked;
}

function findKing(color) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (
        virtualBoard[i][j]?.type == "king" &&
        virtualBoard[i][j]?.color == color
      ) {
        return { x: j, y: i };
      }
    }
  }
  return false;
}

function isCastling(figureCoord) {
  const { x, y } = figureCoord;
  const figure = virtualBoard[y][x];
  let result = [];

  if (
    figure.type != "king" ||
    figure.color != moveTurn ||
    figure.isMove != false ||
    isUnderAttack(figure.opColor, findKing(moveTurn))
  ) {
    return;
  } else {
    const leftRook =
      figure.color == "white" ? virtualBoard[7][0] : virtualBoard[0][0];
    const rowNumber = figure.color == "white" ? 7 : 0;
    if (
      leftRook != null &&
      leftRook.isMove == false &&
      leftRook.type == "rook" &&
      leftRook.color == figure.color
    ) {
      const isEmpty = [1, 2, 3].every((index) => {
        const square = { x: index, y: rowNumber };

        return (
          virtualBoard[square.y][square.x] == null &&
          !isUnderAttack(figure.opColor, square)
        );
      });

      if (isEmpty && !isUnderAttack(figure.opColor, figureCoord)) {
        virtualActionBoard[rowNumber][0] = "canCastling";
        result.push({ x: 0, y: rowNumber });
      }
    }

    const righRook =
      figure.color == "white" ? virtualBoard[7][7] : virtualBoard[0][7];
    if (
      righRook != null &&
      righRook.isMove == false &&
      righRook.type == "rook" &&
      righRook.color == figure.color
    ) {
      const isEmpty = [5, 6].every((index) => {
        const square = { x: index, y: rowNumber };

        return (
          virtualBoard[square.y][square.x] == null &&
          !isUnderAttack(figure.opColor, square)
        );
      });

      if (isEmpty && !isUnderAttack(figure.opColor, figureCoord)) {
        virtualActionBoard[rowNumber][7] = "canCastling";
        result.push({ x: 7, y: rowNumber });
      }
    }
  }

  return result;
}

function createInvisibleClone(figure) {
  const { x, y } = figure;
  let clone = { ...virtualBoard[y][x] };

  return clone;
}

function nextTurnSimulate(figureCoord, squareCoord, action) {
  let result = false;
  const { color, opColor, type } = figureInfo(figureCoord);
  if (action == "move" && type == "king") {
    virtualBoard[figureCoord.y][figureCoord.x].phantom = true;
    result = !isUnderAttack(opColor, squareCoord);
  } else if (action == "move" && type != "king") {
    const clone = createInvisibleClone(figureCoord);
    virtualBoard[figureCoord.y][figureCoord.x].phantom = true;
    virtualBoard[squareCoord.y][squareCoord.x] = clone;
    const king = findKing(color);
    result = !isUnderAttack(opColor, king);
    virtualBoard[squareCoord.y][squareCoord.x] = null;
  } else if (action == "eat" && type != "king") {
    const king = findKing(color);
    let eatbleFigure = { ...virtualBoard[squareCoord.y][squareCoord.x] };
    virtualBoard[squareCoord.y][squareCoord.x] = figureInfo(figureCoord);
    virtualBoard[figureCoord.y][figureCoord.x].phantom = true;
    result = !isUnderAttack(opColor, king);
    virtualBoard[squareCoord.y][squareCoord.x] = eatbleFigure;
  }
  virtualBoard[figureCoord.y][figureCoord.x].phantom = false;
  return result;
}

function figureInfo(coord) {
  const { x, y } = coord;
  const figure = virtualBoard[y][x];
  const { color, type, isMove, phantom, opColor } = figure;

  return {
    color: color,
    type: type,
    isMove: isMove,
    phantom: phantom,
    opColor: opColor,
  };
}

console.log(virtualBoard);
