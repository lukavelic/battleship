const PlayerFactory = (playerName, id) => {
    let fleet = [];

    const addShipToFleet = (ship) => {
        fleet.push(ship);
    };

    const getFleet = () => {
        return fleet;
    };

    return {playerName, id, addShipToFleet, getFleet};
}

export {PlayerFactory};