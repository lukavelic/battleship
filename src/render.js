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

            // CPU Button

            const inputContainer = document.querySelector('.player-input');

            const button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('id', 'cpu');
            button.setAttribute('value', 'AI Enemy!');

            button.addEventListener('click', initiateAIPlayer)

            inputContainer.appendChild(button)
        };
    };

    const renderUI = () => {
        const pageContainer = document.querySelector('#container');
        const ui = document.querySelector('.ui');

        pageContainer.innerHTML = `
        <div class="gameboards">
            <div class="board-container">
                <div class="board-player-name" id="board-player-name">${game.getPlayer(1).getName()}</div>
                <div class="board" id="board-1"></div>
            </div>
            <div class="ui">
                <div class="game-info" id="player-info">${game.getActivePlayer().getName()}'s turn to place a ship!</div>
                <div class="game-info" id="game-info"></div>
                <div class="game-info" id="error-info"></div>
                <div class="button-container">
                    <input type="button" id="end-turn" value="End turn">
                    <input type="button" id="rotate" value="Rotate Ship \n (East)">
                </div>
            </div>
            <div class="board-container">
                <div class="board-player-name" id="board-player-name">${game.getPlayer(2).getName()}</div>
                <div class="board" id="board-2"></div>
            </div>
        </div>
        `;

        // ui.innerHTML = `
        //     <div class="game-info" id="player-info">${game.getActivePlayer().getName()}'s turn</div>
        //     <div class="game-info" id="game-info"></div>
        //     <div class="game-info" id="error-info"></div>
        //     <div class="button-container">
        //         <input type="button" id="end-turn" value="End turn">
        //         <input type="button" id="rotate" value="Rotate Ship \n (East)">
        //     </div>
        // `;

        renderGameboards();
        rotateButton();
        endTurnButton();

        document.querySelector('#end-turn').style.pointerEvents = 'none';
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

        // Remove click from end turn button until a ship is placed

        document.querySelector('#end-turn').style.pointerEvents = 'none';
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
            
            // Restore click for end turn button
            document.querySelector('#end-turn').style.pointerEvents = '';
        } else if(game.getGameState() === 'playing') {
            if(game.getActivePlayer().getId() !== boardId) {
                game.gameplay(x, y);
                errorInfo();

                // Restore click for end turn button
                document.querySelector('#end-turn').style.pointerEvents = '';
            } else {
                errorInfo('You are hitting the wrong board!');
            };
        } else errorInfo('You are placing ships on the wrong board');
    };

    const turnInfo = () => {
        if(game.getGameState() === 'setup') {
            console.log('turn info setup')
            document.querySelector('#player-info').innerText = `${game.getActivePlayer().getName()}'s turn to place a ship!`;
        } else {
            console.log('turn info playing')
            document.querySelector('#player-info').innerText = `${game.getActivePlayer().getName()}'s turn to attack!`;
        };
        // const gameInfo = document.querySelector('#game-info');

        // if(x && y && game.getGameState === 'playing') {
        //     if(!game.getInactivePlayer().getShipWithCoords(x, y).getStatus()) {
        //         gameInfo.innerText = `You sunk their ${game.getInactivePlayer().getShipWithCoords(x, y).getType()}`;
        //     };
        // } else gameInfo.innerText = '';
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
        if(game.checkIfAIIsActive() && game.getActivePlayer().getId() === 1) {
            game.changeTurn();
            game.aiTurn();
        } else {
            renderBlurBetweenTurns();
    
            setTimeout(() => {
                turnInfo();
            }, turnTimeout);

            game.changeTurn();
        };

        const board = document.querySelectorAll('.board');
        board.forEach(element => {
            element.style.pointerEvents = ''; 
        });

        renderGameboards();
    };

    const gameEndScreen = () => {
        // Remove click from gameboards

        document.querySelector('.gameboards').style.pointerEvents = 'none';


        const modal = document.querySelector('.modal');
        const modalContent = document.querySelector('.modal-content');

        modalContent.innerHTML = `        
            <p>${game.getActivePlayer().getName()} is the winner!</p>
            <input type="button" id="reload" value="Start New Game!" onClick="window.location.reload();">
        `;

        // const reloadButton = document.querySelector('#reload').addEventListener('click', function(e) {

        // })

        setTimeout(() => {
            modal.style.display = 'block';
        }, turnTimeout);

        // document.querySelector('.container').innerHTML = `${game.getActivePlayer().getName()} is the winner`;
    };

    const rotateButton = () => {
        document.querySelector('#rotate').addEventListener('click', function(e) {
            game.gameboard1.changeShipPlacingOrientation();
            game.gameboard2.changeShipPlacingOrientation();

            const numberedDirection = game.gameboard1.getShipPlacingOrientation()
            let direction = ''

            if(numberedDirection === 0) direction = 'North';
            else if(numberedDirection === 1) direction = 'East';
            else if(numberedDirection === 2) direction = 'South';
            else direction = 'West'

            document.querySelector('#rotate').value = `Rotate Ship \n (${direction})`;
        });
    };

    const removeRotateButton = () => {
        document.querySelector('#rotate').remove();
    };

    const endTurnButton = () => {
        document.querySelector('#end-turn').addEventListener('click', function(e) {
            changeTurn();
        });
    };

    const initiateAIPlayer = () => {
        game.createAIPlayer();

        renderUI();
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