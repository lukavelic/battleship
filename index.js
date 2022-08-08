import { ShipFactory } from "./ship.js";
import { PlayerFactory } from "./player.js";
import { GameboardFactory } from "./gameboard.js";
import { GameFactory } from "./game.js";
import { RenderFactory } from "./render.js";

console.log('test');

// INITIAL SETUP

const renderDOM = RenderFactory();
const game = GameFactory();
renderDOM.initializeSubmitButton();

// renderDOM.renderUI();
// renderDOM.renderBoard(1);
// renderDOM.renderBoard(2);

// game.createPlayer('luka', 1);
// game.createShip('battleship', 5, 5, 1);
// console.log(game)
// game.checkTile(5,5);
// console.log(game.checkTile(5,5))

export {game, renderDOM};

// const battleship = ShipFactory('battleship', 2, 3, 0);
// console.log(battleship);
// console.log(battleship.getStatus());
// console.log(battleship.getPosition())

// const gameboard = GameboardFactory();

// export { gameboard };

/////////////////// PROJECT OUTLINE //////////////////

// Press square
// Get X and Y coordinates
// 