/* eslint-disable no-undef */
import Player from '../factories/player';

jest.mock('../game');

describe('Player', () => {
  let user;
  let computer;
  let randomMock;

  beforeEach(() => {
    user = new Player('user');
    computer = new Player('computer');
    randomMock = jest.spyOn(global.Math, 'random');
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  test('player is created', () => {
    expect(user.name).toBe('user');
  });

  test('player can attack', () => {
    expect(user.attack(0, 0, computer.gameboard)).toBe(true);
  });

  test('computer can randomly attack', () => {
    randomMock.mockReturnValue(0.2);
    computer.randomAttack(user.gameboard);
    expect(user.gameboard.board[2][2].shot).toBe(true);
  });

  test('computer cannot hit the same position twice', () => {
    randomMock.mockRestore();
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        user.gameboard.board[i][j].shot = true;
      }
    }
    user.gameboard.board[0][0].shot = false;
    computer.randomAttack(user.gameboard);
    expect(user.gameboard.board[0][0].shot).toBe(true);
  });

  test('turns are swapped', () => {
    user.setTurn();
    expect(user.getTurn()).toBe(true);
  });

  test('considering attack is true when ai is playing', () => {
    computer.setConsideringAttack();
    expect(computer.consideringAttack()).toBe(true);
  });

  test('computer shots are recorded', () => {
    randomMock.mockReturnValue(0.2);
    computer.randomAttack(user.gameboard);
    expect(computer.getHits()).toEqual([{ x: 2, y: 2 }]);
  });
});
