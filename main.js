// константы (Узлы)
const firstPage = document.querySelector('.first-page');
const firstPageButton = firstPage.querySelector('.first-page__subtitle');
const toolTip = firstPage.querySelector('.first-page__tooltip');

const secondPage = document.querySelector('.second-page');
const secondPageItems = secondPage.querySelectorAll('.second-page__item');
const secondPageButton = secondPage.querySelector('.second-page__button');

const mainPage = document.querySelector('.main-page');
const mainPageNext = document.querySelector('.main-page__next');


// код переключения меж страничками
setTimeout(() => {
  if (firstPage.className.includes('active')) {
    toolTip.classList.add('first-page__tooltip_active');
  }
}, 1300);

firstPageButton.addEventListener('click', () => {
  firstPage.classList.remove('first-page_active');
  secondPage.classList.add('second-page_active');
});

secondPageItems.forEach((elem, index) => {
  elem.addEventListener("click", () => {
    secondPageItems.forEach(elem => elem.classList.remove('second-page__item_active'))
    secondPageButton.classList.add('second-page__button_active');
    elem.classList.add('second-page__item_active');
    if (elem.className.includes('1')) {
      img.src = './image/cosmo-1.jpg';
    }
    else if (elem.className.includes('2')) {
      img.src = './image/sur-1.jpg';
    }
    else if (elem.className.includes('3')) {
      img.src = './image/car-1.jpg';
    }
    else if (elem.className.includes('4')) {
      img.src = './image/car-1.jpg';
    }
  });
});

secondPageButton.addEventListener("click", () => {
  if (secondPageButton.className.includes('active')) {
    secondPage.classList.remove('second-page_active');
    mainPage.classList.add('main-page_active');
  }
});





// ======================== GAME CODE ========================

const PUZZLE_HOVER_TINT = "#009900";
const img = new Image();
const canvas = document.querySelector("#canvas");
const stage = canvas.getContext("2d");
let difficulty = 2;
let pieces;
let puzzleWidth;
let puzzleHeight;
let pieceWidth;
let pieceHeight;
let currentPiece;
let currentDropPiece;
let mouse;
img.addEventListener("load", onImage, false);
img.width = 350;
img.height = 500;

function initPuzzle() {
  pieces = [];
  mouse = {
    x: 0,
    y: 0
  };
  currentPiece = null;
  currentDropPiece = null;
  stage.drawImage(
    img,
    0,
    0,
    puzzleWidth,
    puzzleHeight,
    0,
    0,
    puzzleWidth,
    puzzleHeight
  );
  // createTitle("Click to Start Puzzle");
  buildPieces();
}

function setCanvas() {
  canvas.width = puzzleWidth;
  canvas.height = puzzleHeight;
  canvas.style.border = "1px solid black";
}

function onImage() {
  pieceWidth = Math.floor(img.width / difficulty);
  pieceHeight = Math.floor(img.height / difficulty);
  puzzleWidth = pieceWidth * difficulty;
  puzzleHeight = pieceHeight * difficulty;
  setCanvas();
  initPuzzle();
}

function createTitle(msg) {
  stage.fillStyle = "#000000";
  stage.globalAlpha = 0.4;
  stage.fillRect(100, puzzleHeight - 40, puzzleWidth - 200, 40);
  stage.fillStyle = "#FFFFFF";
  stage.globalAlpha = 1;
  stage.textAlign = "center";
  stage.textBaseline = "middle";
  stage.font = "20px Arial";
  stage.fillText(msg, puzzleWidth / 2, puzzleHeight - 20);
}

function buildPieces() {
  let i;
  let piece;
  let xPos = 0;
  let yPos = 0;
  for (i = 0; i < difficulty * difficulty; i++) {
    piece = {};
    piece.sx = xPos;
    piece.sy = yPos;
    pieces.push(piece);
    xPos += pieceWidth;
    if (xPos >= puzzleWidth) {
      xPos = 0;
      yPos += pieceHeight;
    }
  }
  document.onpointerdown = shufflePuzzle;
}

function shufflePuzzle() {
  pieces = shuffleArray(pieces);
  stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
  let xPos = 0;
  let yPos = 0;
  for (const piece of pieces) {
    piece.xPos = xPos;
    piece.yPos = yPos;
    stage.drawImage(
      img,
      piece.sx,
      piece.sy,
      pieceWidth,
      pieceHeight,
      xPos,
      yPos,
      pieceWidth,
      pieceHeight
    );
    stage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
    xPos += pieceWidth;
    if (xPos >= puzzleWidth) {
      xPos = 0;
      yPos += pieceHeight;
    }
  }
  document.onpointerdown = onPuzzleClick;
}

function checkPieceClicked() {
  for (const piece of pieces) {
    if (
      mouse.x < piece.xPos ||
      mouse.x > piece.xPos + pieceWidth ||
      mouse.y < piece.yPos ||
      mouse.y > piece.yPos + pieceHeight
    ) {
      //PIECE NOT HIT
    } else {
      return piece;
    }
  }
  return null;
}

function updatePuzzle(e) {
  currentDropPiece = null;
  if (e.layerX || e.layerX == 0) {
    mouse.x = e.layerX - canvas.offsetLeft;
    mouse.y = e.layerY - canvas.offsetTop;
  } else if (e.offsetX || e.offsetX == 0) {
    mouse.x = e.offsetX - canvas.offsetLeft;
    mouse.y = e.offsetY - canvas.offsetTop;
  }
  stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
  for (const piece of pieces) {
    if (piece == currentPiece) {
      continue;
    }
    stage.drawImage(
      img,
      piece.sx,
      piece.sy,
      pieceWidth,
      pieceHeight,
      piece.xPos,
      piece.yPos,
      pieceWidth,
      pieceHeight
    );
    stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
    if (currentDropPiece == null) {
      if (
        mouse.x < piece.xPos ||
        mouse.x > piece.xPos + pieceWidth ||
        mouse.y < piece.yPos ||
        mouse.y > piece.yPos + pieceHeight
      ) {
        //NOT OVER
      } else {
        currentDropPiece = piece;
        stage.save();
        stage.globalAlpha = 0.4;
        stage.fillStyle = PUZZLE_HOVER_TINT;
        stage.fillRect(
          currentDropPiece.xPos,
          currentDropPiece.yPos,
          pieceWidth,
          pieceHeight
        );
        stage.restore();
      }
    }
  }
  stage.save();
  stage.globalAlpha = 0.6;
  stage.drawImage(
    img,
    currentPiece.sx,
    currentPiece.sy,
    pieceWidth,
    pieceHeight,
    mouse.x - pieceWidth / 2,
    mouse.y - pieceHeight / 2,
    pieceWidth,
    pieceHeight
  );
  stage.restore();
  stage.strokeRect(
    mouse.x - pieceWidth / 2,
    mouse.y - pieceHeight / 2,
    pieceWidth,
    pieceHeight
  );
}

function onPuzzleClick(e) {
  if (e.layerX || e.layerX === 0) {
    mouse.x = e.layerX - canvas.offsetLeft;
    mouse.y = e.layerY - canvas.offsetTop;
  } else if (e.offsetX || e.offsetX === 0) {
    mouse.x = e.offsetX - canvas.offsetLeft;
    mouse.y = e.offsetY - canvas.offsetTop;
  }
  currentPiece = checkPieceClicked();
  if (currentPiece !== null) {
    stage.clearRect(
      currentPiece.xPos,
      currentPiece.yPos,
      pieceWidth,
      pieceHeight
    );
    stage.save();
    stage.globalAlpha = 0.9;
    stage.drawImage(
      img,
      currentPiece.sx,
      currentPiece.sy,
      pieceWidth,
      pieceHeight,
      mouse.x - pieceWidth / 2,
      mouse.y - pieceHeight / 2,
      pieceWidth,
      pieceHeight
    );
    stage.restore();
    document.onpointermove = updatePuzzle;
    document.onpointerup = pieceDropped;
  }
}

function gameOver() {
  document.onpointerdown = null;
  document.onpointermove = null;
  document.onpointerup = null;
  initPuzzle();
  mainPageNext.classList.add('main-page__next_active');
}

function pieceDropped(e) {
  document.onpointermove = null;
  document.onpointerup = null;
  if (currentDropPiece !== null) {
    let tmp = {
      xPos: currentPiece.xPos,
      yPos: currentPiece.yPos
    };
    currentPiece.xPos = currentDropPiece.xPos;
    currentPiece.yPos = currentDropPiece.yPos;
    currentDropPiece.xPos = tmp.xPos;
    currentDropPiece.yPos = tmp.yPos;
  }
  resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin() {
  stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
  let gameWin = true;
  for (piece of pieces) {
    stage.drawImage(
      img,
      piece.sx,
      piece.sy,
      pieceWidth,
      pieceHeight,
      piece.xPos,
      piece.yPos,
      pieceWidth,
      pieceHeight
    );
    stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
    if (piece.xPos != piece.sx || piece.yPos != piece.sy) {
      gameWin = false;
    }
  }
  if (gameWin) {
    setTimeout(gameOver, 300);
  }
}

function shuffleArray(o) {
  for (
    var j, x, i = o.length;
    i;
    j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
  );
  return o;
}

function updateDifficulty(e) {
  difficulty = e.target.value;
  pieceWidth = Math.floor(img.width / difficulty);
  pieceHeight = Math.floor(img.height / difficulty);
  puzzleWidth = pieceWidth * difficulty;
  puzzleHeight = pieceHeight * difficulty;
  gameOver();
}

function onTouchStart(e) {
  e.preventDefault();
  let touch = e.touches[0];
  mouse.x = touch.pageX - canvas.offsetLeft;
  mouse.y = touch.pageY - canvas.offsetTop;
  onPuzzleClick(e);
}

function onTouchMove(e) {
  e.preventDefault();
  let touch = e.touches[0];
  mouse.x = touch.pageX - canvas.offsetLeft;
  mouse.y = touch.pageY - canvas.offsetTop;
  updatePuzzle(e);
}

function onTouchEnd(e) {
  e.preventDefault();
  // pieceDropped(e);
}
document.onpointerdown = shufflePuzzle;
canvas.addEventListener("touchstart", onTouchStart);
canvas.addEventListener("touchmove", onTouchMove);
canvas.addEventListener("touchend", onTouchEnd);