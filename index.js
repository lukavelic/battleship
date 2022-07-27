import { ShipFactory } from "./ship.js";
import { PlayerFactory } from "./player.js";
import { GameboardFactory } from "./gameboard.js";
import { GameFactory } from "./game.js";

console.log('test');

const game = GameFactory();
game.createPlayer('luka', 1);
console.log(game.getActivePlayer())
console.log(game.gameboard.testFunction())

export {game};

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