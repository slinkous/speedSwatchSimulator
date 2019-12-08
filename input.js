import {GAMESTATE} from "./game.js";

let keyBuffer = [];
let knit = ["up", "left", "right", "down"]
let purl = ["down", "left", "right","up"]

export default class InputHandler {
  constructor(game){
    this.inputStates = {};
    // document.addEventListener("mousedown", event => {
    //   this.inputStates.mouseDown = true;
    //   game.start();
    //   game.resetGame();
    // });
    // document.addEventListener("mouseup", event => {
    //   this.inputStates.mouseDown = false;
    // });
    document.addEventListener("keydown", event => {
      switch(event.keyCode){
        case 37:
          this.inputStates["left"] = true;
          break;
        case 38:
          this.inputStates["up"] = true;

          if(game.gamestate == GAMESTATE.RUNNING){
            game.currentWork.knitStitch();
          }

          break;
        case 39:
          this.inputStates["right"] = true;
          break;
        case 40:
          this.inputStates["down"] = true;
          if(game.gamestate == GAMESTATE.RUNNING){
            game.currentWork.purlStitch();
          }

          break;
        case 27:
          this.inputStates["esc"] = true;
          game.togglePause();
          break;
        case 32:
          this.inputStates["space"] = true;
          break;
        case 16:
          this.inputStates["shift"] = true;
          game.currentWork.advanceStitch();
          break;
        case 13:
          this.inputStates["enter"] = true;
          if(game.gamestate == GAMESTATE.MENU) game.start();
          if(game.gamestate == GAMESTATE.NEXTLEVEL) game.levelUp();
          if(game.gamestate == GAMESTATE.GAMEOVER) game.reset();
          if(game.gamestate == GAMESTATE.RUNNING) game.currentWork.turnWork();
          break;

      }
    });
    document.addEventListener("keyup", event => {
      switch(event.keyCode){
        case 37:
          this.inputStates["left"] = false;
          break;
        case 38:
          this.inputStates["up"] = false;
          break;
        case 39:
          this.inputStates["right"] = false;
          break;
        case 40:
          this.inputStates["down"] = false;
          break;
        case 27:
          this.inputStates["esc"] = false;
          break;
        case 32:
          this.inputStates["space"] = false;
          break;
        case 17:
          this.inputStates["shift"] = false;
          break;
      }
    });
  }
}
