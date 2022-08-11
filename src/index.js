import { GameFactory } from "./game.js";
import { RenderFactory } from "./render.js";

// INITIAL SETUP

const renderDOM = RenderFactory();
const game = GameFactory();
renderDOM.initializeSubmitButton(); 

export {game, renderDOM};