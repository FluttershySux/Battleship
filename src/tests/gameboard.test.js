/* eslint-disable no-undef */
import Gameboard from '../factories/gameboard';
import Ship from '../factories/ship';

jest.mock('../game');

describe('Gameboard', () => {
  let gameboard;
  let ship;

  const testBoard = [];

  for (let i = 0; i < 10; i++) {
    testBoard.push([]);
    for (let j = 0; j < 10; j++) {
      testBoard[i].push({ ship: false, shot: false });
    }
  }

  beforeEach(() => {
    gameboard = new Gameboard();
    ship = new Ship(3);
  });

  test('gameboard is correctly initialised', () => {
    expect(gameboard.board).toEqual(expect.arrayContaining(testBoard));
  });

  test('ship is correctly placed horizontally', () => {
    gameboard.placeShip(0, 0, 'row', ship);
    expect(gameboard.board[2][0].ship).toEqual(ship);
  });

  test('ship is correctly placed vertically', () => {
    gameboard.placeShip(0, 0, 'column', ship);
    expect(gameboard.board[0][2].ship).toEqual(ship);
  });

  test('ships cannot be placed on top of each other', () => {
    gameboard.placeShip(0, 0, 'column', ship);
    expect(gameboard.isPlacementPossible(0, 0, 'column', ship)).toBe(false);
  });

  test('ships are recognised', () => {
    gameboard.placeShip(0, 0, 'column', ship);
    expect(gameboard.isShip(0, 0)).toBe(true);
  });

  test('position correctly receives attack', () => {
    gameboard.receiveAttack(0, 0);
    expect(gameboard.board[0][0].shot).toBe(true);
  });

  test('receive attack function recognises if ship is hit on position', () => {
    gameboard.placeShip(0, 0, 'row', ship);
    gameboard.receiveAttack(0, 0);
    expect(gameboard.board[0][0].ship.hits).toStrictEqual([
      { posX: 0, posY: 0 },
    ]);
  });

  test('ships cannot be placed next to each other', () => {
    gameboard.placeShip(0, 0, 'column', ship);
    gameboard.board[1][0].placementUnavailable = true;
    expect(gameboard.isPlacementPossible(1, 0, 'column', ship)).toBe(false);
  });

  test('game is over when all ships are destroyed', () => {
    gameboard.placeShip(0, 0, 'column', ship);
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    gameboard.receiveAttack(0, 2);
    expect(gameboard.isGameOver()).toBe(true);
  });

  test('game is not over when all ships are not destroyed', () => {
    gameboard.placeShip(0, 0, 'column', ship);
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    expect(gameboard.isGameOver()).toBe(false);
  });

  test('ships are placed randomly', () => {
    gameboard.placeShipsRandomly();
    expect(gameboard.getEmptyFieldsAmount()).toEqual(83);
  });
});
