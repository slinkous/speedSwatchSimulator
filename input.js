export default class InputHandler {
  constructor(game){
    this.inputStates = {};
    document.addEventListener("mousedown", event => {
      this.inputStates.mouseDown = true;
      game.start();
    });
    document.addEventListener("mouseup", event => {
      this.inputStates.mouseDown = false;
    });
    document.addEventListener("keydown", event => {
      switch(event.keyCode){
        case 37:
          this.inputStates["left"] = true;
          break;
        case 38:
          this.inputStates["up"] = true;
          game.currentWork.knitStitch();
          break;
        case 39:
          this.inputStates["right"] = true;
          break;
        case 40:
          this.inputStates["down"] = true;
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
