let player = (name, model) => {
  let turnsPlayed = 0;
  let score = 0;

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
  };
};

const gameboard = (() => {
  let gameboardArray = [];
  let tileCounter = 0;

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

  let playerOne = Object.create(player("one", "x"));
  let playerTwo = Object.create(player("two", "o"));

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
    display.lockToggle();
  };

  let play = (tileNum) => {
    let tile = gameboard.getTile(tileNum);
    let player = controller.nextPlayer();
    tile.setPlayer(player);
    //Must execute controller.condition() here
    controller.condition(parseInt(tileNum));
    player.playTurn();
    controller.isTie();
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

  let condition = (move) => {
    const player = nextPlayer();
    for (const winMove of winningMoves) {
      if (winMove.includes(move)) {
        let playerTileCount = 0;
        for (const tileNum of winMove) {
          if (gameboard.getTile(tileNum).getPlayer() === player) {
            playerTileCount++;
            if (playerTileCount === 3) {
              player.setScore();
              display.displayOutcome(player);
              display.lockToggle();
              display.displayScore();
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
    }
  };

  return { nextPlayer, condition, isTie };
})();

let display = (() => {
  const gameContainer = document.querySelector(".game-container");
  const resultStatusContainer = document.querySelector(
    ".result-status-container"
  );
  const resetButton = document.querySelector(".reset-btn");
  const nextGameButton = document.querySelector(".next-game");
  const resultText = document.querySelector(".result-text");
  const blueScoreElement = document.getElementById("blue");
  const redScoreElement = document.getElementById("red");

  for (i = 0; i < 9; i++) {
    let tileElement = document.createElement("div");
    tileElement.classList.add("tile");
    tileElement.dataset.tileNumber = i;
    gameContainer.appendChild(tileElement);
  }

  gameContainer.addEventListener("click", (e) => {
    let tileElement = e.target;
    if (tileElement.classList.contains("tile")) {
      let tileNum = tileElement.dataset.tileNumber;
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
      moveContainer.src = "/img/close.png";
    } else {
      moveContainer.classList.add("piece", "red-filter");
      moveContainer.src = "/img/circle.png";
    }
    tileElement.appendChild(moveContainer);
  };

  let displayOutcome = (winner) => {
    if (winner === undefined) {
      resultText.innerHTML = "It's a tie";
      //tie
    } else if (winner.getModel() === "x") {
      resultText.style.color = "#3452eb";
      resultText.innerHTML = "Player X wins";
    } else {
      resultText.style.color = "#eb4034";
      resultText.innerHTML = "Player O wins";
    }
  };

  let displayScore = () => {
    let playerOneScore = gameboard.getPlayers()[0].getScore();
    let playerTwoScore = gameboard.getPlayers()[1].getScore();

    if (playerOneScore === playerTwoScore) {
      blueScoreElement.style.width = "50%";
      redScoreElement.style.width = "50%";
    }

    if (playerOneScore === playerTwoScore + 1) {
      blueScoreElement.style.width = "65%";
      redScoreElement.style.width = "35%";
    }else if (playerOneScore === playerTwoScore + 2) {
      blueScoreElement.style.width = "80%";
      redScoreElement.style.width = "20%";
    }

    if (playerTwoScore === playerOneScore + 1) {
      blueScoreElement.style.width = "35%";
      redScoreElement.style.width = "65%";
    } else if (playerTwoScore === playerOneScore + 2) {
      blueScoreElement.style.width = "20%";
      redScoreElement.style.width = "80%";
    }

    if (playerTwoScore === 3) {
      blueScoreElement.style.width = "0%";
      redScoreElement.style.width = "100%";
    } else if (playerOneScore === 3) {
      blueScoreElement.style.width = "100%";
      redScoreElement.style.width = "0%";
    }
  };

  let lockToggle = () => {
    if (gameContainer.classList.contains("gameboard-lock")) {
      gameContainer.classList.remove("gameboard-lock");
    } else {
      gameContainer.classList.add("gameboard-lock");
    }
  };
  return { displayOutcome, lockToggle, clear, displayScore };
})();
