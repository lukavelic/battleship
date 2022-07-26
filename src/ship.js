const ShipFactory = (shipType) => {
    const type = shipType;
    let hitcount = 0;
    let isTheShipActive = true;

    const getHit = () => {
        hitcount++;
        
        if(type === 'destroyer' && hitcount === 2) {
            this.sinkShip();
        } else if(type === 'submarine' && hitcount === 3) {
            this.sinkShip();
        } else if(type === 'cruiser' && hitcount === 3) {
            this.sinkShip();
        } else if(type === 'battleship' && hitcount === 4) {
            this.sinkShip();
        } else if(type === 'carrier' && hitcount === 5) {
            this.sinkShip();
        };
    };

    const sinkShip = () => {
        isTheShipActive = false;
    };

    const shipStatus = () => {
        return isTheShipActive;
    };

    return {getHit, shipStatus};
};

export {ShipFactory};