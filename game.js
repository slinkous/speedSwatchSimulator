import InputHandler from "./input.js"

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3
}

export default class Game{
  constructor(gameWidth, gameHeight){
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gamestate = GAMESTATE.MENU;

    this.input = new InputHandler(this);
  }
  start(){
    if(this.gamestate != GAMESTATE.MENU) return;
    this.gamestate = GAMESTATE.RUNNING;
  }
  update(){
    if(this.gamestate == GAMESTATE.PAUSED || this.gamestate == GAMESTATE.GAMEOVER || this.gamestate == GAMESTATE.MENU) return;
  }
  draw(ctx){
    //main game running
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
    ctx.font = "36px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Running", this.gameWidth/2, this.gameHeight/2)

    if(this.gamestate == GAMESTATE.PAUSED){
      ctx.fillStyle = "green";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "36px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Game Paused", this.gameWidth/2, this.gameHeight/2)
    }
    if(this.gamestate == GAMESTATE.MENU){
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
      ctx.font = "36px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Game Menu", this.gameWidth/2, this.gameHeight/2)
    }
  }
  togglePause(){
    if(this.gamestate == GAMESTATE.PAUSED ){
      this.gamestate = GAMESTATE.RUNNING
    } else {
      this.gamestate = GAMESTATE.PAUSED
    }
  }
}
