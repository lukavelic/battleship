const PlayerFactory = (playerName, id) => {
    let fleet = [];

    const getId = (id) => {
        return id;
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