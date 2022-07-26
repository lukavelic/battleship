import { GameboardFactory } from "./gameboard.js";
import { PlayerFactory } from "./player.js";
import { ShipFactory } from "./ship.js";
import { game, renderDOM } from "./index.js";

const GameFactory = () => {
    let gameboard1 = GameboardFactory(1);
    let gameboard2 = GameboardFactory(2);

    let player1;
    let player2;
    let isAIActive = false;
    
    let activePlayer = 1;
    let playerCount = 1;
    let gameState = 'setup';

    // AI variables
    let wasTheTileHit = false;
    let movesMadeSinceHit = 0;
    let hitX;
    let hitY;

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
    };

    const createAIPlayer = () => {
        player2 = PlayerFactory('AI', 2);
        isAIActive = true;
        changeActivePlayer();
    }

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

    const checkIfAIIsActive = () => {
        return isAIActive;
    }

    // Game Start Setup

    const gameStartSetup = (x, y) => {
        const orientation = getActivePlayersGameboard().getShipPlacingOrientation();
        const fleetSize = getActivePlayer().getFleet().length;
        let shipType = '';
        let shipLength;

        if(fleetSize === 0) {
            shipLength = 2;
        } else if(fleetSize === 1 || fleetSize === 2) {
            shipLength = 3;
        } else if(fleetSize === 3) {
            shipLength = 4
        } else shipLength = 5;

        const validity = getActivePlayersGameboard().checkIfPositionIsValid(x, y, shipLength);

        const executeTurn = () => {
            createShip(shipType, x, y, orientation);
            renderDOM.renderGameboards();

            const board = document.querySelectorAll('.board');
            board.forEach(element => {
            element.style.pointerEvents = 'none'; 
            });
        };

        if(validity) {
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
            };

            executeTurn();

            if(checkIfAIIsActive() && getActivePlayer().getId() === 2) changeTurn();
            
        } else if (checkIfAIIsActive() && getActivePlayer().getId() === 2) {
            aiTurn(hitX, hitY);
        } else throw new Error('Cannot place a ship here');
    };

    // GAMEPLAY

    const gameplay = (x, y) => {
        
        getInactivePlayersGameboard().hitTile(x, y);

        if(getInactivePlayersGameboard().getTileValue(x, y) === 2) {
            getInactivePlayer().getShipWithCoords(x, y).getHit();
        };

        // Removes listener from hit tile and rerenders board
        
        const boardNode = document.querySelector(`#board-${getInactivePlayersGameboard().getBoardId()}`);
        boardNode.querySelector(`[data-x="${x}"][data-y="${y}"]`).removeEventListener('click', renderDOM.clickTile);

        renderDOM.renderGameboards();

        const board = document.querySelectorAll('.board');
        board.forEach(element => {
        element.style.pointerEvents = 'none'; 
        });

        if(checkForGameEnd()) {
            gameEnd();
            return
        };
    };

    const generateRandomCoordsForAI = () => {
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);

        return [x, y];
    };

    const aiTurn = (x, y) => {
        let randomX = generateRandomCoordsForAI()[0];
        let randomY = generateRandomCoordsForAI()[1];

        let nextX;
        let nextY;

        if(x !== undefined && y !== undefined) {
            if(movesMadeSinceHit === 0) {
                nextX = x + 1;
                nextY = y;
                movesMadeSinceHit++;
            } else if(movesMadeSinceHit === 1) {
                nextX = x;
                nextY = y + 1;
                movesMadeSinceHit++
            } else if(movesMadeSinceHit === 2) {
                nextX = x - 1;
                nextY = y;
                movesMadeSinceHit++;
            } else if(movesMadeSinceHit === 3) {
                nextX = x;
                nextY = y - 1;
                movesMadeSinceHit++;
            } else {
                nextX = x;
                nextY = y - 1;
            };
        };

        if(getGameState() === 'setup') {
            try {
                // Rotation randomness
                const randNum = Math.floor(Math.random() * 10);
                if(randNum < 5) {
                    renderDOM.rotateButtonFunctionality();
                };
                
                gameStartSetup(randomX, randomY);
            } catch (error) {
                console.log(error);
            };
        } else {
            try {
                if(x !== undefined && y !== undefined && movesMadeSinceHit < 5) {
                    gameplay(nextX, nextY);
                    if(gameboard1.getTileValue(nextX, nextY) === 2) {
                        wasTheTileHit = true;
                        movesMadeSinceHit = 0;
                        hitX = nextX;
                        hitY = nextY;
                    } else {
                        wasTheTileHit = false;
                    }
                } else {
                    gameplay(randomX, randomY);
                    if(gameboard1.getTileValue(randomX, randomY) === 2) {
                        wasTheTileHit = true;
                        movesMadeSinceHit = 0;
                        hitX = randomX;
                        hitY = randomY;
                    };
                };
                
                changeTurn(); 

            } catch (error) {
                console.log(error);
                
                movesMadeSinceHit++;

                x = generateRandomCoordsForAI()[0];
                y = generateRandomCoordsForAI()[1];
                
                aiTurn(hitX, hitY);
            };
        };
    };

    const getAiVariables = (str) => {
        if(str === 'x') return hitX;
        else if(str === 'y') return hitY;
    };

    const changeTurn = () => {
        const fleetSize = getPlayer(2).getFleet().length;

        if(getGameState() === 'setup' && fleetSize === 5) {
            changeGameState();
            renderDOM.removeRotateButton();
            renderDOM.turnInfo();
            changeActivePlayer();
        } else changeActivePlayer();
    }

    const getGameState = () => {
        return gameState;
    }

    const changeGameState = () => {
        if(gameState === 'setup') gameState = 'playing';
        else gameState = 'setup';
    };

    const checkForGameEnd = () => {
        const fleet = getInactivePlayer().getFleet();

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
        createAIPlayer,
        changeActivePlayer, 
        getActivePlayer,
        getInactivePlayer,
        checkIfAIIsActive,
        aiTurn,
        getAiVariables,
        gameStartSetup, 
        getGameState, 
        changeGameState, 
        gameplay,
        changeTurn,
        checkForGameEnd,
        createShip, 
        checkTile,
        getActivePlayersGameboard,
        getInactivePlayersGameboard,
    };
};

export { GameFactory };