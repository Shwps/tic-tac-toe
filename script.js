let player = (name, model) => {
  let turnsPlayed = 0;

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

  return { getName, getModel, getTurnsPlayed, playTurn };
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
    gameboardArray = [];
    tileCounter = 0;

    while (tileCounter < 9) {
      gameboardArray.push(Object.create(tile(tileCounter++)));
    }

    playerOne = Object.create(player("one", "x"));
    playerTwo = Object.create(player("two", "o"));

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

  return { getPlayers, getGameboard, getTile, play, reset };
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
              display.displayOutcome(player);
              display.lockToggle();
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

  let clear = () => {
    const pieces = document.querySelectorAll(".piece");
    pieces.forEach((piece) => {
      piece.remove();
    });
    resultStatusContainer.innerHTML = "";
    resetButton.style = "";
  };

  let displayMove = (tileElement) => {
    let moveContainer = document.createElement("img");
    moveContainer.classList.add("piece");
    if (controller.nextPlayer().getModel() === "x") {
      moveContainer.src = "/img/close.png";
    } else {
      moveContainer.src = "/img/button.png";
    }
    tileElement.appendChild(moveContainer);
  };

  let displayOutcome = (winner) => {
    if (winner === undefined) {
      resultStatusContainer.innerHTML = "It's a tie";
      //tie
    } else if (winner.getModel() === "x") {
      resultStatusContainer.innerHTML = "Player X wins";
    } else {
      resultStatusContainer.innerHTML = "Player O wins";
    }
    resetButton.style = "background-color: green";
  };

  let lockToggle = () => {
    if (gameContainer.classList.contains("gameboard-lock")) {
      gameContainer.classList.remove("gameboard-lock");
    } else {
      gameContainer.classList.add("gameboard-lock");
    }
  };
  return { displayOutcome, lockToggle, clear };
})();
