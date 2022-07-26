const PlayerFactory = (playerName) => {
    let turnStatus = false;

    const startTurn = () => {
        turnStatus = false;
    }

    const endTurn = () => {
        turnStatus = true;
    }

    return {playerName, startTurn, endTurn};
}