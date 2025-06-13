let selectedFigure;
let selectedTransformFigure;

let moveTurn = 'white';
const figuresTypes = ['bishop', 'king', 'queen', 'pawn', 'rook', 'horse'];
const turnStatus = document.querySelector('#turn-status');
const modalOverlay = document.getElementById('modalOverlay');
const pawnTransformContainer = document.getElementById('pawnTransform');
const confirmButton = document.getElementById('closeButton');

const queenKingDirections = [
    { x: 1,  y: 1 },
    { x: 1, y: -1 },
    { x: -1,  y: 1 },
    { x: -1,  y: -1 },
    { x: 0, y: 1},
    { x: 0, y: -1},
    { x: 1, y: 0},
    { x: -1, y: 0},
    ];
const horseDirections = [
    { x: 2, y: 1 },
    { x: -2,  y: 1 },
    { x: 1,  y: 2 },
    { x: -1,  y: 2 },
    { x: 2, y: -1 },
    { x: -2,  y: -1 },
    { x: 1,  y: -2 },
    { x: -1,  y: -2 }
    ];
const bishopDirections = [
    { x: 1,  y: 1 },
    { x: 1, y: -1 },
    { x: -1,  y: 1 },
    { x: -1,  y: -1 }
    ];
const rookDirections = [
    { x: 0, y: 1},
    { x: 0, y: -1},
    { x: 1, y: 0},
    { x: -1, y: 0},
    ];
const blackPawnDirection = [
    { x: 0, y: 1}
    ];
const whitePawnDirection = [
    { x: 0, y: -1}
    ];

/*function targetCell(event) {
  const target = event.target;
  const color = target.classList.item(0);

  if (target.parentElement.classList.contains('highlight-green') && target.parentElement.hasChildNodes() && target.classList.contains('rook')) {
    castling(target);
    removeHighlightedSquares();
    turnSwap();
    check();
    checkMate();
    return;
  }

  if (target.classList.contains('highlight-red') && selectedFigure.classList.contains('pawn')) {
    enpassant(target);
    removeHighlightedSquares();
    turnSwap();
    removeHighlightedCheck();
    check();
    checkMate();
    selectedFigure = null;
    return;
  }

  if (figuresTypes.includes(target.classList.item(1)) && !target.parentElement.classList.contains('highlight-red') && color == moveTurn) {
    selectedFigure = target;
    removeHighlightedSquares();
    highlightSelectedFigure(target);
    highlightAvailableSquare(searchAllAvailableSquares(target));
    isCastling(target);
    return; 
  }
  
  if (selectedFigure && !target.classList.contains('highlight-green') && !target.parentElement.classList.contains('highlight-red')) {
    removeHighlightedSquares();
    selectedFigure = null;
    return;
  }
  
  if (selectedFigure && target.classList.contains('highlight-green') && !target.hasChildNodes()) {
    figureMoove(target);
    pawnTransform(target);
    turnSwap();
    removeHighlightedCheck();
    check();
    checkMate();

    return;
  }

  if (selectedFigure && target.parentElement.classList.contains('highlight-red')) {
    pawnTransform(target);
    figureEat(target);
    turnSwap();
    removeHighlightedCheck();
    check();
    checkMate();
    return;
  }
}*/

function figureInfo(target) {

  const eventTargetSquare = target.parentElement;
  const eventTargetRow = eventTargetSquare.parentElement;

  const figureRowId = eventTargetRow.id;
  const squareIndex = Array.from(eventTargetRow.children).indexOf(eventTargetSquare);
  const clearFigureRowId = figureRowId.slice(1);
  const targetFigureType = target.classList.item(1);
  const targetFigureColor = target.classList.item(0);
  const opColor = targetFigureColor == 'white' ? 'black' : 'white';

  return {
    square: eventTargetSquare,
    row: eventTargetRow,
    rowId: clearFigureRowId,
    squareIndex: squareIndex,
    type: targetFigureType,
    color: targetFigureColor,
    opColor: opColor
  };
}

function pawnTransform(target) {
  if (selectedFigure.classList.contains('pawn')) {
    const targetType = target.classList.contains('cube') ? 'cube' : 'figure';
    
    let targetRow;
    if (targetType === 'cube') {
      targetRow = target.parentElement;
    } else {
      targetRow = target.parentElement.parentElement;
    }

    if (targetRow && (targetRow.id === '_0' || targetRow.id === '_7')) {
      showModal();
    } else {
      console.log(false);
    }
  }
}

function enpassant (targetSquare) {
  const eventTargetRow = targetSquare.parentElement;
	const squareIndex = Array.from(eventTargetRow.children).indexOf(targetSquare);
  targetSquare.appendChild(selectedFigure);
  if (selectedFigure.classList.contains('black')) {
    const whitePawnRow = document.querySelector('#_4');
    whitePawnRow.children[squareIndex].removeChild(whitePawnRow.children[squareIndex].firstChild);
  } else {
    const blackPawnRow = document.querySelector('#_3');
    blackPawnRow.children[squareIndex].removeChild(blackPawnRow.children[squareIndex].firstChild);
  }
}

function turnSwap () {
  if (moveTurn == 'white') {
    moveTurn = 'black';
    try {
      document.querySelector('.enpassant-black').classList.remove('enpassant-black');
    } catch {
      console.log('Взятия на проходе нет.')
    }
    turnStatus.textContent = 'Ход черных';
  } else {
    moveTurn = 'white';
    try {
      document.querySelector('.enpassant-white').classList.remove('enpassant-white');
    } catch {
      console.log('Взятия на проходе нет.')
    }
    turnStatus.textContent = 'Ход белых';
  }
}

// function highlightAvailableSquare (squares) {
//   for (const square of squares[0]) {
//     if (square != undefined) {
//       square.classList.add('highlight-green');
//     }
//   }
//   for (const square of squares[1]) {
//     square.classList.add('highlight-red');
//   }
// }

function highlightSelectedFigure (coord) {
  const {x, y} = coord;
  const row = document.querySelector(`#_${y}`);
  row.children[x].classList.add('highlight-blue');
}

/*function searchAllAvailableSquares (target) {
  const {square, row, rowId, squareIndex, type, color, opColor} = figureInfo(target);
  let directions;
  let squares = [[], []];
  directions = type == 'king' || type == 'queen' ? queenKingDirections
   : type == 'bishop' ? bishopDirections 
   : type == 'rook' ? rookDirections
   : type == 'horse' ? horseDirections
   : false;
    if (type != 'pawn'){
    directions.forEach(direction =>  {
      let step = 1;

      while (true) {
        let newX = parseInt(squareIndex) + parseInt(direction.x * step);
        let newY = parseInt(rowId) + parseInt(direction.y * step);

        if (newY > 7 || newY < 0 || newX > 7 || newX < 0) {
          break;
        }

        let newRow = document.querySelector(`#_${newY}`);

        if (!newRow) break;
        let newSquare = newRow.children[newX];
        
        if (!newSquare) break;
        console.log(newSquare);
        if (!newSquare.hasChildNodes()) {
          if (type == 'king' || type == 'horse') {
            if (type == 'king' && !isUnderAttack(opColor ,newSquare) && nextTurnSimulate(target, newSquare, 'move')) {
              console.log(newSquare);
              squares[0].push(newSquare);
              break;
            } else if (type == 'horse' && nextTurnSimulate(target, newSquare, 'move')) {
              squares[0].push(newSquare);
              break;
            } else {
              break;
            }
          } else if (nextTurnSimulate(target, newSquare, 'move')) {
            console.log(newSquare);
            step++;
            squares[0].push(newSquare);
          } else {
            step++;
          }
        } else if (newSquare.hasChildNodes() && canEat(newSquare, color)) {
          if (type == 'king' && !isUnderAttack(opColor ,newSquare) ) {
            squares[1].push(newSquare);
            break;
          } else if (type != 'king' && nextTurnSimulate(target, newSquare, 'eat')) {
            squares[1].push(newSquare);
            break;
          } else {
            break;
          }
        } else {
          break;
        }
      }
    });
  } else if (type === 'pawn') {

		const isWhite = color === 'white';
    const enpassant = isWhite ? 'enpassant-' + 'black' : 'enpassant-' + 'white';
		const direction = isWhite ? -1 : 1;
		const targetRow = document.querySelector(`#_${parseInt(rowId) + (1 * direction)}`);

		if (!targetRow) return;

		if (squareIndex > 0) {
			const targetLeftSquare = targetRow.children[squareIndex - 1];
			if ((targetLeftSquare && canEat(targetLeftSquare, color) && nextTurnSimulate(target, targetLeftSquare, 'eat')) || targetLeftSquare.classList.contains(enpassant) && nextTurnSimulate(target, targetRightSquare, 'move')) {
					squares[1].push(targetLeftSquare);
			}
		}

		if (squareIndex < 7) {
			const targetRightSquare = targetRow.children[squareIndex + 1];
			if ((targetRightSquare && canEat(targetRightSquare, color) && nextTurnSimulate(target, targetRightSquare, 'eat')) || targetRightSquare.classList.contains(enpassant) && nextTurnSimulate(target, targetRightSquare, 'move')) {
					squares[1].push(targetRightSquare);
			}
		}

    const startRow = isWhite ? 6 : 1;
    const stepsNumber = rowId == startRow ? 2 : 1;

    for (let i = 1; i <= stepsNumber; i++) {
      try {
          const targetRow = document.querySelector(`#_${parseInt(rowId) + (i * direction)}`);
          const targetSquare = targetRow.children[squareIndex];

          if (targetSquare.hasChildNodes()) {
            break;
          } else if (nextTurnSimulate(target, targetSquare, 'move')) {
						squares[0].push(targetSquare);
					} else {
            break;
          }
      } catch {
          console.log('Ход невозможен');
      }
    }

  }
    else {
    console.log('Такой фигуры нет');
  }
  if (type == 'king') {
    if(isCastling(target) != undefined) {
      squares[0] = squares[0].concat(isCastling(target));
    }
    return squares;
  }
  console.log(squares);
  return squares;
}*/

// function canEat(square, attackerColor) {
// 	if (!square.hasChildNodes()) return false;
	
// 	const figure = square.firstChild;
// 	const defenderColor = figure.classList.item(0);
	
// 	return defenderColor !== attackerColor;
// }

// function figureMoove (targetSquare) {
//   const {square, row, color, type} = figureInfo(selectedFigure);
//   if (type == 'pawn'){
//     if (row.id == '_1' || row.id == '_6') {
//       const targetSquareRowId = targetSquare.parentElement.id;
//       if (selectedFigure.classList.contains('black') && targetSquareRowId == '_3') {
//         const startRow = document.querySelector('#_2');
//         const squareIndex = Array.from(row.children).indexOf(selectedFigure.parentElement);
//         const square = startRow.children[squareIndex];
//         square.classList.add('enpassant-black');
//       } else if (selectedFigure.classList.contains('white') && targetSquareRowId == '_4') {
//         const startRow = document.querySelector('#_5');
//         const squareIndex = Array.from(row.children).indexOf(selectedFigure.parentElement);
//         const square = startRow.children[squareIndex];
//         square.classList.add('enpassant-white');
//       }
//     }
//   }
// 	targetSquare.appendChild(selectedFigure);
//   try {
//     selectedFigure.classList.remove('not-go');
//   } catch {
//     console.log('Фигура уже двигалась');
//   }
// 	removeHighlightedSquares();
// }

// function figureEat(target) {
// 	let targetParent = target.parentElement;
// 	targetParent.removeChild(targetParent.firstChild);
// 	targetParent.appendChild(selectedFigure);
// 	removeHighlightedSquares();
// }


function removeHighlightedSquares () {
	let highlightedGreenSquares = document.querySelectorAll('.highlight-green');
  let highlightedRedSquares = document.querySelectorAll('.highlight-red');
  let highlightedBlueSquares = document.querySelectorAll('.highlight-blue');

  
    for (let square of highlightedGreenSquares) {
      square.classList.remove('highlight-green');
    }
  
    for (let square of highlightedRedSquares) {
      square.classList.remove('highlight-red');
    }

    for (let square of highlightedBlueSquares) {
      square.classList.remove('highlight-blue');
    }
    
}

function removeHighlightedCheck () {
  let highlightedCheckSquares = document.querySelectorAll('.highlight-check');

  for (let square of highlightedCheckSquares) {
    square.classList.remove('highlight-check');
  }
}


function isCastling(target) {
  const {type, color, opColor, row} = figureInfo(target);
  let result = [];

  if (type != 'king' || !target.classList.contains('not-go')) {
    return;
  }

  if (!row) return;

  if (isUnderAttack(opColor, target.parentElement)) {
    return;
  }

  const leftRook = row.children[0]?.children[0];
  if (leftRook?.classList?.contains('not-go') && leftRook.classList.item(0) === color) {
    const isEmpty = [1, 2, 3].every(index => {
      const square = row.children[index];
      return !square?.hasChildNodes() && !isUnderAttack(opColor, square);
    });
    
    const kingTargetSquare = row.children[2];
    if (isEmpty && !isUnderAttack(opColor, kingTargetSquare)) {
      result.push(row.children[0]);
    }
  }

  const rightRook = row.children[7]?.children[0];
  if (rightRook?.classList?.contains('not-go') && rightRook.classList.item(0) === color) {
    const isEmpty = [5, 6].every(index => {
      const square = row.children[index];
      return !square?.hasChildNodes() && !isUnderAttack(opColor, square);
    });
    
    const kingTargetSquare = row.children[6];
    if (isEmpty && !isUnderAttack(opColor, kingTargetSquare)) {
      result.push(row.children[7]);
    }
  }
  return result;
}

function castling (target) {
  const parent = target.parentElement.parentElement;
  const child = target.parentElement;
  const index = Array.from(parent.children).indexOf(child);

  const isLong = index == 0 ? true : false;

  if (isLong) {
    parent.children[parseInt(index) + parseInt(3)].appendChild(target);
    parent.children[parseInt(index) + parseInt(2)].appendChild(selectedFigure);
  } else {
    parent.children[parseInt(index) + parseInt(-2)].appendChild(target);
    parent.children[parseInt(index) + parseInt(-1)].appendChild(selectedFigure);
  }
  target.classList.remove('not-go');
  selectedFigure.classList.remove('not-go');
}
//передаем клетку и цвет фигур которые ее атакуют.
function isUnderAttack(color, square) {
  const allFigures = document.querySelectorAll(`.${color}`);
  let isAttacked = false;
  let allAttackSquares = [];
  let allMoveSquares = [];
  let allProtectedSquares = [];
  for (const target of allFigures) {
  const {row, square, squareIndex, color, type, opColor, rowId} = figureInfo(target);
  let directions;

  directions = type == 'king' || type == 'queen' ? queenKingDirections
   : type == 'bishop' ? bishopDirections 
   : type == 'rook' ? rookDirections
   : type == 'horse' ? horseDirections
   : false;
    if (type != 'pawn' && type != 'horse' && type != 'king'){
    directions.forEach(direction =>  {
      let step = 1;

      while (true) {
        let newX = parseInt(squareIndex) + parseInt(direction.x * step);
        let newY = parseInt(rowId) + parseInt(direction.y * step);
        if (newY > 7 || newY < 0 || newX > 7 || newX < 0) {
          break;
        }

        let newRow = document.querySelector(`#_${newY}`);

        if (!newRow) break;
        let newSquare = newRow.children[newX];
        if (!newSquare) break;

        if (!newSquare.hasChildNodes() || (newSquare.hasChildNodes() && newSquare.children[0].classList.contains('phantom'))) {
          allMoveSquares.push(newSquare);
          step++;
        } else if (newSquare.hasChildNodes() && newSquare.children[0].classList.item(0) == color){
          allProtectedSquares.push(newSquare);
          break;
        } else if (newSquare.hasChildNodes() && canEat(newSquare, color)) {
          allAttackSquares.push(newSquare);
          break;
        } else {
          break;
        }
      }
    });
  } else if (type == 'king' || type == 'horse') {
    directions.forEach(direction =>  {

      let newX = parseInt(squareIndex) + parseInt(direction.x);
      let newY = parseInt(rowId) + parseInt(direction.y);
      if (newY > 7 || newY < 0 || newX > 7 || newX < 0) {
        return;
      }

      let newRow = document.querySelector(`#_${newY}`);
      if (!newRow) return;

      let newSquare = newRow.children[newX];
      if (!newSquare) return;

      if (!newSquare.hasChildNodes()) {
        allMoveSquares.push(newSquare);
      } else if (newSquare.hasChildNodes() && canEat(newSquare, color)) {
        allAttackSquares.push(newSquare);
        return;
      } else if (newSquare.hasChildNodes() && newSquare.children[0].classList.item(0) == color){
        allProtectedSquares.push(newSquare);
        return;
      } else {
        return;
      }
    });
  
  } else if (type === 'pawn') {

		const isWhite = color === 'white';
		const direction = isWhite ? -1 : 1;
		const targetRow = document.querySelector(`#_${parseInt(rowId) + (1 * direction)}`);

		if (!targetRow) return;

		if (squareIndex > 0) {
			const targetLeftSquare = targetRow.children[squareIndex - 1];
			if (targetLeftSquare && canEat(targetLeftSquare, color)) {
				allAttackSquares.push(targetLeftSquare);
			} else {
				allProtectedSquares.push(targetLeftSquare);
      }
		}

		if (squareIndex < 7) {
			const targetRightSquare = targetRow.children[squareIndex + 1];
			if (targetRightSquare && canEat(targetRightSquare, color)) {
				allAttackSquares.push(targetRightSquare);
			} else {
        allProtectedSquares.push(targetRightSquare);
      }
		}

  }
    else {
    console.log('Такой фигуры нет');
  }
  }
  
  
  if (allAttackSquares.includes(square) || allMoveSquares.includes(square) || allProtectedSquares.includes(square)) {
    isAttacked = true;
  }

  return isAttacked;
}

function nextTurnSimulate (figure, square, action) {
  let result = false;
  const {color, opColor, type} = figureInfo(figure);
  if (action == 'move' && type == 'king') {
    figure.classList.add('phantom');
    result = !isUnderAttack(opColor, square);
  } else if (action == 'move' && type != 'king') {
    const clone = createInvisibleClone(figure);
    figure.classList.add('phantom');
    square.appendChild(clone);
    const king = findKing(color);
    result = !isUnderAttack(opColor, king[2].parentElement);
    square.removeChild(square.firstChild);
  } else if (action == 'eat' && type != 'king') {
    const king = findKing(color);
    let eatbleFigure = square.firstChild;
    const originalClasses = eatbleFigure.className;
    eatbleFigure.className = figure.className;
    figure.classList.add('phantom');
    result = !isUnderAttack(opColor, king[2].parentElement);
    eatbleFigure.className = originalClasses;
  }
  figure.classList.remove('phantom');
  return result;
}

function check () {
  if (moveTurn == 'black') {
    const kingSquare = document.querySelector('.black.king').parentElement;
    if (isUnderAttack('white', kingSquare)) {
      turnStatus.textContent += '. Шах';
      kingSquare.classList.add('highlight-check');
    }
  } else if (moveTurn == 'white') {
    const kingSquare = document.querySelector('.white.king').parentElement;
    if (isUnderAttack('black', kingSquare)) {
      turnStatus.textContent += '. Шах';
      kingSquare.classList.add('highlight-check');
    }
  }
}

function showModal() {
  selectedTransformFigure = selectedFigure;
  const {x, y} = selectedTransformFigure;
  const figuresTransformType = ['Bishop', 'Horse', 'Rook', 'Queen'];
  const transformImg = document.querySelectorAll(".transformimg");
  let i = 0;
  if (virtualBoard[y][x].color == 'white'){
    for (const img of transformImg) {
      img.src = `img/white/white${figuresTransformType[i]}.png`;
      i++;
    }
  } else if (virtualBoard[y][x].color == 'black') {
    for (const img of transformImg) {
      img.src = `img/black/black${figuresTransformType[i]}.png`;
      i++;
    }
  }
  modalOverlay.style.display = 'block';
  pawnTransformContainer.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  const {x, y} = selectedTransformFigure;
  let selectedTransformFigureColor = virtualBoard[y][x].color;
  const selectedTransformFigureRow = document.querySelector(`#_${y}`);
  const selectedTransformFigureSquare = selectedTransformFigureRow.children[x];
  const selectedRadio = document.querySelector('input[name="figure"]:checked');  
  const selectedFigureType = selectedRadio.value;

  let figure = document.createElement('img');
  figure.setAttribute('src', `img/${selectedTransformFigureColor}/${selectedTransformFigureColor}${selectedFigureType}.png`);
  virtualBoard[y][x].type = selectedFigureType.toLowerCase();
  selectedTransformFigureSquare.removeChild(selectedTransformFigureSquare.firstChild);
  selectedTransformFigureSquare.appendChild(figure);

  modalOverlay.style.display = 'none';
  pawnTransformContainer.style.display = 'none';
  document.body.style.overflow = '';
  //check();
  //checkMate();
}

function findKing (color) {
  const king = document.querySelector(`.king.${color}`);
  const kingSquare = king.parentElement;
  const kingRow = kingSquare.parentElement;
  const cordx = Array.from(kingRow.children).indexOf(kingSquare);
  const cordy = kingRow.id.slice(1);
  return [cordx, cordy, king];
}

function checkMate () {
  let result = false;
  const color = moveTurn;
  const opColor = moveTurn == 'white' ? 'Чёрных' : "Белых";
  const allFigures = document.querySelectorAll(`.${color}`);

  for (const figure of allFigures) {
    const squares = searchAllAvailableSquares(figure);
    if (squares[0].length != 0 || squares[1].length != 0) {
      console.log(squares[0].length, squares[1].length);
      result = true;
      return result;
    }
  }
  setTimeout(() => {
    turnStatus.textContent = 'Мат. Игра окончена.';
    alert(`Игра окончена. Победа ${opColor}`);
  }, 250);
  turnStatus.textContent = 'game-over';
  return result;
}

function imageMove (startCoord, endCoord, flag = 'move') {
  const imageStartRow = document.querySelector(`#_${startCoord.y}`);

  const imageStartSquare = imageStartRow.children[startCoord.x];
  const startImage = imageStartSquare.children[0];

  const imageEndRow = document.querySelector(`#_${endCoord.y}`);
  const imageEndSquare = imageEndRow.children[endCoord.x];
  if (flag == 'eat') {
    imageEndSquare.removeChild(imageEndSquare.firstChild);
  }

  imageEndSquare.appendChild(startImage);
}
confirmButton.addEventListener('click', hideModal);
//table.addEventListener('click', targetCell);