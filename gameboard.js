import { ShipFactory } from "./ship.js";
import { game } from "./index.js";

const GameboardFactory = () => {

    let board = [];
    
    let activeOrientation = 1;

    // Create board

    const createBoard = (() => {
        for(let i = 0; i < 10; i++) {
            let tempArr = []
            for(let j = 0; j < 10; j++) {
                tempArr.push(0)
            };
            board.push(tempArr);
        };
    })();

    // Board Manipulation

    const getBoard = () => {
        return board;
    }

    const changeShipPlacingOrientation = () => {
        if(activeOrientation < 4) {
            activeOrientation += 1;
        } else {
            activeOrientation -= 3;
        };
    };

    const getShipPlacingOrientation = () => {
        return activeOrientation;
    };

    const checkIfPositionIsValid = (x, y, shipLength) => {
        if(activeOrientation === 0) { // North
            if(y - shipLength < -1) return false;
            else return true;
        } else if(activeOrientation === 1) { // East
            if(x + shipLength > 10) return false;
            else return true;
        } else if(activeOrientation === 2) { // South
            if(y + shipLength > 10) return false;
            else return true;
        } else if(activeOrientation === 3) { // West
            if(x - shipLength < -1) return false;
            else return true;
        };
    };

    const placeShip = (isValid, activePlayer, x, y, shipLength) => {
        if(isValid) {
            if(activeOrientation === 0) {
                for(let i = 0; i < shipLength; i++) {
                    board[x][y - i] = activePlayer;
                };
            } else if(activeOrientation === 1) {
                for(let i = 0; i < shipLength; i++) {
                    board[x + i][y] = activePlayer;
                };
            } else if(activeOrientation === 2) {
                for(let i = 0; i < shipLength; i++) {
                    board[x][y + i] = activePlayer;
                };
            } else if(activeOrientation === 3) {
                for(let i = 0; i < shipLength; i++) {
                    board[x - i][y] = activePlayer;
                };
            }
        } else throw new Error('Cannot place ship here');  
    };

    const getTileValue = (x, y) => {
        return board[x][y];
    };

    const hitTile = (x, y) => {
        if(board[x][y] !== 3) {
            board[x][y] = 3;
        } else throw new Error('Tile is already hit');
    }

    const testFunction = () => {
        return getBoard();
    };

    return {testFunction, getBoard, changeShipPlacingOrientation, getShipPlacingOrientation};
};

export {GameboardFactory}