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
  let i = 0;
  for (let square of blackPawnSquares) {
    let blackPawnImg = createFigure('black', 'Pawn');
    square.appendChild(blackPawnImg);
    virtualBoard[blackPawnRow.id.slice(1)][i] = {
      color: 'black',
      type: 'pawn',
      isMove: false
    };
    i++;
  }
  i = 0;
  for (let square of whitePawnSquares) {
    let whitePawnImg = createFigure('white', 'Pawn');
    square.appendChild(whitePawnImg);
    virtualBoard[whitePawnRow.id.slice(1)][i] = {
      color: 'white',
      type: 'pawn',
      isMove: false
    };
    i++;
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
      virtualBoard[lastRow.id.slice(1)][i] = {
        color: 'white',
        type: 'horse',
        isMove: false
      };
      whiteHorseSquares[i].appendChild(whiteHorseImg);
      virtualBoard[firstRow.id.slice(1)][i] = {
        color: 'black',
        type: 'horse',
        isMove: false
      };
      
    }
  }
}

function fillBishop () {
  let blackBishopSquares = [firstRow.children[2], firstRow.children[5]];
  let whiteBishopSquares = [lastRow.children[2], lastRow.children[5]];

  for (let i = 0; i < 2; i++) {
    let blackBishopImg = createFigure('black', 'Bishop');
    let whiteBishopImg = createFigure('white', 'Bishop');
    let index = i == 0 ? 2 : 5;
    blackBishopSquares[i].appendChild(blackBishopImg);
    virtualBoard[firstRow.id.slice(1)][index] = {
        color: 'black',
        type: 'bishop',
        isMove: false
    };
    whiteBishopSquares[i].appendChild(whiteBishopImg);
    virtualBoard[lastRow.id.slice(1)][index] = {
      color: 'white',
      type: 'bishop',
      isMove: false
    };
  }
}

function fillKing () {
  let blackKingSquare = firstRow.children[4];
  let whiteKingSquare = lastRow.children[4];

  let blackKingImg = document.createElement('img');
  let whiteKingImg = document.createElement('img');

  blackKingImg.setAttribute('src', 'img/black/blackKing.png');
  blackKingImg.classList.add('black', 'king', 'not-go');
  virtualBoard[firstRow.id.slice(1)][4] = {
    color: 'black',
    type: 'king',
    isMove: false
  };
  whiteKingImg.setAttribute('src', 'img/white/whiteKing.png');
  whiteKingImg.classList.add('white', 'king', 'not-go');
  virtualBoard[lastRow.id.slice(1)][4] = {
    color: 'white',
    type: 'king',
    isMove: false
  };

  blackKingSquare.appendChild(blackKingImg);
  whiteKingSquare.appendChild(whiteKingImg);
}

function fillQueen () {
  let blackQueenSquare = firstRow.children[3];
  let whiteQueenSquare = lastRow.children[3];

  let blackQueenImg = createFigure('black', 'Queen');
  virtualBoard[firstRow.id.slice(1)][3] = {
    color: 'black',
    type: 'queen',
    isMove: false
  };
  let whiteQueenImg = createFigure('white', 'Queen');
  virtualBoard[lastRow.id.slice(1)][3] = {
    color: 'white',
    type: 'queen',
    isMove: false
  };

  blackQueenSquare.appendChild(blackQueenImg);
  whiteQueenSquare.appendChild(whiteQueenImg);
}

function fillRook () {
  let blackRookSquares = [firstRow.children[0], firstRow.children[7]];
  let whiteRookSquares = [lastRow.children[0], lastRow.children[7]];

  for (let i = 0; i < 2; i++) {
    let blackRookImg = createFigure('black', 'Rook');
    let whiteRookImg = createFigure('white', 'Rook');
    let index = i == 0 ? 0 : 7;
    blackRookImg.classList.add('not-go');
    whiteRookImg.classList.add('not-go');
    blackRookSquares[i].appendChild(blackRookImg);
    virtualBoard[firstRow.id.slice(1)][index] = {
      color: 'black',
      type: 'rook',
      isMove: false
    };
    whiteRookSquares[i].appendChild(whiteRookImg);
    virtualBoard[lastRow.id.slice(1)][index] = {
      color: 'white',
      type: 'rook',
      isMove: false
    };
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


