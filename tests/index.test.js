import { ShipFactory } from "../ship";

test('Check status', () => {
    const newShip = ShipFactory('destroyer');

    expect(newShip.shipStatus()).toBe(true);
});