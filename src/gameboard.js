const GameboardFactory = () => {
    let board = []
    const createBoard = (() => {
        const letterAxis = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        for(let i = 0; i < 10; i++) {
            for(let j = 1; j <= 10; j++) {
                board.push(`${letterAxis[i]}${j}`);
            };
        };
    })();
    
    
};

export {GameboardFactory}