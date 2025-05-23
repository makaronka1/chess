const table = document.querySelector('.table');
let selectedFigure;

const handlers = [
  { fn: figureMove, priority: 0 },
  { fn: figureEat, priority: 1 }
];


function createCube (color) {
  if (color == 'light-brown') {
    let lightBrownCube = document.createElement('div');
    lightBrownCube.classList.add('cube', 'light-brown-cube');
    return lightBrownCube;
  } else if (color == 'brown') {
    let brownCube = document.createElement('div');
    brownCube.classList.add('cube', 'brown-cube');
    return brownCube;
  } else {
    return;
  }
}

function createRow (startColor) {
  let row = document.createElement('div');
  row.classList.add('row');

  if (startColor == 'light-brown') {
    row.classList.add('light-brown-start');

    for (let i = 1; i < 9; i++) {
      if (i % 2 == 0) {
        let cube = createCube('brown');
        row.appendChild(cube);
      } else if (i % 2 != 0) {
        let cube = createCube('light-brown');
        row.appendChild(cube);
      }
    }
    return row;
  } else if (startColor == 'brown') {
    row.classList.add('brown-start');

    for (let i = 1; i < 9; i++) {
      if (i % 2 == 0) {
        let cube = createCube('light-brown');
        row.appendChild(cube);
      } else if (i % 2 != 0) {
        let cube = createCube('brown');
        row.appendChild(cube);
      }
    }
    return row;
  } else {
    return;
  }
}

function fillTable () {
  let rowCount = 1;
  for (let i = 1; i < 9; i++) {
    if (i % 2 == 0) {
      let brownRow = createRow('brown');
      brownRow.id = '_' + rowCount;
      rowCount++;
      table.appendChild(brownRow);
    } else if (i % 2 != 0) {
      let lightBrownRow = createRow('light-brown');
      lightBrownRow.id = '_' + rowCount;
      rowCount++;
      table.appendChild(lightBrownRow);
    }
  }
}

function fillPawn () {
  const blackPawnRow = document.querySelector("#_2");
  const whitePawnRow = document.querySelector('#_7');

  let blackPawnSquares = blackPawnRow.children;
  let whitePawnSquares = whitePawnRow.children;

  for (let square of blackPawnSquares) {
    let blackPawnImg = document.createElement('img');
    blackPawnImg.setAttribute('src', 'img/black/blackPawn.png');
    blackPawnImg.setAttribute('class', 'black-pawn');
    square.appendChild(blackPawnImg);
  }

  for (let square of whitePawnSquares) {
    let whitePawnImg = document.createElement('img');
    whitePawnImg.setAttribute('src', 'img/white/whitePawn.png');
    whitePawnImg.setAttribute('class', 'white-pawn');
    square.appendChild(whitePawnImg);
  }
}

function fillHorse () {
  let blackHorseSquares = firstRow.children;
  let whiteHorseSquares = lastRow.children;

  for (let i = 0; i < 8; i++) {
    if (i == 1 || i == 6) {
      let blackHorseImg = document.createElement('img');
      let whiteHorseImg = document.createElement('img');

      blackHorseImg.setAttribute('src', 'img/black/blackHorse.png');
      whiteHorseImg.setAttribute('src', 'img/white/whiteHorse.png');

      blackHorseSquares[i].appendChild(blackHorseImg);
      whiteHorseSquares[i].appendChild(whiteHorseImg);
    }
  }
}

function fillBishop () {
  let blackBishopSquares = [firstRow.children[2], firstRow.children[5]];
  let whiteBishopSquares = [lastRow.children[2], lastRow.children[5]];

  for (let i = 0; i < 2; i++) {
    let blackBishopImg = document.createElement('img');
    let whiteBishopImg = document.createElement('img');
    
    blackBishopImg.setAttribute('src', 'img/black/blackBishop.png');
    whiteBishopImg.setAttribute('src', 'img/white/whiteBishop.png');

    blackBishopSquares[i].appendChild(blackBishopImg);
    whiteBishopSquares[i].appendChild(whiteBishopImg);
  }
}

function fillKing () {
  let blackKingSquare = firstRow.children[4];
  let whiteKingSquare = lastRow.children[4];

  let blackKingImg = document.createElement('img');
  let whiteKingImg = document.createElement('img');

  blackKingImg.setAttribute('src', 'img/black/blackKing.png');
  whiteKingImg.setAttribute('src', 'img/white/whiteKing.png');

  blackKingSquare.appendChild(blackKingImg);
  whiteKingSquare.appendChild(whiteKingImg);
}

function fillQueen () {
  let blackQueenSquare = firstRow.children[3];
  let whiteQueenSquare = lastRow.children[3];

  let blackQueenImg = document.createElement('img');
  let whiteQueenImg = document.createElement('img');

  blackQueenImg.setAttribute('src', 'img/black/blackQueen.png');
  whiteQueenImg.setAttribute('src', 'img/white/whiteQueen.png');

  blackQueenSquare.appendChild(blackQueenImg);
  whiteQueenSquare.appendChild(whiteQueenImg);
}

function fillRook () {
  let blackRookSquares = [firstRow.children[0], firstRow.children[7]];
  let whiteRookSquares = [lastRow.children[0], lastRow.children[7]];

  for (let i = 0; i < 2; i++) {
    let blackRookImg = document.createElement('img');
    let whiteRookImg = document.createElement('img');
    
    blackRookImg.setAttribute('src', 'img/black/blackRook.png');
    whiteRookImg.setAttribute('src', 'img/white/whiteRook.png');

    blackRookSquares[i].appendChild(blackRookImg);
    whiteRookSquares[i].appendChild(whiteRookImg);
  }
}

function targetCell (event) {
  console.log(event.target.parentElement);
}

/*table.addEventListener('click', targetCell);*/

fillTable();

const firstRow = document.querySelector("#_1");
const lastRow = document.querySelector('#_8');

function pawnMove (event) {
  const eventTarget = event.target;
  const eventTargetSquare = eventTarget.parentElement;
  const eventTargetRow = eventTargetSquare.parentElement;
  const squareIndex = Array.from(eventTargetRow.children).indexOf(eventTargetSquare);

  moveCheck('pawn', eventTarget, eventTargetRow.id, squareIndex);
  eatingCheck('pawn', eventTarget, eventTargetRow.id, squareIndex);
}

function removeHighlightedSquares () {
  let highlightedGreenSquares = document.querySelectorAll('.highlight-green');
  let highlightedRedSquares = document.querySelectorAll('.highlight-red');

  for (let square of highlightedGreenSquares) {
    square.classList.remove('highlight-green');
    square.removeEventListener('click', figureMove);
  }

  for (let square of highlightedRedSquares) {
    square.classList.remove('highlight-red');
    square.removeEventListener('click', figureEat);
  }
}

function moveCheck (figure, target, figureRowId, figureSquareIndex) {
  selectedFigure = target;
  removeHighlightedSquares();
  const clearFigureRowId = figureRowId.slice(1);
  /*----------------------------------------Пешка---------------------------------------*/
  if (figure == 'pawn') {
    if (target.classList.contains('white-pawn')) {
      if (clearFigureRowId == '7') {
        const stepsNumber = 2;

        for (let i = 1; i <= stepsNumber; i++) {
          try {
            const targetRow = document.querySelector(`#_${clearFigureRowId - i}`);
            const targetSquare = targetRow.children[figureSquareIndex];

            if (targetSquare.hasChildNodes()) {
              return;
            } else if (!targetSquare.hasChildNodes()) {
              targetSquare.classList.add('highlight-green');
              availableMoveSquares();
            }
          } catch {
            console.log('ход невозможен');
          }
          
        }

      } else {
        const stepsNumber = 1;

        try {
          const targetRow = document.querySelector(`#_${clearFigureRowId - stepsNumber}`);
          const targetSquare = targetRow.children[figureSquareIndex];

          if (targetSquare.hasChildNodes()) {
            return;
          } else if (!targetSquare.hasChildNodes()) {
            targetSquare.classList.add('highlight-green');
            availableMoveSquares();
          }
        } catch {
          console.log('ход невозможен');
        }
         
      }
    } else if (target.classList.contains('black-pawn')) {
      if (clearFigureRowId == '2') {
        const stepsNumber = 2;

        try {
          for (let i = 1; i <= stepsNumber; i++) {
            const targetRow = document.querySelector(`#_${parseInt(clearFigureRowId) + parseInt(i)}`);
            const targetSquare = targetRow.children[figureSquareIndex];
  
            if (targetSquare.hasChildNodes()) {
              return;
            } else if (!targetSquare.hasChildNodes()) {
              targetSquare.classList.add('highlight-green');
              availableMoveSquares();
            }
          }  
        } catch {
          console.log('ход невозможен');
        }
        
      } else {
        const stepsNumber = 1;

        try {
          const targetRow = document.querySelector(`#_${clearFigureRowId + stepsNumber}`);
          const targetSquare = targetRow.children[figureSquareIndex];
  
          if (targetSquare.hasChildNodes()) {
            return;
          } else if (!targetSquare.hasChildNodes()) {
            targetSquare.classList.add('highlight-green');
          }
        } catch {
          console.log('ход невозможен');
        }

      }
    }
  }
  /*--------------------------------------------------------------------------------------*/
}

function eatingCheck (figure, target, figureRowId, figureSquareIndex) {
  const clearFigureRowId = figureRowId.slice(1);

  if (figure == 'pawn') {
    if (target.classList.contains('white-pawn')) {
      const targetRow = document.querySelector(`#_${clearFigureRowId - 1}`);

      try {
        let targetLeftSquare = targetRow.children[figureSquareIndex - 1];

        if (targetLeftSquare.hasChildNodes()) {
          targetLeftSquare.classList.add('highlight-red');
          availableEatSquares();
        }
      } catch {
        console.log("Невозможно съесть слева")
      }

      try {
        let targetRightSquare = targetRow.children[parseInt(figureSquareIndex) + parseInt(1)];

        if (targetRightSquare.hasChildNodes()) {
          targetRightSquare.classList.add('highlight-red');
          availableEatSquares();
        }
      } catch {
        console.log("Невозможно съесть справа")
      }
 
    }

  }
}

function availableEatSquares () {
  let availableSquares = document.querySelectorAll('.highlight-red');
  console.log(availableSquares)
  availableSquares.forEach(square => {
    square.addEventListener('click', function(e) {
      figureEat(e);
      e.stopImmediatePropagation(); // Блокирует другие обработчики
    }, true); // Используем фазу capturing
  });
}

function availableMoveSquares () {
  let availableSquares = document.querySelectorAll('.highlight-green');
  for (let square of availableSquares) {
    square.addEventListener('click', figureMove);
  }
}

function figureMove (event) {
  const target = event.target;
  console.log(target);
  target.appendChild(selectedFigure);
  selectedFigure = null;
  removeHighlightedSquares();
}

function figureEat(event) {
  const target = event.target;
  const parentTarget = target.parentElement; // Получаем клетку (.square)
  
  // 1. Удаляем съеденную фигуру
  parentTarget.removeChild(target);
  
  // 2. Перемещаем нашу фигуру
  parentTarget.appendChild(selectedFigure);
  
  // 3. Обновляем глобальную ссылку на фигуру
  selectedFigure = parentTarget.firstChild;
  
  // 4. Очищаем выделения
  removeHighlightedSquares();
}

function fillFigures () {
  fillBishop();
  fillHorse();
  fillKing();
  fillPawn();
  fillQueen();
  fillRook();
}

fillPawn();

const allWhitePawns = document.querySelectorAll('.white-pawn');
const allBlackPawns = document.querySelectorAll('.black-pawn');


for (let whitePawn of allWhitePawns) {
  whitePawn.addEventListener('click', pawnMove);
}

for (let blackPawn of allBlackPawns) {
  blackPawn.addEventListener('click', pawnMove);
}