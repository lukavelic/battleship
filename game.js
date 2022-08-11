import { GameboardFactory } from "./gameboard.js";
import { PlayerFactory } from "./player.js";
import { ShipFactory } from "./ship.js";
import { renderDOM } from "./index.js";

const GameFactory = () => {
    let gameboard1 = GameboardFactory(1);
    let gameboard2 = GameboardFactory(2);

    let player1;
    let player2;
    
    let activePlayer = 1;
    let playerCount = 1;
    let gameState = 'setup';

    // Player manipulation

    const getPlayerName = () => {

        const input = document.querySelector('#name-input');
        let name = '';

        if(input.value === '') name = `Unknown Player ${playerCount}`;
        else name = input.value;

        playerCount++;
        
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

        console.log(player1, player2);
    };

    const changeActivePlayer = () => {
        if(activePlayer === 1) {
            activePlayer = 2;
        } else {
            activePlayer = 1;
        };
    };

    const getActivePlayer = () => {
        if(activePlayer === 1) return player1;
        else return player2;
    };

    const getInactivePlayer = () => {
        if(activePlayer === 1) return player2;
        else return player1;
    };

    const getPlayer = (id) => {
        if(id === 1) return player1;
        else return player2;
    };

    // Game Start Setup

    const gameStartSetup = (x, y) => {        
        let orientation;
        let validity;
        let shipType = '';
        let shipLength;
        const fleetSize = getActivePlayer().getFleet().length;

        const executeTurn = () => {
            createShip(shipType, x, y, orientation);

            if(getActivePlayer().getId() === 1) {
                renderDOM.renderBoard(1);
            } else renderDOM.renderBoard(2);
        };

        if(fleetSize === 0) {
            shipLength = 2;
        } else if(fleetSize === 1 || fleetSize === 2) {
            shipLength = 3;
        } else if(fleetSize === 3) {
            shipLength = 4
        } else shipLength = 5;

        if(getActivePlayer().getId() === 1) {
            validity = gameboard1.checkIfPositionIsValid(x, y, shipLength);
            orientation = gameboard1.getShipPlacingOrientation();
        } else {
            validity = gameboard2.checkIfPositionIsValid(x, y, shipLength);
            orientation = gameboard2.getShipPlacingOrientation();
        };

        if(validity) {
            if(fleetSize === 0) {
                shipType = 'destroyer';
                executeTurn();
                changeActivePlayer();            
            } else if(fleetSize === 1) {
                shipType = 'submarine';
                executeTurn();  
                changeActivePlayer();  
            } else if(fleetSize === 2) {
                shipType = 'cruiser';
                executeTurn();  
                changeActivePlayer();  
            } else if(fleetSize === 3) {
                shipType = 'battleship';
                executeTurn();  
                changeActivePlayer();  
            } else if(fleetSize === 4) {
                shipType = 'carrier';
                executeTurn();

                if(getActivePlayer().getId() === 2) {
                    changeGameState();
                    renderDOM.removeRotateButton();
                } else changeActivePlayer();
            };
        } else throw new Error('Cannot place a ship here');
    };

    // GAMEPLAY

    const gameplay = (x, y) => {
        
        // getInactivePlayersGameboard().hitTile(x, y);

        // if(getInactivePlayersGameboard().getTileValue(x, y) === 2) {
        //     console.log('hit ship');

        //     getInactivePlayer().getShipWitCoords(x, y).getHit();
        // };



        // Old


        if(getActivePlayer().getId() === 1) {
            gameboard2.hitTile(x, y);

            if(gameboard2.getTileValue(x, y) === 2) {
                console.log('hit ship');
                player2.getShipWitCoords(x, y).getHit();
            };

            // remove listener
            const boardNode = document.querySelector(`#board-2`);
            boardNode.querySelector(`[data-x="${x}"][data-y="${y}"]`).removeEventListener('click', renderDOM.clickTile);

            renderDOM.renderBoard(2);

            changeActivePlayer();
        } else {
            gameboard1.hitTile(x, y);
            
            if(gameboard1.getTileValue(x, y) === 2) {
                console.log('hit ship');
                player1.getShipWitCoords(x, y).getHit();
            };

            // remove listener
            const boardNode = document.querySelector(`#board-1`);
            boardNode.querySelector(`[data-x="${x}"][data-y="${y}"]`).removeEventListener('click', renderDOM.clickTile);

            renderDOM.renderBoard(1);

            changeActivePlayer();
        };

        if(checkForGameEnd()) {
            gameEnd();
        }
    };

    const getGameState = () => {
        return gameState;
    }

    const changeGameState = () => {
        if(gameState === 'setup') gameState = 'playing';
        else gameState = 'setup';
    };

    const checkForGameEnd = () => {
        const fleet = getActivePlayer().getFleet();

        const checkIfSunk = (element) => {
            return element.getStatus() === false;
        }
        
        const fleetSunk = fleet.every(checkIfSunk);

        return fleetSunk;
    };

    const gameEnd = () => {
        renderDOM.gameEndScreen();
    }

    // Ship manipulation

    const createShip = (type, x, y, shipOrientation) => {
        
        const ship = ShipFactory(type, x, y, shipOrientation);
        let length = ship.getLength();

        getActivePlayer().addShipToFleet(ship);

        if(getActivePlayer().getId() === 1) {
            gameboard1.placeShip(x, y, length);
        } else {
            gameboard2.placeShip(x, y, length);
        };
    };

    // Board manipulation

    const getActivePlayersGameboard = () => {
        if(getActivePlayer().getId() === 1) return gameboard1;
        else return gameboard2;
    };

    const getInactivePlayersGameboard = () => {
        if(getActivePlayer().getId() === 1) return gameboard2;
        else return gameboard1;
    };

    const checkTile = (x, y) => {
        if(activePlayer === 1) {
            const tileValue = gameboard2.getBoard()[x][y];
            return tileValue;
        } else {
            const tileValue = gameboard1.getBoard()[x][y];
            return tileValue;
        };
    };

    // Check which ship is in position

    return {
        gameboard1, 
        gameboard2, 
        gameState, 
        getPlayer, 
        getPlayerName, 
        createPlayer, 
        changeActivePlayer, 
        getActivePlayer,
        getInactivePlayer,
        gameStartSetup, 
        getGameState, 
        changeGameState, 
        gameplay,
        checkForGameEnd,
        createShip, 
        checkTile,
        getActivePlayersGameboard,
        getInactivePlayersGameboard,
    };
};

export { GameFactory };