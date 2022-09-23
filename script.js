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

    let setPlayer = (player) => {
      this.player = player;
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

  let play = (tileNum) => {
    let tile = getTile(tileNum);
    let player = controller.nextPlayer();
    tile.setPlayer();
    player.playTurn();
  };

  return { getPlayers, getGameboard, getTile, play };
})();

let controller = (() => {
  let players = gameboard.getPlayers();
  let playerOne = players[0];
  let playerTwo = players[1];

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
    if (playerOne.getTurnsPlayed() === playerTwo.getTurnsPlayed()) {
      return playerOne;
    } else {
      return playerTwo;
    } 
  };

  let condition = (move) => {
    for (const winMove of winningMoves) {
      (function () {
        if (winMove.includes(move)) {
          let playerTileCount;
          for (const tileNum of winMove) {
          }
        }
      }.call(winMove));
    }
  };

  return { nextPlayer, condition };
})();

let display = (() => {
  const gameContainer = document.createElement("div");
  gameContainer.classList.add("game-container");
  document.body.appendChild(gameContainer);

  for (i = 0; i < 9; i++) {
    let tileElement = document.createElement("div");
    tileElement.classList.add("tile");
    tileElement.dataset.tileNumber = i;
    gameContainer.appendChild(tileElement);
  }

  gameContainer.addEventListener("click", (e) => {
    let tileElement = e.target
    if (tileElement.classList.contains("tile")) {
        let tileNum = tileElement.dataset.tileNumber;
      //check which player has next turn
      let player = controller.nextPlayer();
      //update display
        tileElement.innerHTML = player.getModel();
      //call gameboard.play()
      gameboard.play(tileNum);
    }
  });
})();

