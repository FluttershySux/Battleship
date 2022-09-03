import Player from './factories/player';
import { displayGameOver, registerHit } from './dom';

const players = {
  user: new Player('user'),
  computer: new Player('computer'),
};

// Set user turn to true on game start
function init() {
  players.user.setTurn();
}

function checkGameOver(gameboard) {
  if (gameboard.isGameOver()) {
    displayGameOver();
    return false;
  }
  return true;
}

// Alternates turns. If user/computer turn is true, set it to false and vice versa
function turnController() {
  players.user.setTurn();
  players.computer.setTurn();
  if (players.computer.getTurn()) {
    players.computer.setConsideringAttack();
    // eslint-disable-next-line no-use-before-define
    setTimeout(aiPlay, 500);
  }
}

function attack(gameboard, e) {
  // Considering attack prevents user from taking their turn while setTimeout for the ai's turn is active
  if (!players.computer.consideringAttack()) {
    if (players.user.getTurn()) {
      const { x, y } = {
        x: parseInt(e.target.dataset.x, 10),
        y: parseInt(e.target.dataset.y, 10),
      };

      if (players.user.attack(x, y, gameboard)) {
        registerHit(gameboard, players.user.name);
        if (checkGameOver(gameboard)) turnController();
      }
    } else {
      players.computer.randomAttack(gameboard);
      registerHit(gameboard, players.computer.name);
      if (checkGameOver(gameboard)) turnController();
    }
  }
}

function aiPlay() {
  players.computer.setConsideringAttack();
  attack(players.user.gameboard);
}

export { players, init, attack };
