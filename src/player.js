const PlayerFactory = (playerName, id) => {
    let fleet = [];

    const getId = () => {
        return id;
    };

    const getName = () => {
        return playerName;
    }

    const addShipToFleet = (ship) => {
        fleet.push(ship);
    };

    const getFleet = () => {
        return fleet;
    };

    const getShipWithCoords = (x, y) => {
        const fleet = getFleet();
        let ship;

        fleet.forEach(element => {
            const positionArr = element.getPosition();

            for(let i = 0; i < positionArr.length; i++) {
                if(JSON.stringify(positionArr[i]) === JSON.stringify([x, y])) {
                    ship = element;
                };
            };
        });

        if(ship) return ship;
        else throw new Error('Cannot get ship with coordinates');
    };

    return {
        getName, 
        getId, 
        addShipToFleet, 
        getFleet,
        getShipWithCoords,
    };
}

export {PlayerFactory};