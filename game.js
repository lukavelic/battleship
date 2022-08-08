import { GameboardFactory } from "./gameboard.js";
import { PlayerFactory } from "./player.js";
import { ShipFactory } from "./ship.js";
import { renderDOM } from "./index.js";

const GameFactory = () => {
    let gameboard1 = GameboardFactory();
    let gameboard2 = GameboardFactory();

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

        
        console.log(activePlayer)
    };

    const getActivePlayer = () => {
        if(activePlayer === 1) return player1;
        else return player2;
    };

    const getActivePlayerId = () => {
        if(activePlayer === 1) return 1;
        else return 2;
    };

    const getPlayer = (id) => {
        if(id === 1) return player1;
        else return player2;
    };

    // Game Start Setup

    const gameStartSetup = (coords) => {
        const x = coords.slice(0,1);
        const y = coords.slice(-1);

        if(player1 && player2) {
            const player = getActivePlayer();
            const playerId = getActivePlayer().getId();

            let orientation;

            if(playerId === 1) {
                orientation = gameboard1.getShipPlacingOrientation();
            } else orientation = gameboard2.getShipPlacingOrientation();

            let fleetSize = player.getFleet().length;
            console.log(fleetSize)
            let shipType = '';

            if(fleetSize === 0) {
                shipType = 'destroyer';                
            } else if(fleetSize === 1) {
                shipType = 'submarine';
            } else if(fleetSize === 2) {
                shipType = 'cruiser';
            } else if(fleetSize === 3) {
                shipType = 'battleship';
            } else if(fleetSize === 4) {
                shipType = 'carrier';
            } else changeGameState();

            createShip(shipType, x, y, orientation);
            changeActivePlayer();
        };
    };

    // GAMEPLAY

    const gameplay = (id) => {
        console.log(id)
        const x = id.slice(0,1);
        const y = id.slice(-1);

        if(getActivePlayerId() === 1) {
            gameboard2.hitTile(x,y);
            console.log('hit board 2');

            // remove listener
            const boardNode = document.querySelector(`#board-2`);
            boardNode.querySelector(`[id="${id}"]`).removeEventListener('click', renderDOM.clickTile);

            // renderDOM.renderBoard(1);
            renderDOM.renderBoard(2);

            changeActivePlayer();
        } else {
            gameboard1.hitTile(x,y);
            console.log('hit board 1');

            // remove listener
            const boardNode = document.querySelector(`#board-1`);
            boardNode.querySelector(`[id="${id}"]`).removeEventListener('click', renderDOM.clickTile);

            renderDOM.renderBoard(1);
            // renderDOM.renderBoard(2);

            changeActivePlayer();
        };

        console.log(gameboard1.getBoard(), gameboard2.getBoard())
    };

    const getGameState = () => {
        return gameState;
    }

    const changeGameState = () => {
        if(gameState === 'setup') gameState = 'playing';
        else gameState = 'setup';
    };

    // Ship manipulation

    const createShip = (type, x, y, shipOrientation) => {
        let length;

        if (activePlayer === 1) {
            const tileValidity = gameboard1.checkIfPositionIsValid(x,y,length);
            if(tileValidity) {
                let ship = ShipFactory(type, x, y, shipOrientation);
                length = ship.getLength();
                player1.addShipToFleet(ship);
                gameboard1.placeShip(tileValidity, x, y, length);
            };            
        } else {
            const tileValidity = gameboard2.checkIfPositionIsValid(x,y,length);
            if(tileValidity) {
                let ship = ShipFactory(type, x, y, shipOrientation);
                length = ship.getLength();
                player2.addShipToFleet(ship);
                gameboard2.placeShip(tileValidity, x, y, length);
            };            
        };
    };

    // Board manipulation

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

    const getShipWithCoordinates = (x, y) => {
        if(activePlayer === 1) {
            for(let i = 0; i < player2.getFleet().length; i++) {
                const shipCoordArr = player2.getFleet()[i].getPosition();

                console.log(shipCoordArr);
                
            }
        } else {
        }
    };

    return {
        gameboard1, 
        gameboard2, 
        gameState, 
        getPlayer, 
        getPlayerName, 
        createPlayer, 
        changeActivePlayer, 
        getActivePlayer, 
        getActivePlayerId,
        gameStartSetup, 
        getGameState, 
        changeGameState, 
        gameplay, 
        createShip, 
        checkTile, 
        getShipWithCoordinates,
    };
};

export { GameFactory };