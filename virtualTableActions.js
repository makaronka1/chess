console.log(virtualBoard);
const socket = new WebSocket('ws://localhost:3000');
function findVirtualBoardSquare(square) {}

function targetCell(event) {
  let square;
  const target = event.target;
  if (target.classList.contains("cube")) {
    square = target;
  } else {
    square = target.parentElement;
  }
  const { x, y } = squareInfo(square);
  //Если нажата на клетку с фигурой которая может ходить (её ход)
  if (virtualBoard[y][x] != null) {
    const figure = virtualBoard[y][x];
    if (figure.color == moveTurn) {
      clearVirtualActionBoard();
      removeHighlightedSquares();
      const squareCoord = squareInfo(square);
      selectedFigureSquare = squareCoord;
      highlightSelectedFigure(squareCoord);
      const moveSquares = searchMoveAvailable(squareCoord);
      const eatSquares = searchEatAvailable(squareCoord);
      if (figure.type == "king") {
        const castlingSquares = isCastling(squareCoord);
        highlightCastlingSquares(castlingSquares);
      }
      highlightAvailableMoveSquares(moveSquares);
      highlightAvailableEatSquares(eatSquares);
    } else {
      removeHighlightedSquares();
    }
  }

  //Если нажатие на клетку с которой нельзя взаимодействовать
  if (virtualActionBoard[y][x] == null && virtualBoard[y][x] == null) {
    removeHighlightedSquares();
    clearVirtualActionBoard();
    selectedFigureSquare = null;
  }
  console.log(virtualBoard[y][x], virtualActionBoard[y][x]);
  //Нажатие на клетку для движения
  if (
    virtualBoard[y][x] == null &&
    virtualActionBoard[y][x] == "canMove" &&
    selectedFigureSquare
  ) {
    console.log(selectedFigureSquare);
    figureMove(selectedFigureSquare, squareInfo(square));
    removeHighlightedCheck();
    //Трансформация пешки
    if (
      (squareInfo(square).y == 7 || squareInfo(square).y == 0) &&
      virtualBoard[selectedFigureSquare.y][selectedFigureSquare.x].type ==
        "pawn"
    ) {
      selectedTransformFigure = squareInfo(square);
      showModal();
      virtualBoard[selectedFigureSquare.y][selectedFigureSquare.x] = null;
    }
    virtualBoard[selectedFigureSquare.y][selectedFigureSquare.x] = null;
    clearVirtualActionBoard();
    removeHighlightedSquares();
    turnSwap();
    if (check()) {
      checkMate();
    }
  }

  if (
    virtualBoard[y][x] !== null &&
    virtualActionBoard[y][x] == "canEat" &&
    selectedFigureSquare
  ) {
    figureEat(selectedFigureSquare, squareInfo(square));
    removeHighlightedCheck();
    clearVirtualActionBoard();
    removeHighlightedSquares();
    turnSwap();
    if (check()) {
      checkMate();
    }
  }

  if (
    virtualBoard[y][x] !== null &&
    virtualActionBoard[y][x] == "canCastling" &&
    selectedFigureSquare
  ) {
    console.log("castling");
    console.log(selectedFigureSquare);
    castling({ x: x, y: y });
    clearVirtualActionBoard();
    removeHighlightedSquares();
    turnSwap();
    if (check()) {
      checkMate();
    }
  }
}
//table.addEventListener("click", targetCell);

function squareInfo(square) {
  const eventTargetRow = square.parentElement;
  const squareIndex = Array.from(eventTargetRow.children).indexOf(square);
  const figureRowId = eventTargetRow.id;
  const clearFigureRowId = figureRowId.slice(1);

  return {
    x: squareIndex,
    y: clearFigureRowId,
  };
}

function highlightAvailableMoveSquares(squares) {
  if (squares) {
    for (const square of squares) {
      const { x, y } = square;
      let squareForHighlight = document.querySelector(`#_${y}`).children[x];
      squareForHighlight.classList.add("highlight-green");
    }
  }
}

function highlightAvailableEatSquares(squares) {
  if (squares) {
    for (const square of squares) {
      const { x, y } = square;
      let squareForHighlight = document.querySelector(`#_${y}`).children[x];
      squareForHighlight.classList.add("highlight-red");
    }
  }
}

function highlightCastlingSquares(squares) {
  if (squares) {
    for (const square of squares) {
      const { x, y } = square;
      let squareForHighlight = document.querySelector(`#_${y}`).children[x];
      squareForHighlight.classList.add("highlight-green");
    }
  }
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

function clearVirtualActionBoard() {
  for (let y = 0; y < virtualActionBoard.length; y++) {
    for (let x = 0; x < virtualActionBoard[y].length; x++) {
      if (virtualActionBoard[y][x]) {
        virtualActionBoard[y][x] = null;
      }
    }
  }
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

function canEat(square, attackerColor) {
  return square.color !== attackerColor;
}

function figureMove(startCoord, endCoord) {
  const figure = virtualBoard[startCoord.y][startCoord.x];
  virtualBoard[endCoord.y][endCoord.x] = figure;
  virtualBoard[endCoord.y][endCoord.x].isMove = true;
  imageMove(startCoord, endCoord);
}

function figureEat(startCoord, endCoord) {
  const figure = virtualBoard[startCoord.y][startCoord.x];
  virtualBoard[endCoord.y][endCoord.x] = figure;
  virtualBoard[endCoord.y][endCoord.x].isMove = true;
  virtualBoard[startCoord.y][startCoord.x] = null;

  imageMove(startCoord, endCoord, "eat");
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

document.getElementById("getBoardBtn").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3000/board");
    const board = await response.json();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = document.querySelector(`#_${i}`).children[j];

        while (cell.firstChild) {
          cell.removeChild(cell.firstChild);
        }

        if (board[i][j] != null) {
          const { type, color } = board[i][j];
          const figure = createFigure(
            color,
            type.charAt(0).toUpperCase() + type.slice(1)
          );
          cell.appendChild(figure);
        }
      }
    }

    console.log("Доска обновлена:", board);
  } catch (error) {
    console.error("Ошибка:", error);
  }
});

async function targetCell(event) {
  let square;
  const target = event.target;
  if (target.classList.contains("cube")) {
    square = target;
  } else {
    square = target.parentElement;
  }
  const { x, y } = squareInfo(square);
  console.log(squareInfo(square));
  const coord = squareInfo(square);
  try {
    removeHighlightedSquares();
    const response = JSON.stringify(
      {type: "SQUARE",
      data: coord}
    );
    socket.send(response);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}
table.addEventListener("click", targetCell);


socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log(message);
  if (message.type === 'BOARD') {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const cell = document.querySelector(`#_${i}`).children[j];

        while (cell.firstChild) {
          cell.removeChild(cell.firstChild);
        }

        if (message.data[i][j] != null) {
          const { type, color } = message.data[i][j];
          const figure = createFigure(
            color,
            type.charAt(0).toUpperCase() + type.slice(1)
          );
          cell.appendChild(figure);
        }
      }
    }
  } else if (message.type === 'AVAILABLE_SQUARES') {
    const availableSquares = message.data;
    if (
      typeof message.data == "object" &&
      message.data != "void square"
    ) {
      if (availableSquares[0].length != 0) {
        highlightSelectedFigure(availableSquares[0]);
      }
      if (availableSquares[1].length != 0) {
        highlightAvailableMoveSquares(availableSquares[1]);
      }
      if (availableSquares[2].length != 0) {
        highlightAvailableEatSquares(availableSquares[2]);
      }
      if (availableSquares[3].length != 0) {
        highlightAvailableMoveSquares(availableSquares[3]);
      }
    }
    console.log("Получена фигура:", availableSquares);
  } else if (message.type == "NOTIFICATION") {
    console.log(message.data);
  } else if (message.type == "TURN") {
    turnSwap(message.data);
  }
};