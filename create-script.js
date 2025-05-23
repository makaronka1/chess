const table = document.querySelector('.table');

let virtualBoard = Array(8).fill().map(() => Array(8).fill(null));

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
  let rowCount = 0;
  for (let i = 0; i < 8; i++) {
    if (i % 2 == 0) {
      let brownRow = createRow('light-brown');
      brownRow.id = '_' + rowCount;
      rowCount++;
      table.appendChild(brownRow);
    } else if (i % 2 != 0) {
      let lightBrownRow = createRow('brown');
      lightBrownRow.id = '_' + rowCount;
      rowCount++;
      table.appendChild(lightBrownRow);
    }
  }
}

function createFigure (color, type) {
  let img = document.createElement('img');
  img.setAttribute('src', `img/${color}/${color}${type}.png`);
  img.classList.add(color, type.toLowerCase());

  return img;
}

function fillPawn () {
  const blackPawnRow = document.querySelector("#_1");
  const whitePawnRow = document.querySelector('#_6');

  let blackPawnSquares = blackPawnRow.children;
  let whitePawnSquares = whitePawnRow.children;
  
  for (let square of blackPawnSquares) {
    let blackPawnImg = createFigure('black', 'Pawn');
    square.appendChild(blackPawnImg);
  }

  for (let square of whitePawnSquares) {
    let whitePawnImg = createFigure('white', 'Pawn');
    square.appendChild(whitePawnImg);
  }
}

function fillHorse () {
  let blackHorseSquares = firstRow.children;
  let whiteHorseSquares = lastRow.children;

  for (let i = 0; i < 8; i++) {
    if (i == 1 || i == 6) {

      const blackHorseImg = createFigure('black', 'Horse');
      const whiteHorseImg = createFigure('white', 'Horse');

      blackHorseSquares[i].appendChild(blackHorseImg);
      whiteHorseSquares[i].appendChild(whiteHorseImg);
    }
  }
}

function fillBishop () {
  let blackBishopSquares = [firstRow.children[2], firstRow.children[5]];
  let whiteBishopSquares = [lastRow.children[2], lastRow.children[5]];

  for (let i = 0; i < 2; i++) {
    let blackBishopImg = createFigure('black', 'Bishop');
    let whiteBishopImg = createFigure('white', 'Bishop');

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
  blackKingImg.classList.add('black', 'king', 'not-go');
  whiteKingImg.setAttribute('src', 'img/white/whiteKing.png');
  whiteKingImg.classList.add('white', 'king', 'not-go');

  blackKingSquare.appendChild(blackKingImg);
  whiteKingSquare.appendChild(whiteKingImg);
}

function fillQueen () {
  let blackQueenSquare = firstRow.children[3];
  let whiteQueenSquare = lastRow.children[3];

  let blackQueenImg = createFigure('black', 'Queen');
  let whiteQueenImg = createFigure('white', 'Queen');

  blackQueenSquare.appendChild(blackQueenImg);
  whiteQueenSquare.appendChild(whiteQueenImg);
}

function fillRook () {
  let blackRookSquares = [firstRow.children[0], firstRow.children[7]];
  let whiteRookSquares = [lastRow.children[0], lastRow.children[7]];

  for (let i = 0; i < 2; i++) {
    let blackRookImg = createFigure('black', 'Rook');
    let whiteRookImg = createFigure('white', 'Rook');
    blackRookImg.classList.add('not-go');
    whiteRookImg.classList.add('not-go');
    blackRookSquares[i].appendChild(blackRookImg);
    whiteRookSquares[i].appendChild(whiteRookImg);
  }
}

function createInvisibleClone (figure) {
  let clone = document.createElement('img');
  clone.classList.add(figure.classList.item(0), figure.classList.item(1));
  return clone;
}




fillTable();

const firstRow = document.querySelector("#_0");
const lastRow = document.querySelector('#_7');


function fillFigures () {
  fillBishop();
  fillHorse();
  fillKing();
  fillPawn();
  fillQueen();
  fillRook();
}

fillFigures();


