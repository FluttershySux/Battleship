import { getShipType, showUnavailCells, removeUnavailCells } from './dom';
import { players } from './game';

// Component index is needed for proper ship placement on the board
// Variable is equal to the specific ship component a user is dragging, which all have a unique data-index value
let componentIndex;

function setComponentIndex(e) {
  componentIndex = e.target.dataset.index;
}

function dragStartHandler(e) {
  setTimeout(() => {
    e.target.style.display = 'none';
  }, 0);

  e.dataTransfer.setData('text/plain', e.target.id);

  players.user.gameboard.checkAround();
  showUnavailCells();
}

function dragEndHandler(e) {
  e.target.style.display = 'flex';

  removeUnavailCells();
}

function dragOverHandler(e) {
  e.preventDefault();
}

function dropHandler(e) {
  const draggedShip = document.getElementById(
    e.dataTransfer.getData('text/plain')
  );

  const alignment = getComputedStyle(draggedShip).flexDirection;

  let { x, y } = {
    x: parseInt(e.target.dataset.x, 10),
    y: parseInt(e.target.dataset.y, 10),
  };

  if (alignment === 'column') {
    y -= componentIndex;
  } else {
    x -= componentIndex;
  }

  getShipType(x, y, draggedShip, alignment);
}

export default function addDragAndDropEventListeners() {
  const ships = document.querySelectorAll('.ship');
  ships.forEach((ship) => {
    ship.addEventListener('mousedown', setComponentIndex);
    ship.addEventListener('dragstart', dragStartHandler);
    ship.addEventListener('dragend', dragEndHandler);
  });

  const cells = document.querySelectorAll('.grid-square');
  cells.forEach((cell) => {
    cell.addEventListener('dragover', dragOverHandler);
    cell.addEventListener('drop', dropHandler);
  });
}
