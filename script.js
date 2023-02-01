let player = (name, model) => {
  let turnsPlayed = 0;
  let score = 0;

  let setName = (newName) => {
    name = newName;
  };

  let getName = () => {
    return name;
  };
  let getModel = () => {
    return model;
  };

  let getTurnsPlayed = () => {
    return turnsPlayed;
  };

  let playTurn = () => {
    turnsPlayed++;
  };

  let getScore = () => {
    return score;
  };

  let setScore = () => {
    score++;
  };

  let resetScore = () => {
    score = 0;
  };

  let resetTurns = () => {
    turnsPlayed = 0;
  };
  return {
    getName,
    getModel,
    getTurnsPlayed,
    playTurn,
    getScore,
    setScore,
    resetTurns,
    resetScore,
    setName,
  };
};

const gameboard = (() => {
  let gameboardArray = [];
  let tileCounter = 0;
  let isLocked = false;

  let tile = (number) => {
    let player;

    let setPlayer = (pl) => {
      player = pl;
    };

    let getPlayer = () => {
      return player;
    };

    return { number, setPlayer, getPlayer };
  };

  while (tileCounter < 9) {
    gameboardArray.push(Object.create(tile(tileCounter++)));
  }

  let playerOne = Object.create(player("Blue", "x"));
  let playerTwo = Object.create(player("Red", "o"));

  let getPlayers = () => {
    return [playerOne, playerTwo];
  };

  let getGameboard = () => {
    return gameboardArray;
  };

  let getTile = (tileNumber) => {
    if (tileNumber >= 0 && tileNumber < 9) {
      return gameboardArray[tileNumber];
    }
  };

  let reset = () => {
    nextGame();
    getPlayers().forEach((pl) => {
      pl.resetScore();
    });
    display.displayScore();
  };

  let nextGame = () => {
    gameboardArray = [];
    tileCounter = 0;

    while (tileCounter < 9) {
      gameboardArray.push(Object.create(tile(tileCounter++)));
    }

    getPlayers().forEach((pl) => {
      pl.resetTurns();
    });

    display.clear();
    if (isLocked) {
      display.lockToggle();
      isLocked = false;
    }
  };

  let play = (tileNum) => {
    let tile = gameboard.getTile(tileNum);
    let player = controller.nextPlayer();
    tile.setPlayer(player);
    //Must execute controller.condition() here
    if (controller.isWinningMove(tileNum)) {
      player.setScore();
      display.displayOutcome(player);
      display.lockToggle();
      isLocked = true;
      display.displayScore();
      player.playTurn();
      if (player.getScore() === 3) {
        display.displayWinnerModal(player);
        reset();
      }
    } else {
      player.playTurn();
      controller.isTie();
    }
  };

  return {
    getPlayers,
    getGameboard,
    getTile,
    play,
    reset,
    nextGame,
  };
})();

let controller = (() => {
  const winningMoves = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let nextPlayer = () => {
    if (
      gameboard.getPlayers()[0].getTurnsPlayed() ===
      gameboard.getPlayers()[1].getTurnsPlayed()
    ) {
      return gameboard.getPlayers()[0];
    } else {
      return gameboard.getPlayers()[1];
    }
  };

  let isWinningMove = (move) => {
    const player = nextPlayer();
    for (const winMove of winningMoves) {
      if (winMove.includes(move)) {
        let playerTileCount = 0;
        for (const tileNum of winMove) {
          if (gameboard.getTile(tileNum).getPlayer() === player) {
            playerTileCount++;
            if (playerTileCount === 3) {
              return true;
            }
          }
        }
      }
    }
  };

  let isTie = () => {
    if (
      gameboard.getPlayers()[0].getTurnsPlayed() +
        gameboard.getPlayers()[1].getTurnsPlayed() ==
      9
    ) {
      display.displayOutcome();
      display.lockToggle();
    }
  };

  return { nextPlayer, isWinningMove, isTie };
})();

let display = (() => {
  const gameContainer = document.querySelector(".game-container");

  const resetButton = document.querySelector(".reset-btn");
  const nextGameButton = document.querySelector(".next-game");
  const resultText = document.querySelector(".result-text");

  const blueScoreBarElement = document.getElementById("blue-bar");
  const redScoreBarElement = document.getElementById("red-bar");

  const blueScoreNumericalElement = document.getElementById("blue-score");
  const redScoreNumericalElement = document.getElementById("red-score");

  const redColor = "#eb4034";
  const blueColor = "#3452eb";

  const nameInputFields = document.querySelectorAll(".name-input");

  for (i = 0; i < 9; i++) {
    let tileElement = document.createElement("div");
    tileElement.classList.add("tile");
    tileElement.dataset.tileNumber = i;
    gameContainer.appendChild(tileElement);
  }

  gameContainer.addEventListener("click", (e) => {
    let tileElement = e.target;
    if (tileElement.classList.contains("tile")) {
      let tileNum = parseInt(tileElement.dataset.tileNumber);
      //check which player has next turn
      let player = controller.nextPlayer();
      if (gameboard.getTile(tileNum).getPlayer() === undefined) {
        //update display
        displayMove(tileElement);
        //call gameboard.play()
        gameboard.play(tileNum);
      }
    }
  });

  resetButton.addEventListener("click", () => {
    gameboard.reset();
  });

  nextGameButton.addEventListener("click", () => {
    gameboard.nextGame();
    display.toggleNextGameButton();
  });

  nameInputFields.forEach((element) => {
    element.addEventListener("input", (e) => {
      if (e.target.id === "blue-name") {
        gameboard.getPlayers()[0].setName(e.target.value);
      }
      if (e.target.id === "red-name") {
        gameboard.getPlayers()[1].setName(e.target.value);
      }
    });
  });

  let clear = () => {
    const pieces = document.querySelectorAll(".piece");
    pieces.forEach((piece) => {
      piece.remove();
    });
    resultText.innerHTML = "";
    resetButton.style = "";
    resultText.style.color = "";
  };

  let displayMove = (tileElement) => {
    let moveContainer = document.createElement("img");
    if (controller.nextPlayer().getModel() === "x") {
      moveContainer.classList.add("piece", "blue-filter");
      moveContainer.src = "img/close.png";
    } else {
      moveContainer.classList.add("piece", "red-filter");
      moveContainer.src = "img/circle.png";
    }
    tileElement.appendChild(moveContainer);
  };

  let displayOutcome = (winner) => {
    if (winner === undefined) {
      resultText.innerHTML = "It's a tie";
      //tie
    } else if (winner.getModel() === "x") {
      resultText.style.color = blueColor;
      resultText.innerHTML = `${winner.getName()} wins!`;
    } else {
      resultText.style.color = redColor;
      resultText.innerHTML = `${winner.getName()} wins!`;
    }
    toggleNextGameButton();
  };

  let toggleNextGameButton = () => {
    if (nextGameButton.hasAttribute("disabled")) {
      nextGameButton.removeAttribute("disabled");
    } else {
      nextGameButton.setAttribute("disabled", "");
    }
  };

  let displayScore = () => {
    let blueScore = gameboard.getPlayers()[0].getScore();
    let redScore = gameboard.getPlayers()[1].getScore();

    if (blueScore === redScore) {
      blueScoreBarElement.style.width = "50%";
      redScoreBarElement.style.width = "50%";
    }

    if (blueScore === redScore + 1) {
      blueScoreBarElement.style.width = "65%";
      redScoreBarElement.style.width = "35%";
    } else if (blueScore === redScore + 2) {
      blueScoreBarElement.style.width = "80%";
      redScoreBarElement.style.width = "20%";
    }

    if (redScore === blueScore + 1) {
      blueScoreBarElement.style.width = "35%";
      redScoreBarElement.style.width = "65%";
    } else if (redScore === blueScore + 2) {
      blueScoreBarElement.style.width = "20%";
      redScoreBarElement.style.width = "80%";
    }

    if (redScore === 3) {
      blueScoreBarElement.style.width = "0%";
      redScoreBarElement.style.width = "100%";
    } else if (blueScore === 3) {
      blueScoreBarElement.style.width = "100%";
      redScoreBarElement.style.width = "0%";
    }

    blueScoreNumericalElement.textContent = blueScore;
    redScoreNumericalElement.textContent = redScore;
  };

  let displayWinnerModal = (winner) => {
    const closeModal = document.querySelector(".close-button");
    const modal = document.querySelector("#modal");
    const setWinner = document.querySelector(".set-winner");
    setWinner.textContent = `The set winner is ${winner.getName()}`;
    if (winner.getModel() === "x") {
      setWinner.style.color = blueColor;
    } else {
      setWinner.style.color = redColor;
    }
    modal.showModal();

    closeModal.addEventListener("click", () => {
      modal.close();
      display.toggleNextGameButton();
    });
  };

  let lockToggle = () => {
    if (gameContainer.classList.contains("gameboard-lock")) {
      gameContainer.classList.remove("gameboard-lock");
    } else {
      gameContainer.classList.add("gameboard-lock");
    }
  };
  return {
    displayOutcome,
    displayWinnerModal,
    lockToggle,
    clear,
    displayScore,
    toggleNextGameButton,
  };
})();
