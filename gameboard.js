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
        if(activeOrientation < 3) {
            activeOrientation += 1;
        } else {
            activeOrientation -= 3;
        };
    };

    const getShipPlacingOrientation = () => {
        return activeOrientation;
    };

    const resetShipPlacingOrientation = () => {
        activeOrientation = 1;
    }

    const checkIfPositionIsValid = (x, y, length) => {
        let validity;

        const checkIfOccupied = () => {
            const board = getBoard();

            let validity = true;

            for(let i = 0; i < length; i++) {
                if(activeOrientation === 0) { // North
                    if(board[x][y-i] !== 0) validity = false;
                } else if(activeOrientation === 1) { // East
                    if(board[x+i][y] !== 0) validity = false;
                } else if(activeOrientation === 2) { // South
                    if(board[x][y+i] !== 0) validity = false;
                } else if(activeOrientation === 3) { // West
                    if(board[x-i][y] !== 0) validity = false;
                };
            };
            
            return validity;
        };

        if(activeOrientation === 0) { // North
            if(y - length < -1 || checkIfOccupied() !== true) validity = false;
            else validity = true;
        } else if(activeOrientation === 1) { // East
            if(x + length > 10 || checkIfOccupied() !== true) validity = false;
            else validity = true;
        } else if(activeOrientation === 2) { // South
            if(y + length > 10 || checkIfOccupied() !== true) validity = false;
            else validity = true;
        } else if(activeOrientation === 3) { // West
            if(x - length < -1 || checkIfOccupied() !== true) validity = false;
            else validity = true;
        };

        return validity;
    };

    const placeShip = (x, y, length) => {

        if(activeOrientation === 0) {
            for(let i = 0; i < length; i++) {
                board[x][y - i] = 1;
            };
        } else if(activeOrientation === 1) {
            for(let i = 0; i < length; i++) {
                board[x + i][y] = 1;
            };
        } else if(activeOrientation === 2) {
            for(let i = 0; i < length; i++) {
                board[x][y + i] = 1;
            };
        } else if(activeOrientation === 3) {
            for(let i = 0; i < length; i++) {
                board[x - i][y] = 1;
            };
        }; 
    };

    const getTileValue = (x, y) => {
        return board[x][y];
    };

    const hitTile = (x, y) => {
        // if tile contains a ship, change to 2, if nothing, 3
        if(board[x][y] === 1) {
            board[x][y] = 2;
        } else if(board[x][y] === 0) {
            board[x][y] = 3;
        } else throw new Error('Tile is already hit');
    };

    return {
        checkIfPositionIsValid, 
        getBoard,
        changeShipPlacingOrientation,
        getShipPlacingOrientation, 
        resetShipPlacingOrientation, 
        placeShip,
        getTileValue, 
        hitTile,
    };
};

export {GameboardFactory}