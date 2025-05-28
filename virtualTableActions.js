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
  console.log(x, y);
  if (virtualBoard[y][x] != null) {
    const figure = virtualBoard[y][x];
    if (figure.color == moveTurn) {
      highlightSelectedFigure(squareInfo(square));
    }
    console.log(virtualBoard[y][x]);
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

function searchMoveAvailable (target) {
  const {square, row, rowId, squareIndex, type, color, opColor} = figureInfo(target);
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
        let newX = parseInt(squareIndex) + parseInt(direction.x * step);
        let newY = parseInt(rowId) + parseInt(direction.y * step);
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
              break;
            } else if (type == 'horse') {
              squares.push({x: newX, y: newY});
              break;
            } else {
              break;
            }
          } else if (type == 'pawn') {
            const startRow = directions == blackPawnDirection ? 1 : 6;
            if (startRow == rowId && step < 2) {
              squares.push({x: newX, y: newY});
              step++;
            } else {
              squares.push({x: newX, y: newY});
              break;
            }
          } else {
            squares.push({x: newX, y: newY});
            step++;
          }
        } else {
          break;
        }
      }
     });

  return squares;
}

function searchEatAvailable (target) {
  const {square, row, rowId, squareIndex, type, color, opColor} = figureInfo(target);
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
        let newX = parseInt(squareIndex) + parseInt(direction.x * step);
        let newY = parseInt(rowId) + parseInt(direction.y * step);
        if (newY > 7 || newY < 0 || newX > 7 || newX < 0) {
          break;
        }

        let newRow = virtualBoard[newY];
        if (!newRow) break;

        let newSquare = newRow[newX];
          
        if (newSquare == null && type != 'pawn') {
          if (type == 'king' || type == 'horse') {
            break;
          } else {
            step++;
          }
        } else if (newSquare != null && type != 'pawn') {

        }
      }
     });

  return squares;
}