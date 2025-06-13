console.log(virtualBoard);

function findVirtualBoardSquare (square) {

}

function targetCell(event) {
  let square;
  const target = event.target;
  if (target.classList.contains('cube')) {
    square = target;
  } else {
    square = target.parentElement;
  }
  const {x, y} = squareInfo(square);
  //Если нажата на клетку с фигурой которая может ходить (её ход) 
  if (virtualBoard[y][x] != null) {
    const figure = virtualBoard[y][x];
    if (figure.color == moveTurn) {
	    removeHighlightedSquares();
      const squareCoord = squareInfo(square);
      selectedFigureSquare = squareCoord;
      highlightSelectedFigure(squareCoord);
      const moveSquares = searchMoveAvailable(squareCoord);
      const eatSquares = searchEatAvailable(squareCoord);
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
  console.log((virtualBoard[y][x]), virtualActionBoard[y][x]);
  //Нажатие на клетку для движения
  if (virtualBoard[y][x] == null && virtualActionBoard[y][x] == 'canMove' && selectedFigureSquare) {
    console.log(selectedFigureSquare);
    figureMove(selectedFigureSquare, squareInfo(square));
    //Трансформация пешки
    if ((squareInfo(square).y == 7 || squareInfo(square).y == 0) && virtualBoard[selectedFigureSquare.y][selectedFigureSquare.x].type == 'pawn') {
      selectedTransformFigure = squareInfo(square);
      showModal();
      virtualBoard[selectedFigureSquare.y][selectedFigureSquare.x] = null;
    }
    virtualBoard[selectedFigureSquare.y][selectedFigureSquare.x] = null;
    clearVirtualActionBoard();
    removeHighlightedSquares();
    //turnSwap();
  }

  if (virtualBoard[y][x] !== null && virtualActionBoard[y][x] == 'canEat' && selectedFigureSquare) {
    console.log("eat");
    console.log(selectedFigureSquare);
    figureEat(selectedFigureSquare, squareInfo(square));
    clearVirtualActionBoard();
    removeHighlightedSquares();
    //turnSwap();
  }
}
table.addEventListener('click', targetCell);

function squareInfo (square) {
  
  const eventTargetRow = square.parentElement;
  const squareIndex = Array.from(eventTargetRow.children).indexOf(square);
  const figureRowId = eventTargetRow.id;
  const clearFigureRowId = figureRowId.slice(1);
  
  return {
    x: squareIndex,
    y: clearFigureRowId
  };
}

function highlightAvailableMoveSquares (squares) {
  for (const square of squares) {
    const {x, y} = square;
    let squareForHighlight = document.querySelector(`#_${y}`).children[x];
    squareForHighlight.classList.add('highlight-green');
  }
}

function highlightAvailableEatSquares (squares) {
  for (const square of squares) {
    const {x, y} = square;
    let squareForHighlight = document.querySelector(`#_${y}`).children[x];
    squareForHighlight.classList.add('highlight-red');
  }
}

function searchMoveAvailable (coord) {
  const {x, y} = coord;
  console.log(coord);
  console.log(virtualBoard[y][x]);
  const {color, type, isMove} = virtualBoard[y][x];
  let directions;
  let squares = [];
  directions = type == 'king' || type == 'queen' ? queenKingDirections
   : type == 'bishop' ? bishopDirections 
   : type == 'rook' ? rookDirections
   : type == 'horse' ? horseDirections
   : false;
  if (type == 'pawn') {
    directions = color == 'black' ? blackPawnDirection : whitePawnDirection; 
  }
    directions.forEach(direction =>  {
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
          if (type == 'king' || type == 'horse') {
            if (type == 'king') {
              squares.push({x: newX, y: newY});
              virtualActionBoard[newY][newX] = 'canMove';
              break;
            } else if (type == 'horse') {
              squares.push({x: newX, y: newY});
              virtualActionBoard[newY][newX] = 'canMove';
              break;
            } else {
              break;
            }
          } else if (type == 'pawn') {
            const startRow = directions == blackPawnDirection ? 1 : 6;
            if (startRow == y && step < 2) {
              squares.push({x: newX, y: newY});
              virtualActionBoard[newY][newX] = 'canMove';
              step++;
            } else {
              squares.push({x: newX, y: newY});
              virtualActionBoard[newY][newX] = 'canMove';
              break;
            }
          } else {
            squares.push({x: newX, y: newY});
            virtualActionBoard[newY][newX] = 'canMove';
            step++;
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

function searchEatAvailable (coord) {
  const {x, y} = coord;
  console.log(coord);
  console.log(virtualBoard[y][x]);
  const {color, type, isMove} = virtualBoard[y][x];
  let directions;
  let squares = [];
  directions = type == 'king' || type == 'queen' ? queenKingDirections
   : type == 'bishop' ? bishopDirections 
   : type == 'rook' ? rookDirections
   : type == 'horse' ? horseDirections
   : false;
  if (type == 'pawn') {
    directions = color == 'black' ? blackPawnDirection : whitePawnDirection; 
  }
    directions.forEach(direction =>  {
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

        if (type == 'pawn') {
          if (newRow[parseInt(newX) + 1] != null && canEat(newRow[parseInt(newX) + 1], color)) {
            squares.push({x: newX + 1, y: newY});
            virtualActionBoard[newY][newX + 1] = 'canEat';
          }
          if (newRow[parseInt(newX) - 1] != null && canEat(newRow[parseInt(newX) - 1], color)) {
            squares.push({x: newX - 1, y: newY});
            virtualActionBoard[newY][newX - 1] = 'canEat';
          }
          break;
        } else if (newSquare == null && type != 'pawn') {
          if (type == 'king' || type == 'horse') {
            break;
          } else {
            step++;
          }
        } else if (newSquare != null && type != 'pawn' && canEat(newSquare, color)) {
          squares.push({x: newX, y: newY});
          virtualActionBoard[newY][newX] = 'canEat';
          break;
        } else if (newSquare != null && type != 'pawn' && !canEat(newSquare, color)) {
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

function figureMove (startCoord, endCoord) {
  const figure = virtualBoard[startCoord.y][startCoord.x];
  virtualBoard[endCoord.y][endCoord.x] = figure;

  imageMove(startCoord, endCoord);
}

function figureEat (startCoord, endCoord) {
  const figure = virtualBoard[startCoord.y][startCoord.x];
  virtualBoard[endCoord.y][endCoord.x] = figure;
  virtualBoard[startCoord.y][startCoord.x] = null;

  imageMove(startCoord, endCoord, 'eat');
}