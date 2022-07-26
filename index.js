import { ShipFactory } from "./ship.js";
import { GameboardFactory } from "./gameboard.js"

console.log('test')
const battleship = ShipFactory('battleship');
console.log(battleship)
// battleship.getStatus()

const gameboard = GameboardFactory();