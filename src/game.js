import { GameboardFactory } from "./gameboard.js";
import { PlayerFactory } from "./player.js";
import { ShipFactory } from "./ship.js";

const GameFactory = () => {
    let gameboard1 = GameboardFactory();
    let gameboard2 = GameboardFactory();

    let player1;
    let player2;
    
    let activePlayer = 1;

    // Player manipulation

    const createPlayer = (name, id) => {
        if(activePlayer === 1) {
            player1 = PlayerFactory(name, id);
        } else player2 = PlayerFactory(name, id);
    };

    const changeActivePlayer = () => {
        if(activePlayer === 1) {
            activePlayer = 2;
        } else activePlayer = 1;
    };

    const getActivePlayer = () => {
        if(activePlayer === 1) return player1;
        else return player2;
    }

    // Ship manipulation

    const createShip = (type, x, y, shipOrientation) => {
        if (activePlayer = 1) {
            let ship = ShipFactory(type, x, y, shipOrientation)
            player1.addShipToFleet(ship);
        } else {
            let ship = ShipFactory(type, x, y, shipOrientation)
            player2.addShipToFleet(ship);
        };
    };

    // Board manipulation

    const checkTile = (x, y) => {
        if(getActivePlayer() === 1) {
            const tileValue = gameboard2.getBoard()[x][y];
            return tileValue;
        } else {
            const tileValue = gameboard1.getBoard()[x][y];
            return tileValue;
        };
    };

    return {gameboard1, gameboard2, createPlayer, changeActivePlayer, getActivePlayer, createShip, checkTile}
}

export { GameFactory };