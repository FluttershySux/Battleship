/* eslint-disable no-undef */
import Ship from '../factories/ship';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test('ship function is correctly initialised', () => {
    expect(ship).toEqual({ length: 3, hits: [] });
  });

  test('when a ship is hit, correct value is pushed to array', () => {
    ship.hit(3, 2);
    expect(ship.hits).toStrictEqual([{ posX: 3, posY: 2 }]);
  });

  test('when a ship is hit multiple times, correct values are pushed to array', () => {
    ship.hit(3, 2);
    ship.hit(6, 7);
    expect(ship.hits).toStrictEqual([
      { posX: 3, posY: 2 },
      { posX: 6, posY: 7 },
    ]);
  });

  test('ship is sunk when all positions are hit', () => {
    ship.hit(0, 1);
    ship.hit(3, 4);
    ship.hit(7, 9);
    expect(ship.isSunk()).toBe(true);
  });

  test('ship is not sunk if all positions are not hit', () => {
    ship.hit(0, 1);
    ship.hit(4, 5);
    expect(ship.isSunk()).toBe(false);
  });
});
