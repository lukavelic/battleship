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

    const getPlayerName = () => {
        const input = document.querySelector('#name-input');
        const name = '';

        if(input.value === '') name = 'Unknown Player';
        else name = input.value;
        
        createPlayer(name);
    };

    const createPlayer = (name) => {
        if(activePlayer === 1) {
            player1 = PlayerFactory(name, 1);
            changeActivePlayer();
        } else {
            player2 = PlayerFactory(name, 2);
            changeActivePlayer();
        };
    };

    const changeActivePlayer = () => {
        if(activePlayer === 1) {
            activePlayer = 2;
        } else activePlayer = 1;
    };

    const getActivePlayer = () => {
        if(activePlayer === 1) return player1;
        else return player2;
    };

    const getPlayer = (id) => {
        if(id === 1) return player1;
        else return player2;
    };

    // Ship manipulation

    const createShip = (type, x, y, shipOrientation) => {
        let length;

        if (activePlayer = 1) {
            let ship = ShipFactory(type, x, y, shipOrientation);
            length = ship.getLength();
            player1.addShipToFleet(ship);

            const tileValidity = gameboard1.checkIfPositionIsValid(x,y,length)
            gameboard1.placeShip(tileValidity, x, y, length);
        } else {
            let ship = ShipFactory(type, x, y, shipOrientation);
            length = ship.getLength();
            player2.addShipToFleet(ship);

            const tileValidity = gameboard2.checkIfPositionIsValid(x,y,length)
            gameboard2.placeShip(tileValidity, x, y, length);
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

    // Check which ship is in position

    const getShipWithCoordinates = (x, y) => {
        if(activePlayer === 1) {
            for(let i = 0; i < player2.getFleet().length; i++) {
                const shipCoordArr = player2.getFleet()[i].getPosition();

                console.log(shipCoordArr);
                
            }
        } else {
        }
    };

    return {gameboard1, gameboard2, getPlayer, getPlayerName, createPlayer, changeActivePlayer, getActivePlayer, createShip, checkTile, getShipWithCoordinates}
}

export { GameFactory };