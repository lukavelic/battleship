import {game} from "./index.js";

const RenderFactory = () => {
    let submitCount = 0;

    const initializeSubmitButton = () => {
        const submit = document.querySelector('#submit-name');

        submit.addEventListener('click', submitInput);
    };

    const submitInput = () => {
        submitCount++;
        game.getPlayerName();

        if(submitCount === 2) {
            renderUI();
        };
    };

    const renderUI = () => {
        const pageContainer = document.querySelector('#container');

        pageContainer.innerHTML = `
            <div class="board" id="board-1"></div>
            <div class="board" id="board-2"></div>
            <div class="ui-container" id="ui-container"></div>
        `
    };

    const renderBoard = (id) => {
        const boardDiv = document.querySelector(`#board-${id}`);
        boardDiv.innerHTML = '';

        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                let board;
                if(id === 1) {
                    board = game.gameboard1.getBoard();
                } else board = game.gameboard2.getBoard();

                console.log(board)

                const tile = document.createElement('div');
                tile.setAttribute('id', `${j}-${i}`);

                if(board[j][i] === 2) {
                    tile.setAttribute('class', 'tile hit');
                } else if(board[j][i] === 3) {
                    tile.setAttribute('class', 'tile miss');
                } else tile.setAttribute('class', 'tile fog');
    
                boardDiv.appendChild(tile);
            };
        };
    };

    const updateTile = (value, x, y) => {
        const tile = document.querySelector(`#${x}-${y}`);

        if(value === 1 || value === 2) {
            tile.setAttribute('class', 'hit');
        } else {
            tile.setAttribute('class', 'miss');
        };
    };

    return {initializeSubmitButton, submitInput, renderUI, renderBoard, updateTile};
};

export {RenderFactory};