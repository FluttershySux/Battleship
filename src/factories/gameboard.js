import Ship from './ship';

export default class Gameboard {
  constructor() {
    this.board = [];
    this.initialiseBoard();
  }

  // Push object to each square of array to determine if location has ship or is shot
  initialiseBoard() {
    for (let i = 0; i < 10; i++) {
      this.board.push([]);
      for (let j = 0; j < 10; j++) {
        this.board[i].push({ ship: false, shot: false });
      }
    }
  }

  // Ensures ships cannot be placed on top of each other or within one square of one another
  isPlacementPossible(x, y, ship, alignment) {
    for (let i = 0; i < ship.length; i++) {
      if (alignment === 'column') {
        if (
          this.board[x][y + i].ship ||
          this.board[x][y + i].placementUnavailable
        ) {
          return false;
        }
      } else if (
        this.board[x + i][y].ship ||
        this.board[x + i][y].placementUnavailable
      ) {
        return false;
      }
    }
    return true;
  }

  placeShip(x, y, alignment, ship) {
    if (!this.isPlacementPossible(x, y, ship, alignment)) return false;
    for (let i = 0; i < ship.length; i++) {
      if (alignment === 'column') {
        this.board[x][y + i].ship = ship;
      } else {
        this.board[x + i][y].ship = ship;
      }
    }
    return true;
  }

  receiveAttack(x, y, player, gameboard) {
    if (this.board[x][y].shot === true) {
      if (player.name === 'computer') {
        player.randomAttack(gameboard);
      }
      return false;
    }
    if (this.board[x][y].ship) {
      this.board[x][y].ship.hit(x, y);
    }
    this.board[x][y].shot = true;
    return true;
  }

  // Prevents ships being dragged from being placed next to placed ships
  checkAround() {
    // i = row (if vertical), j = column (if vertical), k = squares adjacent to the ship
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.board[i][j].ship) {
          for (let k = -1; k < 2; k += 2) {
            if (
              i + k > -1 &&
              i + k < 10 &&
              this.board[i + k][j].ship === false
            ) {
              // Highlights squares to the side of ship or the ends depending on alignment
              this.board[i + k][j].placementUnavailable = true;
              if (j + k > -1 && j + k < 10) {
                // Highlights diagonal squares
                this.board[i + k][j + k].placementUnavailable = true;
              }
            }
            if (j + k > -1 && j + k < 10) {
              if (this.board[i][j + k].ship === false) {
                // Highlights squares at the ends of ship or to the side depending on alignment
                this.board[i][j + k].placementUnavailable = true;
              }
              if (
                i - k > -1 &&
                i - k < 10 &&
                this.board[i - k][j + k].ship === false
              ) {
                // Highlights diagonal squares
                this.board[i - k][j + k].placementUnavailable = true;
              }
            }
          }
        }
      }
    }
  }

  placeShipsRandomly() {
    const ships = [
      new Ship(2, 'destroyer'),
      new Ship(3, 'cruiser'),
      new Ship(3, 'submarine'),
      new Ship(4, 'battleship'),
      new Ship(5, 'carrier'),
    ];

    for (let i = 0; i < ships.length; i++) {
      let x = Math.floor(Math.random() * 10);
      let y = Math.floor(Math.random() * 10);
      let alignment;

      if (Math.random() < 0.5) {
        alignment = 'row';
      } else {
        alignment = 'column';
      }

      if (alignment === 'column') {
        if (y + ships[i].length > 9) {
          y = 10 - ships[i].length;
        }
      } else if (x + ships[i].length > 9) x = 10 - ships[i].length;

      if (!this.placeShip(x, y, alignment, ships[i])) i--;
      this.checkAround();
    }
  }

  isShip(x, y) {
    if (this.board[x][y].ship) return true;
    return false;
  }

  isShot(x, y) {
    if (this.board[x][y].shot) return true;
    return false;
  }

  getEmptyFieldsAmount() {
    let result = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (!this.board[i][j].ship) result++;
      }
    }
    return result;
  }

  isGameOver() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.board[i][j].ship) {
          if (!this.board[i][j].ship.isSunk()) {
            return false;
          }
        }
      }
    }
    return true;
  }
}
