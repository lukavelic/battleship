import {game} from "./index.js";

const RenderFactory = () => {
    let submitCount = 0;
    const turnTimeout = 200; 

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
        const ui = document.querySelector('.ui');

        pageContainer.innerHTML = `
        <div class="gameboards">
            <div class="board" id="board-1"></div>
            <div class="board" id="board-2"></div>
        </div>
        `;

        ui.innerHTML = `
            <div class="game-info" id="player-info">${game.getActivePlayer().getName()}'s turn</div>
            <div class="game-info" id="game-info"></div>
            <div class="game-info" id="error-info"></div>
            <div class="end-turn">
                <input type="button" id="end-turn" value="End turn">
            </div>
            <div class="rotation-container" id="rotation-container">
                <input type="button" id="rotate" value="Rotate Ship">
                <div class="rotate-info" id="rotate-info">Placing ship in westerly direction</div>
            </div>
        `;

        renderGameboards();
        rotateButton();
        endTurnButton();
    };

    const renderGameboards = () => {
        const board1 = game.getActivePlayersGameboard();
        const board2 = game.getInactivePlayersGameboard();

        const boardDiv1 = document.querySelector(`#board-${board1.getBoardId()}`);
        boardDiv1.innerHTML = '';
        const boardDiv2 = document.querySelector(`#board-${board2.getBoardId()}`);
        boardDiv2.innerHTML = '';

        const renderBoard = (board, boardDiv) => {
            for(let y = 0; y < 10; y++) {
                for(let x = 0; x < 10; x++) {
                    const tile = document.createElement('div');
                    tile.setAttribute('data-x', `${x}`);
                    tile.setAttribute('data-y', `${y}`);
                    tile.setAttribute('id', `tile-board-${board.getBoardId()}`)
    
                    if(board.getBoard()[x][y] === 1 && board.getBoardId() === game.getActivePlayer().getId()) {
                        tile.setAttribute('class', `tile ship`);
                    } else if(board.getBoard()[x][y] === 2) {
                        tile.setAttribute('class', `tile hit`);
                    } else if(board.getBoard()[x][y] === 3) {
                        tile.setAttribute('class', `tile miss`);
                    } else tile.setAttribute('class', `tile fog`);
        
                    boardDiv.appendChild(tile);
                };
            };
        };

        renderBoard(board1, boardDiv1);
        renderBoard(board2, boardDiv2);

        tileListeners(1);
        tileListeners(2);
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
        } else errorInfo('You are placing ships on the wrong board');
    };

    const turnInfo = (x, y) => {
        document.querySelector('#player-info').innerText = `${game.getActivePlayer().getName()}'s turn`;

        const gameInfo = document.querySelector('#game-info');

        if(x && y && game.getGameState === 'playing') {
            if(!game.getInactivePlayer().getShipWithCoords(x, y).getStatus()) {
                gameInfo.innerText = `You sunk their ${game.getInactivePlayer().getShipWithCoords(x, y).getType()}`;
            };
        } else gameInfo.innerText = '';
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
        }, turnTimeout);
    };

    const changeTurn = () => {
        renderBlurBetweenTurns();

        const board = document.querySelectorAll('.board');
        board.forEach(element => {
           element.style.pointerEvents = ''; 
        });

        setTimeout(() => {
            turnInfo(x, y);
        }, turnTimeout);
        
        // game.changeActivePlayer();
        renderGameboards();
    };

    const gameEndScreen = () => {
        document.querySelector('.container').innerHTML = `${game.getActivePlayer().getName()} is the winner`;

        // if(game.getInactivePlayer().getId() === 1) {
        //     document.querySelector('.container').innerHTML = `${game.getInactivePlayer().getName()} is the winner`;
        // } else document.querySelector('.container').innerHTML = `${game.getInactivePlayer().getName()} is the winner`;
    };

    const rotateButton = () => {
        document.querySelector('#rotate').addEventListener('click', function(e) {
            game.gameboard1.changeShipPlacingOrientation();
            game.gameboard2.changeShipPlacingOrientation();

            const numberedDirection = game.gameboard1.getShipPlacingOrientation()
            let direction = ''

            if(numberedDirection === 0) direction = 'northerly';
            else if(numberedDirection === 1) direction = 'easterly';
            else if(numberedDirection === 2) direction = 'southerly';
            else direction = 'westerly'

            document.querySelector('#rotate-info').innerText = `Placing ship in ${direction} direction`;
        });
    };

    const removeRotateButton = () => {
        document.querySelector('#rotate').remove();
        document.querySelector('#rotate-info').remove();
    };

    const endTurnButton = () => {
        document.querySelector('#end-turn').addEventListener('click', function(e) {
            changeTurn();
        });

        
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
        renderGameboards, 
        tileListeners,
        turnInfo,
        rotateButton,
        renderBlurBetweenTurns,
        changeTurn,
        gameEndScreen,
        removeRotateButton,
        updateTile, 
        clickTile,
    };
};

export {RenderFactory};