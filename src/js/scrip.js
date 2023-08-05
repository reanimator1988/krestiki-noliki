"use strict";


const cells = document.querySelectorAll('[data-cell]');
const resetButton = document.querySelector('.reset-btn');

let board = [null, null, null, null, null, null, null, null, null];
let currentPlayer = 'X';

let xWins = 0;
let oWins = 0;

function checkWin(player) {
  const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winCombinations.some(combination =>
    combination.every(cell => board[cell] === player)
  );
}

function checkTie() {
  return board.every(cell => cell !== null);
}

let isProcessingMove = false;

function makeMove(cellIndex) {
    if (isProcessingMove) {
        return;
      }

  if (board[cellIndex] === null) {
    isProcessingMove = true;
    board[cellIndex] = currentPlayer;

    cells[cellIndex].textContent = currentPlayer;
    cells[cellIndex].classList.add('fade-in');

    if (checkWin(currentPlayer)) {
      const winCombination = getWinCombination(currentPlayer);
      const colors = getUniqueRandomColors(3);

      setTimeout(() => {
        highlightWinningCells(winCombination, colors);
        alert(`${currentPlayer} победил!`);
        resetGame();
        isProcessingMove = false;
      }, 300);
    } else if (checkTie()) {
      setTimeout(() => {
        alert('Ничья!');
        resetGame();
      }, 300);
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      isProcessingMove = false;
    }

    if (currentPlayer === 'X') {
        cells[cellIndex].classList.add('burningX');
        cells[cellIndex].classList.remove('burningO'); // Убираем анимацию у нолика
        setTimeout(() => cells[cellIndex].classList.remove('burningX'), 1500);
      } else {
        cells[cellIndex].classList.add('burningO');
        cells[cellIndex].classList.remove('burningX'); // Убираем анимацию у крестика
        setTimeout(() => cells[cellIndex].classList.remove('burningO'), 1500);
      }
    }
    if (checkWin(currentPlayer)) {
        if (currentPlayer === 'X') {
          xWins++;
        } else {
          oWins++;
        }
        updateScore();
      }
}

function updateScore() {
    document.getElementById('xScore').textContent = xWins;
    document.getElementById('oScore').textContent = oWins;

    if (xWins >= 5 || oWins >= 5) {
      const winner = xWins >= 5 ? 'X' : 'O';
      const loser = xWins >= 5 ? 'O' : 'X';
      const winnerScore = xWins >= 5 ? xWins : oWins;
      const loserScore = xWins >= 5 ? oWins : xWins;
      setTimeout(() => {
        alert(`${winner} победил со счётом ${winnerScore}-${loserScore}!`);
        resetGame();
      }, 300);
    }
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getWinCombination(player) {
  const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winCombinations.find(combination =>
    combination.every(cell => board[cell] === player)
  );
}

function highlightWinningCells(combination, colors) {
  combination.forEach(cellIndex => {
    cells[cellIndex].style.backgroundColor = colors.pop();
  });
}

function getUniqueRandomColors(count) {
  const colors = ['#FF5733', '#33FF57', '#5733FF', '#33FFFF', '#FF33FF', '#FFFF33'];
  const uniqueColors = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const color = colors.splice(randomIndex, 1)[0];
    uniqueColors.push(color);
  }

  return uniqueColors;
}

function resetGame() {
    board = [null, null, null, null, null, null, null, null, null];
    currentPlayer = 'X';
    isProcessingMove = false;

    if (xWins >= 5 || oWins >= 5) {
        xWins = 0;
        oWins = 0;

        updateScore();
      }

    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('fade-in');
      cell.style.backgroundColor = 'transparent';
      cell.classList.remove('burningX');
      cell.classList.remove('burningO'); 
    });

    updateScore();
  }

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => makeMove(index));
});

function removeAnimationClass(event) {
    event.target.classList.remove('fade-in');
  }
  
  cells.forEach((cell) => {
    cell.addEventListener('transitionend', removeAnimationClass);
  });
  
  resetButton.addEventListener('click', () => {
    xWins = 0;
    oWins = 0;
    resetGame();
  });