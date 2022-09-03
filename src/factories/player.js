/* eslint-disable class-methods-use-this */
import { players } from '../game';
import Gameboard from './gameboard';

export default class Player {
  constructor(name) {
    this.name = name;
    this.hits = [];
    this.isTurn = false;
    this.isConsideringAttack = false;
    this.gameboard = new Gameboard();
  }

  attack(x, y, gameboard) {
    if (!gameboard.receiveAttack(x, y, this, gameboard)) return false;
    return true;
  }

  evaluateAttack(lastShipHit, secondLastShipHit) {
    let xShip = lastShipHit.x;
    let yShip = lastShipHit.y;
    let key = '-';

    const operators = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
    };

    // If a ship has only been hit one time, the AI will try to determine if the ship is horizontally or vertically placed
    // AI fires along the x axis first, and then the y axis until an additional hit on the ship is made
    if (secondLastShipHit === undefined) {
      if (xShip + 1 < 10 && !players.user.gameboard.isShot(xShip + 1, yShip)) {
        xShip++;
      } else if (
        xShip - 1 > -1 &&
        !players.user.gameboard.isShot(xShip - 1, yShip)
      ) {
        xShip--;
      } else if (
        yShip + 1 < 10 &&
        !players.user.gameboard.isShot(xShip, yShip + 1)
      ) {
        yShip++;
      } else if (
        yShip - 1 > -1 &&
        !players.user.gameboard.isShot(xShip, yShip - 1)
      ) {
        yShip--;
      }

      return {
        xShip,
        yShip,
      };
    }

    // When a ship has been hit twice, the AI can discern if the ship is horizontally or vertically placed
    // If horizontal, the AI's attacks will be placed along the x axis. If vertical, the y axis
    if (lastShipHit.x !== secondLastShipHit.x) {
      while (players.user.gameboard.isShot(xShip, yShip)) {
        if (xShip === 0) key = '+';
        if (
          players.user.gameboard.isShot(xShip, yShip) &&
          !players.user.gameboard.isShip(xShip, yShip)
        ) {
          key = '+';
        }

        xShip = operators[key](xShip, 1);
      }

      return {
        xShip,
        yShip,
      };
    }

    if (lastShipHit.y !== secondLastShipHit.y) {
      while (players.user.gameboard.isShot(xShip, yShip)) {
        if (yShip === 0) key = '+';
        if (
          players.user.gameboard.isShot(xShip, yShip) &&
          !players.user.gameboard.isShip(xShip, yShip)
        ) {
          key = '+';
        }

        yShip = operators[key](yShip, 1);
      }

      return {
        xShip,
        yShip,
      };
    }

    return false;
  }

  randomAttack(gameboard) {
    let x;
    let y;

    // Filters hits array to get ships which have been hit but aren't sunk
    const activeShips = this.hits.filter(
      (coord) =>
        players.user.gameboard.isShip(coord.x, coord.y) &&
        !players.user.gameboard.board[coord.x][coord.y].ship.isSunk()
    );

    // If there are active ships, computer will make a logical attack
    // Else, the computer will make a completely random attack
    if (activeShips.length > 0) {
      const lastShipHit = activeShips[activeShips.length - 1];
      const secondLastShipHit = activeShips[activeShips.length - 2];

      const coords = this.evaluateAttack(lastShipHit, secondLastShipHit);

      x = coords.xShip;
      y = coords.yShip;
    } else {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    }

    if (gameboard.receiveAttack(x, y, this, gameboard)) this.recordHit(x, y);
  }

  recordHit(x, y) {
    this.hits.push({ x, y });
  }

  getHits() {
    return this.hits;
  }

  getTurn() {
    return this.isTurn;
  }

  consideringAttack() {
    return this.isConsideringAttack;
  }

  setTurn() {
    if (this.isTurn === false) {
      this.isTurn = true;
    } else {
      this.isTurn = false;
    }
  }

  setConsideringAttack() {
    if (this.isConsideringAttack === false) {
      this.isConsideringAttack = true;
    } else {
      this.isConsideringAttack = false;
    }
  }
}
