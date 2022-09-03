export default class Ship {
  constructor(length, type) {
    this.length = length;
    this.type = type;
    this.hits = [];
  }

  hit(x, y) {
    this.hits.push({ posX: x, posY: y });
  }

  isSunk() {
    return this.hits.length === this.length;
  }
}
