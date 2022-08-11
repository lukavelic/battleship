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
            <div class="game-info" id="error-info"></div>
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

        for(let y = 0; y < 10; y++) {
            for(let x = 0; x < 10; x++) {
                const tile = document.createElement('div');
                tile.setAttribute('data-x', `${x}`);
                tile.setAttribute('data-y', `${y}`);
                tile.setAttribute('id', `tile-board-${id}`)
                if(board[x][y] === 1) {
                    tile.setAttribute('class', `tile ship`);
                } else if(board[x][y] === 2) {
                    tile.setAttribute('class', `tile hit`);
                } else if(board[x][y] === 3) {
                    tile.setAttribute('class', `tile miss`);
                } else tile.setAttribute('class', `tile fog`);
    
                boardDiv.appendChild(tile);
            };
        };

        tileListeners(id);
    };

    const tileListeners = (id) => {
        const tiles = document.querySelectorAll(`#tile-board-${id}`);

        tiles.forEach((element) => {
            element.addEventListener('click', clickTile);
        })
    };

    const clickTile = (e) => {
        const boardId = parseInt(e.target.getAttribute('id').slice(-1));
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);

        if(game.getGameState() === 'setup' && game.getActivePlayer().getId() === boardId) {
            game.gameStartSetup(x, y);
            errorInfo();
        } else if(game.getGameState() === 'playing') {
            if(game.getActivePlayer().getId() !== boardId) {
                game.gameplay(x, y);
                errorInfo();
            } else {
                errorInfo('You are hitting the wrong board!');
            };
        } else errorInfo('You are placing ships on the wrong board')

        turnInfo(x, y);
        renderBlurBetweenTurns();
    };

    const turnInfo = (x, y) => {
        document.querySelector('#player-info').innerText = `Player ${game.getActivePlayer().getId()}'s turn`;

        const str = '';
    };

    const errorInfo = (msg) => {
        if(msg) {
            document.querySelector('#error-info').innerText = `${msg}`;
        } else document.querySelector('#error-info').innerText = '';
    };

    const renderBlurBetweenTurns = () => {
        const modal = document.querySelector('.modal');

        modal.style.display = 'block';

        setTimeout(() => {
            (function() {
                modal.style.display = 'none';
            })();
        }, 3000);
    }

    const gameEndScreen = () => {
        if(game.getActivePlayer().getId() === 1) {
            document.querySelector('.container').innerHTML = `Player 2 is the winner`;
        } else document.querySelector('.container').innerHTML = `Player 1 is the winner`;
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
        const tile = document.querySelector(`[data-x='${x}'][data-y='${y}']`);

        // if(value === 1 || value === 2) {
        //     tile.setAttribute('class', 'hit');
        // } else {
        //     tile.setAttribute('class', 'miss');
        // };
    };

    return {
        initializeSubmitButton,
        submitInput,
        renderUI, 
        renderBoard, 
        tileListeners,
        rotateButton,
        gameEndScreen,
        removeRotateButton,
        updateTile, 
        clickTile,
    };
};

export {RenderFactory};