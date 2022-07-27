const ShipFactory = (type, x, y, orientation) => {
    
    let hitcount = 0;
    let isTheShipActive = true;

    // Get ship info

    const getType = () => {
        return type;
    };

    const getLength = () => {
        let length;

        if(type === 'destroyer') length = 2;
        else if(type === 'submarine') length = 3;
        else if(type === 'cruiser') length = 3;
        else if(type === 'battleship') length = 4;
        else if(type === 'carrier') length = 5;

        return length;
    }

    const getPosition = () => {
        const shipPosition = [x, y]
        return shipPosition;
    };

    const getOrientation = () => {
        return orientation;
    };

    const getStatus = () => {
        return isTheShipActive;
    };

    // Gameplay

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

    return {getType, getLength, getStatus, getPosition, getOrientation, getHit, sinkShip};
};

export {ShipFactory};