const PlayerFactory = (playerName, id) => {
    let fleet = [];
    let playerId = id;

    const getId = () => {
        return playerId;
    }

    const addShipToFleet = (ship) => {
        fleet.push(ship);
    };

    const getFleet = () => {
        return fleet;
    };

    return {playerName, getId, addShipToFleet, getFleet};
}

export {PlayerFactory};