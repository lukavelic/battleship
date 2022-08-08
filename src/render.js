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
        } else {
            const inputHeader = document.querySelector('.input-header');
            inputHeader.innerText = 'Input Player 2 Name';

            document.querySelector('#name-input').value = '';
        };
    };

    const renderUI = () => {
        const pageContainer = document.querySelector('#container');

        pageContainer.innerHTML = `
            <div class="board" id="board-1"></div>
            <div class="board" id="board-2"></div>
            <div class="ui-container" id="ui-container">
                <input type="button" id="rotate" value="Rotate Ship">
                <div class="rotate-info" id="rotate-info">Placing ship in ${game.gameboard1.getShipPlacingOrientation()} direction</div>
            </div>
            <div class="game-info" id="player-info"></div>
            <div class="game-info" id="game-info"></div>
        `;

        renderBoard(1);
        renderBoard(2);

        rotateButton();
    };

    const renderBoard = (id) => {
        const boardDiv = document.querySelector(`#board-${id}`);
        boardDiv.innerHTML = '';

        let board;

        if(id === 1) {
            board = game.gameboard1.getBoard();
        } else board = game.gameboard2.getBoard();

        for(let i = 0; i < 10; i++) {
            for(let j = 0; j < 10; j++) {
                const tile = document.createElement('div');
                tile.setAttribute('id', `${j}-${i}`);
                if(board[j][i] === 1) {
                    tile.setAttribute('class', `tile ship tile-board${id}`);
                } else if(board[j][i] === 2) {
                    tile.setAttribute('class', `tile hit tile-board${id}`);
                } else if(board[j][i] === 3) {
                    tile.setAttribute('class', `tile miss tile-board${id}`);
                } else tile.setAttribute('class', `tile fog tile-board${id}`);
    
                boardDiv.appendChild(tile);
            };
        };

        tileListeners(id);
    };

    const tileListeners = (id) => {
        const tiles = document.querySelectorAll(`.tile-board${id}`);

        tiles.forEach((element) => {
            element.addEventListener('click', clickTile);
        })
    };

    const clickTile = (e) => {
        console.log(e.target)
        const boardId = parseInt(e.target.getAttribute('class').slice(-1));
        const tileId = e.target.id;

        if(game.getGameState() === 'setup' && game.getActivePlayerId() === boardId) {
            game.gameStartSetup(tileId);
        } else if(game.getGameState() === 'playing') {
            if(game.getActivePlayerId() !== boardId) {
                game.gameplay(tileId);
            } else throw new Error('You are hitting the wrong board');
        };

        turnInfo(tileId);
    };

    const turnInfo = (tileId) => {
        document.querySelector('#player-info').innerText = `Player ${game.getActivePlayerId()}'s turn`;

        const str = '';

        // if()
        document.querySelector('#game-info').innerText = ``
    };

    const rotateButton = () => {
        document.querySelector('#rotate').addEventListener('click', function(e) {
            game.gameboard1.changeShipPlacingOrientation();
            game.gameboard2.changeShipPlacingOrientation();

            document.querySelector('#rotate-info').innerText = `Placing ship in ${game.gameboard1.getShipPlacingOrientation()} direction`;
        });
    };

    const removeRotateButton = () => {
        document.querySelector('#rotate').remove();
        document.querySelector('#rotate-info').remove();
    }

    const updateTile = (value, x, y) => {
        const tile = document.querySelector(`#${x}-${y}`);

        if(value === 1 || value === 2) {
            tile.setAttribute('class', 'hit');
        } else {
            tile.setAttribute('class', 'miss');
        };
    };

    return {
        initializeSubmitButton,
        submitInput,
        renderUI, 
        renderBoard, 
        tileListeners,
        rotateButton,
        removeRotateButton,
        updateTile, 
        clickTile,
    };
};

export {RenderFactory};